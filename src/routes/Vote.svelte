<script>
    import { push } from "svelte-spa-router";
    import { API_OPTIONS, API_VOTE, API_SELECT, API_STATUS } from "../url.js";
    import { getToken, getPayload, removeToken } from "../token.js";
    import { interval_id } from "../store.js";
    export let params = {};

    const TOKEN = getToken(params.vote_id);
    let payload = getPayload(TOKEN);

    $: if (payload == undefined) {
        alert("투표에 참여할 권한이 없습니다.");
        push("/");
    } else if (payload.session_id == "admin") {
        push(`/panel/${params.vote_id}`);
    } else {
        fetchVoteInformaion();
    }

    function fetchVoteInformaion(){
        fetch(API_VOTE, {
            method: "GET",
            headers: {
                Authorization: TOKEN,
            },
        })
            .then((resp) => resp.json())
            .then((json) => {
                if (json.detail == undefined) {
                    if (json.status == 2) {
                        push(`/result/${params.vote_id}`);
                    } else {
                        title = json.title;
                        status = json.status;

                        function updateStatus(){
                            fetch(API_STATUS, {
                                headers: {
                                    Authorization: TOKEN
                                }
                            }).then((resp) => resp.json()).then((json) => {
                                status = json.status;
                            });
                        }

                        updateStatus();
                        let tmp = setInterval(updateStatus, 3000);
                        interval_id.set(tmp);
                    }
                } else {
                    alert(json.detail.msg);
                    push("/");

                    if (json.detail.remove_token === true) {
                        removeToken(params.vote_id);
                    }
                }
            })
            .catch(() => {
                alert("네트워크 오류가 발생했습니다.");
                push("/");
            });
    }

    // vote information
    let status = -1;
    let title = "";
    let options = [];

    $: if (status == 1) {
        fetch(API_OPTIONS, {
            method: "GET",
            headers: {
                Authorization: TOKEN,
            },
        })
            .then((resp) => resp.json())
            .then((json) => {
                if (json.detail != undefined) {
                    alert(json.detail.msg);
                } else {
                    options = [];
                    options = json.options;
                }
            });
    } else if (status == 2) {
        push(`/result/${params.vote_id}`);
    }

    function ask(id, name) {
        if (confirm(`'${name}'을(를) 선택하시겠습니까?`)) {
            fetch(API_SELECT, {
                method: "POST",
                headers: {
                    Authorization: TOKEN,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    option_id: id,
                }),
            })
                .then((resp) => resp.json())
                .then((json) => {
                    if (json.result === true) {
                        alert("투표가 완료되었습니다.");
                    } else {
                        if (json.detail != undefined) {
                            alert(json.detail.msg);
                        } else {
                            alert("투표 과정에서 오류가 발생했습니다. 다시 시도해주세요.");
                        }
                    }
                });
        }
    }
</script>

{#if status == -1}
    <section class="section is-large">
        <div class="container">
            <h1 class="title is-1">잠시만요</h1>
            <div class="content is-medium">
                <p>투표 정보를 불러오고 있습니다...</p>
            </div>
        </div>
    </section>
{:else if status == 0}
    <section class="section is-large">
        <div class="container">
            <h1 class="title is-1">대기중</h1>
            <div class="content is-medium">
                <p>지금은 투표에 참여 할 수 없습니다.</p>
                <p>투표 관리자가 투표를 시작해야 참여 할 수 있습니다.</p>
            </div>
        </div>
    </section>
{:else if status == 1}
    <section class="section">
        <div class="container">
            <h1 class="title is-1">투표 참여</h1>
            <p class="subtitle">{title}</p>
        </div>
    </section>

    <section class="section">
        <div class="container">
            {#if options.length == 0}
                <div class="notification is-success">선택지 목록을 불러오고 있습니다. 잠시만 기다려주세요...</div>
            {:else}
                {#each options as option}
                    <div class="block">
                        <button
                            class="button is-dark is-large is-fullwidth"
                            on:click="{() => {
                                ask(option.id, option.name);
                            }}">
                            {option.name}
                        </button>
                    </div>
                {/each}

                <div class="block">
                    <button
                        class="button is-danger is-large is-fullwidth"
                        on:click="{() => {
                            ask(-1, '기권');
                        }}">
                        기권
                    </button>
                </div>
            {/if}
        </div>
    </section>
{/if}
