import type { CoreDependencies } from "@sern/handler";
import type { Publisher } from "@sern/publisher";
import type { DisTube } from "distube";

declare global {
    interface Dependencies extends CoreDependencies {
        "@sern/publisher": Publisher
        "distube": DisTube
    }
}