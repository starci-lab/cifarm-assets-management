
import { Module } from "@nestjs/common"
import { PolkadotAccountService } from "./account.service"

@Module({
    providers: [ PolkadotAccountService ],
    exports: [ ],
})
export class PolkadotModule {}
