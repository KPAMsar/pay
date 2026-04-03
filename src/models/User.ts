import { Table, Model, Column, DataType, PrimaryKey } from "sequelize-typescript";
import otpGenerator from 'otp-generator';
import { OtpVerification } from "@sojipay/models/OtpVerification";
import { OTPTypes } from "@sojipay/constants/enums/User";

@Table({
    timestamps: true,
    tableName: 'users',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

export class User extends Model{
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
    first_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    last_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    phone_code!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    phone!: string;

    @Column({ type: DataType.STRING, allowNull: true, })
    avatar!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    pin!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_verified!: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_kyc_completed!: boolean

    async generateOTP(type = OTPTypes.ACCOUNT)
    {
        const OTP = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
    
        let verification = await OtpVerification.findOne({ where: {user_id: this.id, type: type} });
        if(verification){
            await verification.destroy();
        }

        verification = await OtpVerification.create({ user_id: this.id, code: OTP, type: type });
    
        return {
            id: verification.id,
            otp: OTP
        };
    }

    getDetails()
    {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            phone_code: this.phone_code,
            phone: this.phone,
            avatar: this.avatar,
            is_verified: this.is_verified,
            is_kyc_completed: this.is_kyc_completed,
            is_pin_created: !!this.pin,
            created_at: this.createdAt,
        }
    }
}