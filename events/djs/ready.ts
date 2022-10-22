import { eventModule, EventType } from "@sern/handler";

export default eventModule({
    type: EventType.Discord,
    execute () {
        console.log("bot ready")
    }
})