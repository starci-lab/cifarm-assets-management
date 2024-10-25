import { Global, Module } from "@nestjs/common"
import { PolkadotAccountService } from "./account.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountEntity, ConfigEntity, TokenEntity } from "@/database"
import { PolkadotRelayChainService } from "./relay-chain.service"
import { PolkadotUniqueNetworkService } from "./unique-network"
import { PolkadotMoonbeamService } from "./moonbeam"

@Global()
@Module({
    providers: [
        PolkadotAccountService,
        PolkadotRelayChainService,
        PolkadotUniqueNetworkService,
        PolkadotMoonbeamService,
    ],
    exports: [
        PolkadotAccountService,
        PolkadotRelayChainService,
        PolkadotUniqueNetworkService,
        PolkadotMoonbeamService,
    ],
    imports: [TypeOrmModule.forFeature([AccountEntity, ConfigEntity, TokenEntity])],
})
export class PolkadotModule {}
