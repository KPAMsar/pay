import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { User } from "@sojipay/models/User";
import { Wallet } from "@sojipay/models/Wallet";
import BigNumber from "bignumber.js";

class WalletService {
    public async getUserWallet(user: User) {
        let wallet = await Wallet.findOne({where: {user_id: user.id}});
        if(!wallet) {
            wallet = await Wallet.create({
                user_id: user.id,
                balance: 0,
            });
        }

        return wallet;
    }

    /**
     * @param user 
     * @param amount 
     * @Note amount should be in kobo
     */
    public async validateWalletBalance(user: User, amount: BigNumber) {
        const wallet = await this.getUserWallet(user);

        if(BigNumber(wallet.balance).lt(amount)){
            throw new ErrorResponse("Insufficient funds", StatusCodes.BAD_REQUEST);
        }
    }

    /**
     * @param user 
     * @param amount 
     * @Note amount should be in kobo
     */
    public async topupWallet(user: User, amount: BigNumber) {
        const wallet = await this.getUserWallet(user);

        await wallet.update({
            balance: BigNumber(wallet.balance).plus(amount).toFixed()
        });
    }

    /**
     * @param user 
     * @param amount 
     * @Note amount should be in kobo
     */
    public async deductWallet(user: User, amount: BigNumber) {
        const wallet = await this.getUserWallet(user);

        await wallet.update({
            balance: BigNumber(wallet.balance).minus(amount).toFixed()
        });
    }
}

export default WalletService;