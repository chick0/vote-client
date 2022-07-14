<script>
    import Cookies from "js-cookie";
    import { push } from "svelte-spa-router";
    import { getPayload } from "../token.js";

    let votes = [];

    document.cookie
        .split(";")
        .map((x) => x.slice(0, x.indexOf("=")))
        .forEach((vote_id) => {
            let token = Cookies.get(vote_id.toString());

            if (token != undefined) {
                let payload = getPayload(token);

                votes.push({
                    id: vote_id,
                    title: payload.title ?? "[오류] 제목을 불러오지 못함",
                });
            }
        });

    if (votes.length == 0) {
        alert("참여중인 투표가 없습니다!");
        push("/");
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">내 투표</h1>
        <p class="subtitle">만들었거나 참여중인 투표의 목록을 확인 할 수 있습니다.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        {#each votes as vote}
            <div class="box">
                <h5 class="title is-5">{vote.title}</h5>
                <button
                    class="button is-primary"
                    on:click="{() => {
                        push(`/panel/${vote.id}`);
                    }}">확인하기</button>
            </div>
        {/each}
    </div>
</section>
