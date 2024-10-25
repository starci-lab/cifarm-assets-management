import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountEntity, ConfigEntity, TokenEntity } from "@/database"
import { NetworkService } from "./network.service"
import { TokenService } from "./token.service"
@Global()
@Module({
    providers: [
        NetworkService,
        TokenService
    ],
    exports: [
        NetworkService,
        TokenService
    ],
    imports: [TypeOrmModule.forFeature([AccountEntity, ConfigEntity, TokenEntity])],
})
export class CommonModule {}
