<script>
    import { push } from "svelte-spa-router";
    import { Chart, ArcElement, Tooltip, PieController } from "chart.js";
    import { getToken, getPayload } from "../token.js";
    import { API_RESULT } from "../url.js";
    export let params = {};

    const TOKEN = getToken(params.vote_id);
    let payload = getPayload(TOKEN);

    let title = localStorage.getItem(`title:${params.vote_id}`);
    let total = 0;
    let dropped = 0;
    let high = 1;

    let result = [];

    if (TOKEN == undefined) {
        push("/");
    } else {
        fetch(API_RESULT, {
            method: "GET",
            headers: {
                Authorization: TOKEN,
            },
        })
            .then((resp) => resp.json())
            .then((json) => {
                if (json.result != undefined) {
                    result = json.result;

                    let last = localStorage.getItem("last");
                    if (last == params.vote_id) {
                        localStorage.removeItem("last");
                    }
                } else {
                    alert(json.detail.msg);
                    push(`/vote/${params.vote_id}`);
                }
            });
    }

    $: result.slice(0, result.length - 1).forEach((option) => {
        total += option.score;

        if (option.score > high) {
            high = option.score;
        }
    });

    $: dropped = result[result.length - 1]?.score;

    // chart.js
    let canvas;

    Chart.register(ArcElement, Tooltip, PieController);

    $: if (canvas != undefined && result.length != 0) {
        new Chart(canvas.getContext("2d"), {
            type: "pie",
            data: {
                labels: result.map((x) => x.name),
                datasets: [
                    {
                        label: title,
                        data: result.map((x) => x.score),
                        backgroundColor: result.map((x) => x.color),
                        hoverOffset: 4,
                    },
                ],
            },
        });
    }
</script>

<section class="section">
    <div class="container">
        <div class="columns">
            <div class="column">
                <h1 class="title is-1">투표 결과</h1>
                <p class="subtitle">{title}</p>

                <div class="content is-large">
                    <p>- 투표에는 총 <b>{total}명</b>이 참여했습니다.</p>
                    <p>- 기권표는 총 <b>{dropped}개</b>가 있습니다.</p>
                </div>

                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>선택지</th>
                            <th>받은 투표수</th>
                            <th>득표율</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each result as option}
                            <tr class="{option.score == high ? 'is-selected' : ''}">
                                <td>{option.name}</td>
                                <td>{option.score}</td>
                                <td>{option.per}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>

            {#if payload.session_id === "admin"}
                <div class="block">
                    <button
                        class="button is-primary is-primary is-large is-fullwidth"
                        on:click="{() => {
                            alert('개발중');
                        }}">다시 투표하기</button>
                </div>
            {/if}
            </div>
            <div class="column">
                <canvas bind:this="{canvas}"></canvas>
            </div>
        </div>
    </div>
</section>
