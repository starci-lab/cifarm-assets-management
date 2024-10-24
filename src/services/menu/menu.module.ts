
import { Module } from "@nestjs/common"
import { MainMenuService } from "./main-menu.service"
import { PolkadotMenuService } from "./polkadot-menu.service"
import { ReadlineService } from "./readline.service"

@Module({
    providers: [MainMenuService, PolkadotMenuService, ReadlineService],
    exports: [ ],
})
export class MenuModule {}
