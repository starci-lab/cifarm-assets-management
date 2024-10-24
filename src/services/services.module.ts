
import { Module } from "@nestjs/common"
import { MenuModule } from "./menu"
import { BlockchainModule } from "./blockchain"

@Module({
    imports: [
        MenuModule,
        BlockchainModule
    ],
})
export class ServicesModule {}
 
