import { Injectable, Logger } from "@nestjs/common"
import { ReadlineService } from "../readline.service"
import {
    AccessLevelRole,
    PolkadotAccountService,
    PolkadotMoonbeamService,
} from "../../blockchain"
import { NetworkService } from "../../blockchain"
import { Network } from "@/config"
import { uiPrompts } from "../constants.menu"

@Injectable()
export class PolkadotMoonbeamMenuService {
    private readonly logger = new Logger(PolkadotMoonbeamMenuService.name)

    constructor(
    private readonly readlineService: ReadlineService,
    private readonly moonbeamService: PolkadotMoonbeamService,
    private readonly polkadotAccountService: PolkadotAccountService,
    private readonly networkService: NetworkService,
    ) {}

    public continue() {
        this.readlineService.rl.question(
            uiPrompts().continue,
            () => {
                console.clear()
                this.print()
            },
        )
    }

    public async init() {
        await this.moonbeamService.connect()
    }

    //print menu as cli
    public async print(hide: boolean = false): Promise<void> {
        const network = await this.networkService.getNetwork()
        const activeAccount =
      await this.polkadotAccountService.retrieveActiveAccount()
        const  list = [
            "0. View active account",
            "1. View address",
            "2. View balance",
            "3. Import token",
            "4. Check token balance",
            "5. Transfer token",
            "6. Mint token (MINTER only)",
            `7. Switch network (Current: ${network})`,
        ]

        if (!hide) {
            console.log(`Welcome to token management in the Bifrost Parachain. What would you like to do?
${list.join("\n")}
`)
        }
        this.readlineService.rl.question(uiPrompts().enterChoice, async (answer) => {
            const selectedIndex = parseInt(answer)
            if (
                !isNaN(selectedIndex) &&
        selectedIndex >= 0 &&
        selectedIndex < list.length
            ) {
                this.logger.verbose(`You selected: ${selectedIndex}`)
                // Handle interaction with the selected blockchain here
                switch (selectedIndex) {
                case 0: {
                    //console log as table
                    console.table(activeAccount)
                    this.continue()
                    break
                }
                case 1: {
                    const address = this.moonbeamService.getAddress()
                    console.log(`Address: ${address}`)
                    this.continue()
                    break
                }
                case 2: {
                    const balance = await this.moonbeamService.getBalance()
                    const network = await this.networkService.getNetwork()
                    console.log(
                        `Network: ${network === Network.Testnet ? "Testnet" : "Mainnet"}`,
                    )
                    console.log(`Balance: ${balance}`)
                    this.continue()
                    break
                }
                case 3: {
                    this.readlineService.rl.question(
                        "Enter token name: ",
                        async (name) => {
                            this.readlineService.rl.question(
                                "Enter token address: ",
                                async (address) => {
                                    await this.moonbeamService.importToken(name, address)
                                    this.continue()
                                },
                            )
                        },
                    )
                    break
                }
                case 4: {
                    this.readlineService.rl.question(
                        "Enter token name: ",
                        async (name) => {
                            const balance = await this.moonbeamService.balanceOf(name)
                            console.log(`Balance of ${name}: ${balance}`)
                            this.continue()
                        },
                    )
                    break
                }
                case 6: {
                    this.readlineService.rl.question(
                        "Enter token name: ",
                        async (name) => {
                            const hasRole = await this.moonbeamService.hasRole(name, AccessLevelRole.Minter)
                            if (!hasRole) {
                                this.logger.debug("You do not have the required role to mint tokens.")
                                this.logger.debug("Granting the role MINTER to your account.")
                                await this.moonbeamService.grantRole(name, AccessLevelRole.Minter)
                                this.logger.debug("Role MINTER granted.")
                            }
                            this.readlineService.rl.question(
                                "Enter amount to mint: ",
                                async (amount) => {
                                    const _amount = parseInt(amount)
                                    if (isNaN(_amount)) {
                                        this.logger.error("Invalid amount. Please try again.")
                                        this.print(true)
                                        return
                                    }
                                    this.readlineService.rl.question(
                                        "Enter recipient address: ",
                                        async (address) => {
                                            await this.moonbeamService.mint(name, address, _amount)
                                            this.continue()
                                        },
                                    )
                                })
                        }
                    )
                    break
                }
                }
            } else {
                this.logger.error("Invalid choice. Please try again.")
                this.print(true)
            }
        })
    }
}

// FixedSupplyToken deployed at: 0xE57f83E04E5C93ba2D01d9ed4fE4de234B2DF914
// UnlimitedSupplyToken deployed at: 0xf0B8F9D0358A345626579E89293Db4c1C889F822
