import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountEntity, ConfigEntity } from "@/database"
import { NetworkService } from "./network.service"
@Global()
@Module({
    providers: [
        NetworkService
    ],
    exports: [
        NetworkService
    ],
    imports: [TypeOrmModule.forFeature([AccountEntity, ConfigEntity])],
})
export class CommonModule {}
