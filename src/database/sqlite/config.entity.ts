import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("config")
export class ConfigEntity {
  @PrimaryGeneratedColumn("uuid")
      id: string

  @Column({ name: "key", type: "varchar", length: 100 })
      key: ConfigKey

  //value is as object
  @Column({ name: "value", type: "varchar", length: 200 })
      value: string
}

export enum ConfigKey {
    Network = "network",
}