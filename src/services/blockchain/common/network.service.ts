import { Network } from "@/config"
import { ConfigEntity, ConfigKey } from "@/database"
import { Injectable, Logger } from "@nestjs/common"
import { DataSource } from "typeorm"

@Injectable()
export class NetworkService {
    private readonly logger = new Logger(NetworkService.name)
    constructor(
        private readonly dataSource: DataSource,
    ) {
    }

    public async getNetwork(): Promise<Network> {
        const config = await this.dataSource.manager.findOne(ConfigEntity, {
            where: { key: ConfigKey.Network },
        })
        return config?.value as Network || Network.Testnet
    }

    public async setNetwork(network: Network) {
        await this.dataSource.manager.save(ConfigEntity, {
            key: ConfigKey.Network,
            value: network,
        })
        this.logger.debug(`Network set to ${network}`)
    }
}