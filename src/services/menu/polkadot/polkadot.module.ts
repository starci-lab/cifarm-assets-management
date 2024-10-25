import { PolkadotBifrostMenuService } from "./bifrost-menu.service"
import { PolkadotMenuService } from "./menu.service"
import { Global, Module } from "@nestjs/common"
import { PolkadotMoonbeamMenuService } from "./moonbeam.service"

@Global()
@Module({
    imports: [],
    providers: [
        PolkadotMenuService,
        PolkadotBifrostMenuService,
        PolkadotMoonbeamMenuService,
    ],
    exports: [
        PolkadotMenuService,
        PolkadotBifrostMenuService,
        PolkadotMoonbeamMenuService,
    ],
})
export class PolkadotModule {}
