import { SupportedChainKey } from "@/config"
import { TokenEntity } from "@/database"
import { Injectable, Logger } from "@nestjs/common"
import { DataSource } from "typeorm"
import { NetworkService } from "./network.service"

@Injectable()
export class TokenService {
    private readonly logger = new Logger(TokenService.name)
    constructor(
        private readonly networkService: NetworkService,
        private readonly dataSource: DataSource,
    ) {
    }

    public async getToken(name: string, chain: SupportedChainKey = SupportedChainKey.Polkadot): Promise<TokenEntity> {
        const network = await this.networkService.getNetwork()
        return await this.dataSource.manager.findOne(TokenEntity, {
            where: { name, chain, network },
        })
    }

    public async setToken(name: string, address: string, decimals: number = 18, chain: SupportedChainKey = SupportedChainKey.Polkadot) {
        const network = await this.networkService.getNetwork()
        //check if [name, network, chain] already exists
        const token = await this.dataSource.manager.findOne(TokenEntity, {
            where: { name, network, chain },
        })
        if (token) {
            await this.dataSource.manager.update(TokenEntity, { name, network }, { address, decimals })
            this.logger.debug(`Token ${name} updated with address ${address}`)
            return
        }
        //if not, create a new token
        await this.dataSource.manager.save(TokenEntity, {
            name,
            address,
            network,
            decimals
        })
        this.logger.debug(`Token ${name} imported with address ${address}`)
    }
}