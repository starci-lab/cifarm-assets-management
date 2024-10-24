import { Injectable, Logger } from "@nestjs/common"
import { ReadlineService } from "./readline.service"

@Injectable()
export class PolkadotMenuService {
    private readonly logger = new Logger(PolkadotMenuService.name)

    constructor(
        private readonly readlineService: ReadlineService,
    ) {}
    //print menu as cli
    public print(hide: boolean = false): void {
        const list = ["1. Create a new account"
            ,"2. Faucet the account"
            ,"3. Manage token (Bifrost)"
            ,"4. Manage nfts (Unique Network)"]

        if (!hide) {
            console.log(`
Welcome to Polkadot. What do you want to do?
${list.join("\n")}
`)
        }      
        this.readlineService.rl.question("Enter your choice: ", (answer) => {
            const selectedIndex = parseInt(answer)
            if (!isNaN(selectedIndex) && selectedIndex > 0 && selectedIndex <= list.length) {
                this.logger.verbose(`You selected: ${selectedIndex}`)
                // Handle interaction with the selected blockchain here
            } else {
                this.logger.error("Invalid choice. Please try again.")
                this.print(true)
            }
        })
    }
}
