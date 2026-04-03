import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "@sojipay/models/User";
import { Cardholder } from "@sojipay/models/Cardholder";

@Table({
    timestamps: true,
    tableName: 'cards',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})


export class Card extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare card_id: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare currency: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare brand: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare provider: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare status: string;

    @Column({ type: DataType.INTEGER, defaultValue: 4})
    declare card_creation_fee: number;

    @Column({ type: DataType.INTEGER, defaultValue: 2})
    declare revenue: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: false})
    declare is_pin_set: boolean;
    
    @Column({ type: DataType.BOOLEAN, defaultValue: false})
    declare is_deleted: boolean;

    @BelongsTo(() => User, { foreignKey: 'user_id' })
    declare user: User

    @BelongsTo(() => Cardholder, { foreignKey: 'cardholder_id' })
    declare cardholder: Cardholder
}