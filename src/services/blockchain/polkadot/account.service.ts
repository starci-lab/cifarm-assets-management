import { Injectable, Logger } from "@nestjs/common"
import { AccountEntity } from "@/database"
import { DataSource } from "typeorm"
import {
    encodeAddress,
    mnemonicGenerate,
    mnemonicToMiniSecret,
    sr25519PairFromSeed,
} from "@polkadot/util-crypto"
import { u8aToHex } from "@polkadot/util"
import { SupportedChainKey } from "@/config"
@Injectable()
export class PolkadotAccountService {
    private readonly logger = new Logger(PolkadotAccountService.name)
    constructor(private readonly dataSource: DataSource) {}

    public async createAccount() {
    // Create a new account
        const mnemonic = mnemonicGenerate()
        const seed = mnemonicToMiniSecret(mnemonic)
        const { publicKey, secretKey } = sr25519PairFromSeed(seed)
        // Save the account to the database
        // Update the previous active account to inactive
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            await queryRunner.manager.update(
                AccountEntity,
                { chain: SupportedChainKey.Polkadot },
                { isActive: false },
            )
            const accountAddress = encodeAddress(publicKey)
            await queryRunner.manager.save(AccountEntity, {
                address: accountAddress,
                publicKey: u8aToHex(publicKey),
                privateKey: u8aToHex(secretKey),
                mnemonic: mnemonic,
                chain: SupportedChainKey.Polkadot,
            })

            await queryRunner.commitTransaction()
            console.clear()
            this.logger.log(
                `Account created successfully. Address: ${accountAddress}`,
            )
        } catch (ex) {
            this.logger.error(ex)
            await queryRunner.rollbackTransaction()
        }
    }

    public async retrieveActiveAccount() {
        return await this.dataSource
            .getRepository(AccountEntity)
            .findOne({
                where: { chain: SupportedChainKey.Polkadot, isActive: true },
            })
    }
}
