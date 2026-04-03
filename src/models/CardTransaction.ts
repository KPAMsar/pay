import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Card } from "@sojipay/models/Card";

@Table({
    timestamps: true,
    tableName: 'card_transactions',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

export class CardTransaction extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare type: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare title: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare description: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare currency: string;

    @Column({ type: DataType.BIGINT, allowNull: false})
    declare amount: number;

    @Column({ type: DataType.BIGINT, allowNull: false})
    declare fee: number;

    @Column({ type: DataType.STRING, allowNull: true})
    declare source: string;

    @Column({ type: DataType.JSON, allowNull: true})
    declare data: {[key: string]: any};

    @Column({ type: DataType.STRING, defaultValue: 'completed'})
    declare status: {[key: string]: any};

    @BelongsTo(() => Card, { foreignKey: 'card_id' })
    declare card: Card
}