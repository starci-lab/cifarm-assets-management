import { Global, Module } from "@nestjs/common"
import { MainMenuService } from "./main-menu.service"
import { PolkadotMenuService } from "./polkadot-menu.service"
import { ReadlineService } from "./readline.service"

@Global()
@Module({
    imports: [],
    providers: [MainMenuService, PolkadotMenuService, ReadlineService],
    exports: [MainMenuService, PolkadotMenuService, ReadlineService],
})
export class MenuModule {}
