import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    timestamps: true,
    tableName: 'giftcards',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

export class Giftcard extends Model{
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
    name!: string
}