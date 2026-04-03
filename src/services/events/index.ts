import EventEmitter from "events"
import { EventTypes } from "@sojipay/constants/enums/Events";
import { userCreatedEventListener, userVerified } from "@sojipay/services/events/userEvents";

const appEvents = new EventEmitter();

appEvents.on(EventTypes.USER_CREATED, userCreatedEventListener);
appEvents.on(EventTypes.USER_VERIFIED, userVerified);

export default appEvents;