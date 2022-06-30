import Home from "./routes/Home.svelte";
import Join from "./routes/Join.svelte";
import Panel from "./routes/Panel.svelte";
import Result from "./routes/Result.svelte";
import Vote from "./routes/Vote.svelte";

// etc
import NotFound from "./NotFound.svelte";

// Routes
export default {
    "/": Home,
    "/join/:vote_id/:code": Join,
    "/panel/:vote_id": Panel,
    "/result/:vote_id": Result,
    "/vote/:vote_id": Vote,

    "*": NotFound,
};
