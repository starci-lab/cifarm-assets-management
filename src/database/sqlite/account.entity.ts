import { SupportedChainKey } from "@/config"
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"

@Entity("account")
export class AccountEntity {
  @PrimaryGeneratedColumn("uuid")
      id: string

  @Column({ name: "address", type: "varchar", length: 100 })
      address: string

  @Column({ name: "public_key", type: "varchar", length: 200 })
      publicKey: string

  @Column({ name: "private_key", type: "varchar", length: 200 })
      privateKey: string

  @Column({ name: "evm_private_key", type: "varchar", length: 200 })
      evmPrivateKey: string

  @Column({ name: "mnemonic", type: "varchar", length: 400 })
      mnemonic: string

  @Column({ name: "password", type: "varchar", length: 100, nullable: true })
      password?: string

  @Column({ name: "chain", type: "varchar", length: 50 })
      chain: SupportedChainKey

  @Column({ name: "is_active", type: "boolean", default: true })
      isActive: boolean

  @CreateDateColumn({ name: "created_at" })
      createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
      updatedAt: Date
}
