import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    timestamps: true,
    tableName: 'local_currencies',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

export class LocalCurrency extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare name: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare symbol: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    currency_code!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare country:string
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare country_code:string

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    declare conversion_rate: number

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    declare selling_rate: number
}