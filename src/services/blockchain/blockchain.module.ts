import { Module } from "@nestjs/common"
import { PolkadotModule } from "./polkadot/"
import { CommonModule } from "./common"

@Module({
    imports: [PolkadotModule, CommonModule],
    providers: [],
    exports: [],
})
export class BlockchainModule {}
