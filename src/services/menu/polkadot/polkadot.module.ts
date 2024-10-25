import { PolkadotBifrostMenuService } from "./bifrost-menu.service"
import { PolkadotMenuService } from "./menu.service"
import { Global, Module } from "@nestjs/common"

@Global()
@Module({
    imports: [],
    providers: [PolkadotMenuService, PolkadotBifrostMenuService],
    exports: [PolkadotMenuService, PolkadotBifrostMenuService],
})
export class PolkadotModule {}
