import { Network, SupportedChainKey } from "@/config"
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"

@Entity("token")
export class TokenEntity {
  @PrimaryGeneratedColumn("uuid")
      id: string

  //value is as object
  @Column({ name: "name", type: "varchar", length: 200 })
      name: string

  @Column({ name: "address", type: "varchar", length: 100 })
      address: string

  @Column({ name: "decimals", type: "int", default: 18 })
      decimals: number

  @CreateDateColumn({ name: "created_at" })
      createdAt: Date

  @Column({
      name: "chain",
      type: "varchar",
      length: 50,
      default: SupportedChainKey.Polkadot,
  })
      chain: SupportedChainKey
  
  @Column({ name: "network", type: "varchar", default: Network.Testnet, length: 50 })
      network: Network

  @UpdateDateColumn({ name: "updated_at" })
      updatedAt: Date
}
