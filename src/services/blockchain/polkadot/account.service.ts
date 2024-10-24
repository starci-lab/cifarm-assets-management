import { Injectable, Logger } from "@nestjs/common"
import { AccountEntity, ConfigEntity, ConfigKey } from "@/database"
import { DataSource } from "typeorm"
import {
    encodeAddress,
    mnemonicGenerate,
    mnemonicToMiniSecret,
    sr25519PairFromSeed,
} from "@polkadot/util-crypto"
import { u8aToHex } from "@polkadot/util"
import { Network, SupportedChainKey } from "@/config"
import "@polkadot/api-augment"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { computeDenomination } from "@/utils"

@Injectable()
export class PolkadotAccountService {
    private readonly logger = new Logger(PolkadotAccountService.name)
    constructor(private readonly dataSource: DataSource) {}

    public async createAccount() {
    // Create a new account
        const mnemonic = mnemonicGenerate()
        const seed = mnemonicToMiniSecret(mnemonic)
        const { publicKey, secretKey } = sr25519PairFromSeed(seed)
        // Save the account to the database
        // Update the previous active account to inactive
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            await queryRunner.manager.update(
                AccountEntity,
                { chain: SupportedChainKey.Polkadot },
                { isActive: false },
            )
            const accountAddress = encodeAddress(publicKey)
            const account = await queryRunner.manager.save(AccountEntity, {
                address: accountAddress,
                publicKey: u8aToHex(publicKey),
                privateKey: u8aToHex(secretKey),
                mnemonic: mnemonic,
                chain: SupportedChainKey.Polkadot,
            })

            await queryRunner.commitTransaction()
            this.logger.log(
                `Account created successfully. Address: ${accountAddress}`,
            )
            return account
        } catch (ex) {
            this.logger.error(ex)
            await queryRunner.rollbackTransaction()
        }
    }

    public async retrieveActiveAccount() {
        return await this.dataSource.getRepository(AccountEntity).findOne({
            where: { chain: SupportedChainKey.Polkadot, isActive: true },
        })
    }

    public async getRelayChainBalance(): Promise<number> {
        const account = await this.retrieveActiveAccount()
        if (!account) {
            this.logger.error("No active account found.")
            return
        }
        //if config/network is not set, mean it is testnet
        const { value } = await this.dataSource.manager.findOne(ConfigEntity, {
            where: { key: ConfigKey.Network },
        })

        const relayChainRpcUrlMap: Record<Network, string> = {
            [Network.Mainnet]: "wss://rpc.polkadot.io",
            [Network.Testnet]: "wss://paseo.dotters.network",
        }
        const relayChainRpcUrl = relayChainRpcUrlMap[value || Network.Testnet]
        
        const wsProvider = new WsProvider(relayChainRpcUrl)
        const polkadotClient = await ApiPromise.create({ provider: wsProvider })
        
        const {
            data: { free: relayChain },
        } = await polkadotClient.query.system.account(account.address)
        return computeDenomination(relayChain.toBigInt(), 10)
    }
}

