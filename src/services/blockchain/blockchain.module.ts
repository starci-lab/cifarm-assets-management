import { Module } from "@nestjs/common"
import { PolkadotModule } from "./polkadot/"

@Module({
    imports: [PolkadotModule],
    providers: [],
    exports: [],
})
export class BlockchainModule {}
