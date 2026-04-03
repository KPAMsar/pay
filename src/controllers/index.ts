import UserController from "@sojipay/controllers/UserController";
import SessionController from "@sojipay/controllers/SessionController";
import GiftcardController from "@sojipay/controllers/GiftcardController";
import WalletController from "@sojipay/controllers/WalletController";
import UtilityPaymentsController from "@sojipay/controllers/UtilityPaymentsController";
import AdminGiftcardController from "@sojipay/controllers/admin/AdminGiftcardController";
import CardController from "@sojipay/controllers/CardController";

const controllers = [
    UserController.createInstance(),
    SessionController.createInstance(),
    GiftcardController.createInstance(),
    WalletController.createInstance(),
    UtilityPaymentsController.createInstance(),
    AdminGiftcardController.createInstance(),
    CardController.createInstance()
]

export default controllers;