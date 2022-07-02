import { wrap } from "svelte-spa-router/wrap";

import Home from "./routes/Home.svelte";
import MyVotes from "./routes/MyVotes.svelte";
import Create from "./routes/Create.svelte";
import Join from "./routes/Join.svelte";

// etc
import NotFound from "./NotFound.svelte";

// Routes
export default {
    "/": Home,
    "/my-votes": MyVotes,
    "/create": Create,
    "/join/:vote_id/:code": Join,

    "/vote/:vote_id": wrap({
        asyncComponent: () => import("./routes/Vote.svelte"),
    }),
    "/panel/:vote_id": wrap({
        asyncComponent: () => import("./routes/Panel.svelte"),
    }),
    "/result/:vote_id": wrap({
        asyncComponent: () => import("./routes/Result.svelte"),
    }),

    "*": NotFound,
};
