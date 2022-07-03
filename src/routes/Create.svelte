<script>
    import { push } from "svelte-spa-router";
    import { API_VOTE } from "../url.js";
    import { setToken } from "../token.js";

    let title = "";
    let max = 0;

    let error_counter = 0;

    let is_loading = false;
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">투표 생성</h1>
        <p class="subtitle">최대 <b>50명</b>이 참여 할 수 있습니다.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="field is-horizontal">
            <div class="field-label is-large">
                <label class="label" for="vote-title">투표 제목</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control">
                        <input
                            class="input is-large"
                            type="text"
                            id="vote-title"
                            bind:value="{title}" />
                    </p>
                </div>
            </div>
        </div>

        <div class="field is-horizontal">
            <div class="field-label is-large">
                <label class="label" for="vote-max">참여 인원</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control">
                        <input
                            class="input is-large"
                            type="tel"
                            id="vote-max"
                            max="50"
                            bind:value="{max}" />
                    </p>
                </div>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <button
                    class="button is-primary is-large is-fullwidth
                    {is_loading == true ? 'is-loading' : ''}"
                    on:click="{() => {
                        if (is_loading == true) {
                            alert('투표 생성 요청이 처리중입니다...');
                            return;
                        } else {
                            is_loading = true;
                        }

                        fetch(API_VOTE, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                title,
                                max,
                            }),
                        })
                            .then((resp) => resp.json())
                            .then((json) => {
                                if (json.detail != undefined) {
                                    alert(json.detail.msg);
                                    is_loading = false;
                                } else {
                                    setToken(
                                        json.vote_id,
                                        json.token,
                                        json.title
                                    );
                                    push(`/panel/${json.vote_id}`);
                                }
                            })
                            .catch(() => {
                                if (error_counter >= 5) {
                                    alert(
                                        '네트워크 오류가 발생했습니다. 해당 오류가 반복해서 발생하는 경우 개발자한테 문의해주세요.'
                                    );
                                } else {
                                    alert('네트워크 오류가 발생했습니다.');
                                }

                                error_counter += 1;
                                is_loading = false;
                            });
                    }}">
                    다음
                </button>
            </div>
        </div>
    </div>
</section>
