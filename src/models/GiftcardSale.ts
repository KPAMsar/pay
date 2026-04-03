import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "@sojipay/models/User";
import { Giftcard } from "@sojipay/models/Giftcard";
import { Transaction } from "@sojipay/models/Transaction";

@Table({
    timestamps: true,
    tableName: 'giftcard_sales',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

export class GiftcardSale extends Model{
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    card_number!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    security_code!: string

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    value!: number
    
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    image!: string

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    status!: string
    
    @BelongsTo(() => User, {foreignKey: 'user_id'})
    user!: User

    @BelongsTo(() => Giftcard, {foreignKey: 'giftcard_id'})
    giftcard_type!: Giftcard

    @BelongsTo(() => Transaction, {foreignKey: 'transaction_id'})
    transaction!: Transaction
}