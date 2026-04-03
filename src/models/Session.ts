import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "@sojipay/models/User";

@Table({
    timestamps: true,
    tableName: 'sessions',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

export class Session extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    method!: string

    @Column({ type: DataType.STRING, allowNull: true, })
    device_id!: string

    @BelongsTo(() => User, { foreignKey: 'user_id' })
    user!: User
}