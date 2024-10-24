import { Module } from "@nestjs/common"
import { PolkadotModule } from "./polkadot/"

@Module({
    providers: [PolkadotModule],
    exports: [],
})
export class BlockchainModule {}
