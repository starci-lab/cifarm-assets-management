import { Injectable, Logger } from "@nestjs/common"
import { AccountEntity } from "@/database"
import { DataSource } from "typeorm"
import { encodeAddress, mnemonicGenerate, mnemonicToMiniSecret, sr25519PairFromSeed } from "@polkadot/util-crypto"
import { u8aToHex } from "@polkadot/util"
import { SupportedChainKey } from "@/config"
@Injectable()
export class PolkadotAccountService {
    private readonly logger = new Logger(PolkadotAccountService.name)
    constructor(
        private readonly dataSource: DataSource) {
    }

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
            await queryRunner.manager.update(AccountEntity, { chain: SupportedChainKey.Polkadot }, { isActive: false })
            await queryRunner.manager.save(AccountEntity, {
                address: encodeAddress(publicKey),
                publicKey: u8aToHex(publicKey),
                privateKey: u8aToHex(secretKey),
                mnemonic: mnemonic,
                chain: SupportedChainKey.Polkadot,
            })

            await queryRunner.commitTransaction()
        }
        catch (ex) {
            this.logger.error(`Failed to create account: ${ex}`)
            await queryRunner.rollbackTransaction()
        }
    }
}