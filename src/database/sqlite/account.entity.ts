import { SupportedChainKey } from "@/config"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn("uuid")
      id: number

  @Column({ name: "address", type: "varchar", length: 100 })
      address: string

  @Column({ name: "public_key", type: "varchar", length: 200 })
      publicKey: string

  @Column({ name: "private_key", type: "varchar", length: 200 })
      privateKey: string

  @Column({ name: "mnemonic", type: "varchar", length: 400 })
      mnemonic: string

  @Column({ name: "password", type: "varchar", length: 100, nullable: true })
      password?: string

  @Column({ name: "chain", type: "enum", enum: SupportedChainKey })
      chain: SupportedChainKey

  @Column({ name: "is_active", type: "boolean", default: true })
      isActive: boolean
}
