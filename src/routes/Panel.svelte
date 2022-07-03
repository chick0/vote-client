<script>
    import { push } from "svelte-spa-router";
    import { WS_PANEL, API_VOTE, API_QRCODE, API_OPTIONS } from "../url.js";
    import { getToken, getPayload, removeToken } from "../token.js";
    import { webSocketStore } from "../store.js";
    export let params = {};

    const TOKEN = getToken(params.vote_id);

    let payload = getPayload(TOKEN);

    $: if (payload == undefined) {
        alert("이 투표를 관리할 권한이 없습니다.");
        push("/");
    } else if (payload.session_id != "admin") {
        push(`/vote/${params.vote_id}`);
    } else {
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
                        max = json.max;
                        title = json.title;
                        status = json.status;

                        isLoaded = true;
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

    //
    let isLoaded = false;

    // vote information
    let max = 51;
    let title = "";
    let status = undefined;
    let status_str = "";
    let qrcode = "";

    $: status_str = {
        0: "대기중",
        1: "투표중",
        2: "종료됨",
    }[status];

    $: if (title.length != 0) {
        let fromStorage = sessionStorage.getItem(`qrcode:${params.vote_id}`);
        if (fromStorage == undefined) {
            fetch(API_QRCODE, {
                method: "GET",
                headers: {
                    Authorization: TOKEN,
                },
            })
                .then((resp) => resp.json())
                .then((json) => {
                    qrcode = json.image;
                    sessionStorage.setItem(`qrcode:${params.vote_id}`, qrcode);
                });
        } else {
            qrcode = fromStorage;
        }
    }

    // vote status
    let joined = 0;
    let selected = 0;
    let join_per_select = 0;

    $: join_per_select = Math.round((selected / max) * 100);

    // option
    let options = [];
    let isFinished = true;

    $: if (title.length != 0) {
        fetch(API_OPTIONS, {
            method: "GET",
            headers: {
                Authorization: TOKEN,
            },
        })
            .then((resp) => resp.json())
            .then((json) => {
                options = json.options;
            });
    }

    // websocket
    $: if (title.length != 0) {
        let ws = new WebSocket(WS_PANEL);
        ws.onopen = () => {
            ws.send(TOKEN.slice(7));
        };

        ws.onmessage = (e) => {
            let payload = e.data.split(",");
            joined = payload[0];
            selected = payload[1];

            if (max == selected) {
                alert("모든 사람이 투표에 참여해 투표가 마감됩니다.");
                push(`/result/${params.vote_id}`);
            }
        };

        ws.onclose = (e) => {
            if (e.reason.length != 0) {
                alert(e.reason);
            }
        };

        ws.onerror = () => {
            alert("실시간 투표 정보를 불러오는 과정에서 오류가 발생했습니다.");
        };

        webSocketStore.set(ws);
    }
</script>

{#if isLoaded == false}
    <section class="section">
        <div class="container">
            <h1 class="title is-1">잠시만요</h1>
            <p class="subtitle">투표 정보를 불러오고 있습니다...</p>
        </div>
    </section>
{:else}
    <section class="section">
        <div class="container">
            <h1 class="title is-1">{title}</h1>
            <p class="subtitle">{status_str}</p>
            <div class="columns">
                <div class="column">
                    <img id="qrcode" class="image" src="{qrcode}" alt="투표 참여 QR코드" />
                </div>
                <div class="column">
                    <div class="box" style="font-size:1.3rem;">
                        <p>최대 참여인원 : <b>{max}</b>명</p>
                        <p>투표 참여인원 : <b>{joined}</b>명</p>
                    </div>
                    <div class="box" style="font-size:1.3rem;">
                        <p>투표 완료인원 : <b>{selected}</b>명</p>
                        <p>투표 참여율 : <b>{join_per_select}</b>%</p>
                    </div>
                </div>
            </div>
            <div class="block">
                {#if status == 0}
                    <button
                        class="button is-info is-large is-fullwidth"
                        on:click="{() => {
                            if (confirm('투표를 시작하시겠습니까?')) {
                                fetch(API_VOTE, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: TOKEN,
                                    },
                                })
                                    .then((resp) => resp.json())
                                    .then((json) => {
                                        if (json.detail != undefined) {
                                            alert(json.detail.msg);
                                        } else {
                                            alert(json.msg);
                                            status = 1;
                                        }
                                    })
                                    .catch(() => {
                                        alert('네트워크 오류가 발생했습니다.');
                                    });
                            }
                        }}">
                        투표 시작</button>
                {:else if status == 1}
                    <button
                        class="button is-dark is-large is-fullwidth"
                        on:click="{() => {
                            if (confirm('투표를 마감하고 결과를 확인하시겠습니까?')) {
                                push(`/result/${params.vote_id}`);
                            }
                        }}">
                        투표 마감
                    </button>
                {/if}
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h2 class="title is-2">투표 선택지</h2>

            <div class="box">
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label" for="opt-new">선택지 이름</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input class="input" id="opt-new" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="field is-horizontal">
                    <div class="field-label"></div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <button
                                    class="button is-primary 
                                {isFinished == true ? '' : 'is-loading'}"
                                    on:click="{() => {
                                        const target = document.getElementById('opt-new');

                                        isFinished = false;
                                        fetch(API_OPTIONS, {
                                            method: 'POST',
                                            headers: {
                                                Authorization: TOKEN,
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                // @ts-ignore
                                                name: target.value,
                                            }),
                                        })
                                            .then((resp) => resp.json())
                                            .then((json) => {
                                                if (json.detail == undefined) {
                                                    options.push(json);
                                                    options = options;

                                                    // @ts-ignore
                                                    target.value = '';
                                                } else {
                                                    alert(json.detail.msg);
                                                }

                                                isFinished = true;
                                            })
                                            .catch(() => {
                                                alert('네트워크 오류가 발생했습니다.');

                                                isFinished = true;
                                            });
                                    }}">
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {#each options as option}
                <div class="box">
                    {#if option.name == "기권"}
                        <div class="notification is-warning">
                            <b>주의</b>
                            기권 선택지는 자동으로 생성됩니다!
                        </div>
                    {/if}
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label" for="opt-{option.id}">선택지 이름</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <div class="control">
                                    <input class="input" id="opt-{option.id}" bind:value="{option.name}" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field is-horizontal">
                        <div class="field-label"></div>
                        <div class="field-body">
                            <div class="field">
                                <div class="control">
                                    <button
                                        class="button is-primary
                                    {option.loading === true ? 'is-loading' : ''}"
                                        on:click="{() => {
                                            if (option.name.length == 0) {
                                                document.getElementById(`opt-del-${option.id}`).click();
                                                return;
                                            }

                                            option.loading = true;
                                            fetch(API_OPTIONS, {
                                                method: 'PATCH',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    Authorization: TOKEN,
                                                },
                                                body: JSON.stringify({
                                                    id: option.id,
                                                    name: option.name,
                                                }),
                                            })
                                                .then((resp) => resp.json())
                                                .then((json) => {
                                                    if (json.detail == undefined) {
                                                        option.name = json.name;
                                                    } else {
                                                        alert(json.detail.msg);
                                                    }

                                                    option.loading = false;
                                                })
                                                .catch(() => {
                                                    alert('네트워크 오류가 발생했습니다.');

                                                    option.loading = false;
                                                });
                                        }}">
                                        저장
                                    </button>
                                    <button
                                        class="button is-danger
                                    {option.loading === true ? 'is-loading' : ''}"
                                        id="opt-del-{option.id}"
                                        on:click="{() => {
                                            option.loading = true;
                                            fetch(API_OPTIONS, {
                                                method: 'DELETE',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    Authorization: TOKEN,
                                                },
                                                body: JSON.stringify({
                                                    id: option.id,
                                                }),
                                            })
                                                .then((resp) => resp.json())
                                                .then((json) => {
                                                    if (json.result == true) {
                                                        options = options.filter((x) => x.id != option.id);
                                                    } else {
                                                        alert('삭제에 실패했습니다.');
                                                    }

                                                    option.loading = false;
                                                });
                                        }}">
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </section>
{/if}
