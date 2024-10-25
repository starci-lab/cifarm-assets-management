import { Global, Module } from "@nestjs/common"
import { MainMenuService } from "./main-menu.service"
import { PolkadotModule } from "./polkadot"
import { ReadlineService } from "./readline.service"

@Global()
@Module({
    imports: [PolkadotModule],
    providers: [MainMenuService, ReadlineService],
    exports: [MainMenuService, ReadlineService],
})
export class MenuModule {}
