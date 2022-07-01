import Home from "./routes/Home.svelte";
import MyVotes from "./routes/MyVotes.svelte";
// Vote
import Create from "./routes/Create.svelte";
import Vote from "./routes/Vote.svelte";
import Panel from "./routes/Panel.svelte";
import Result from "./routes/Result.svelte";
// Join
import Join from "./routes/Join.svelte";

// etc
import NotFound from "./NotFound.svelte";

// Routes
export default {
    "/": Home,
    "/my-votes": MyVotes,

    "/create": Create,
    "/vote/:vote_id": Vote,
    "/panel/:vote_id": Panel,
    "/result/:vote_id": Result,

    "/join/:vote_id/:code": Join,

    "*": NotFound,
};
