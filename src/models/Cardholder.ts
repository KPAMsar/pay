import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "@sojipay/models/User";

@Table({
    timestamps: true,
    tableName: 'cardholders',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})


export class Cardholder extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare cardholder_id: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare provider: string;

    @BelongsTo(() => User, { foreignKey: 'user_id' })
    declare user: User
}