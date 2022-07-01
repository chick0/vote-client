<script>
    import { push } from "svelte-spa-router";

    let votes = [];

    Object.keys(localStorage)
        .filter((x) => x.startsWith("vote:"))
        .forEach((e) => {
            let vote_id = e.slice(5);
            votes.push({
                id: vote_id,
                title:
                    localStorage.getItem(`title:${vote_id}`) ??
                    "[오류] 제목을 불러오지 못함",
            });
        });
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">내 투표</h1>
        <p class="subtitle">
            만들었거나 참여중인 투표의 목록을 확인 할 수 있습니다.
        </p>
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
