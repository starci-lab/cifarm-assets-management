import { Module } from "@nestjs/common"
import { ServicesModule } from "./services/services.module"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [ServicesModule,
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "db/sql.sqlite",
            synchronize: true,
            autoLoadEntities: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
