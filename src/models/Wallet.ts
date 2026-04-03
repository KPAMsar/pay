import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "@sojipay/models/User";

@Table({
    timestamps: true,
    tableName: 'wallets',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

export class Wallet extends Model{
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id?: string;

    @Column({
        type: DataType.BIGINT,
        defaultValue: 0,
    })
    balance!: number
    
    @BelongsTo(() => User, {foreignKey: 'user_id'})
    user!: User
}