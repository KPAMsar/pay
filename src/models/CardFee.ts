import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    timestamps: true,
    tableName: 'card_fees',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})


export class CardFee extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare currency: string;

    @Column({ type: DataType.BIGINT, allowNull: false})
    declare creation_fee: number;

    @Column({ type: DataType.INTEGER, allowNull: false})
    declare topup_fee: number;

    @Column({ type: DataType.INTEGER, allowNull: false})
    declare topup_fee_cap: number;

    @Column({ type: DataType.INTEGER, allowNull: false})
    declare withdrawal_fee: number;

    @Column({ type: DataType.INTEGER, allowNull: false})
    declare withdrawal_fee_cap: number;
}