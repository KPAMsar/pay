import bcrypt from 'bcryptjs';
import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { SessionMethods } from "@sojipay/constants/enums/User";
import { Session } from "@sojipay/models/Session";
import { User } from "@sojipay/models/User";

class SessionService
{
    public async createPasswordSession(user: User, password: string): Promise<Session>
    {
        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid){
            throw new ErrorResponse("Invalid password", StatusCodes.BAD_REQUEST);
        }

        return await Session.create({
            method: SessionMethods.PASSWORD,
            user_id: user.id
        });
    }

    public async createPINSession(user: User, pin: string): Promise<Session>
    {
        const isValid = await bcrypt.compare(pin, user.pin);

        if(!isValid){
            throw new ErrorResponse("Invalid transaction PIN", StatusCodes.BAD_REQUEST);
        }

        return await Session.create({
            method: SessionMethods.PIN,
            user_id: user.id
        });
    }

    public async createBiometricSession(user: User, deviceId: object) {
        return await Session.create({
            method: SessionMethods.BIOMETRICS,
            user_id: user.id,
            device_id: deviceId
        });
    }

    public async validateBiometricSession(sessionId: string, deviceId: string) {
        const session = await Session.findByPk(sessionId, {include: User});

        //make sure the session is used on the right device
        if(!session || deviceId !== session.device_id) {
            throw new ErrorResponse("Invalid session ID", StatusCodes.BAD_REQUEST);
        }

        return session.user;
    }

    public async delete(sessionId: string, user: User){
        const session = await Session.findOne({where: {user_id: user.id, id: sessionId}});

        if(!session){
            throw new ErrorResponse("Session not found", StatusCodes.BAD_REQUEST);
        }

        await Session.destroy({where: {user_id: user.id, id: sessionId}});
    }

    async validateSession(sessionId: string, method: string, user: User): Promise<boolean>
    {
        const session = await Session.findOne({where: {id: sessionId, user_id: user.id, method: method}});

        if(!session){
            throw new ErrorResponse("Invalid session", StatusCodes.BAD_REQUEST);
        }

        return true;
    }
}

export default SessionService;