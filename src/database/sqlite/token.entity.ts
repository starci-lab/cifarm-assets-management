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

  @CreateDateColumn({ name: "created_at" })
      createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
      updatedAt: Date
}