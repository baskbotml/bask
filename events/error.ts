import { eventModule, EventType } from "@sern/handler";

export default eventModule({
    type: EventType.Sern,
    execute (err) {
        console.log(err)
    }
})