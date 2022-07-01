<script>
    import { push } from "svelte-spa-router";
    import { setToken, getToken, getPayload } from "../token.js";
    import { API_JOIN } from "../url.js";
    export let params = {};

    const TOKEN = getToken(params.vote_id);

    if (TOKEN != undefined) {
        const payload = getPayload(TOKEN);

        if (payload.session_id == "admin") {
            push(`/panel/${params.vote_id}`);
        } else {
            push(`/vote/${params.vote_id}`);
        }
    } else {
        fetch(API_JOIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                vote_id: params.vote_id,
                code: params.code,
            }),
        })
            .then((resp) => resp.json())
            .then((json) => {
                if (json.detail == undefined) {
                    setToken(json.vote_id, json.token, json.title);
                    push(`/vote/${json.vote_id}`);
                } else {
                    alert(json.detail.msg);
                    push("/");
                }
            });
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">투표 참여</h1>
        <p class="subtitle">투표에 참여하고 있습니다...</p>
    </div>
</section>
