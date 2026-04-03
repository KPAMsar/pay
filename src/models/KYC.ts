import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "@sojipay/models/User";

@Table({
    timestamps: true,
    tableName: 'kyc',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

export class KYC extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare bvn: string;

    @Column({ type: DataType.STRING, allowNull: false})
    declare image: string;

    @Column({ type: DataType.JSON, allowNull: false})
    declare kyc_data: {[key: string]: any};

    @BelongsTo(() => User, { foreignKey: 'user_id' })
    declare user: User
}