import { Global, Module } from "@nestjs/common"
import { PolkadotAccountService } from "./account.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountEntity, ConfigEntity } from "@/database"
import { PolkadotRelayChainService } from "./relay-chain.service"
import { PolkadotUniqueNetworkService } from "./unique-network"

@Global()
@Module({
    providers: [
        PolkadotAccountService,
        PolkadotRelayChainService,
        PolkadotUniqueNetworkService,
    ],
    exports: [
        PolkadotAccountService,
        PolkadotRelayChainService,
        PolkadotUniqueNetworkService,
    ],
    imports: [TypeOrmModule.forFeature([AccountEntity, ConfigEntity])],
})
export class PolkadotModule {}
