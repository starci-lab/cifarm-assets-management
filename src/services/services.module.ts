
import { Module } from "@nestjs/common"
import { MenuModule } from "./menu"

@Module({
    imports: [
        MenuModule
    ],
})
export class ServicesModule {}
 
