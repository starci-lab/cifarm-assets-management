import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { MainMenuService } from "./services"

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(AppModule)
    const mainMenuService: MainMenuService = app.get(MainMenuService)
    mainMenuService.print()
    //await app.close()
}
bootstrap()
