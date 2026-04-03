import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { TransactionStatus } from "@sojipay/constants/enums/transactionType";
import { User } from "@sojipay/models/User";

@Table({
    timestamps: true,
    tableName: 'transactions',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

export class Transaction extends Model{
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description!: string
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    type!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    group!: string

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    amount!: number

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    reference!: string

    @Column({
        type: DataType.STRING,
        defaultValue: TransactionStatus.PENDING,
    })
    status!: string

    @BelongsTo(() => User, {foreignKey: 'user_id'})
    user!: User
}