
import { Global, Module } from "@nestjs/common"
import { PolkadotAccountService } from "./account.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountEntity } from "@/database"

@Global()
@Module({
    providers: [ PolkadotAccountService ],
    exports: [ PolkadotAccountService ],
    imports: [ TypeOrmModule.forFeature([ AccountEntity ]) ],
})
export class PolkadotModule {}
