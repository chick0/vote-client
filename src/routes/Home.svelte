<script>
    import { push } from "svelte-spa-router";
</script>

<section class="section is-large">
    <div class="container">
        <h1 class="title is-1">투표</h1>
        <p class="subtitle">QR코드로 참여하는 단순 투표 시스템</p>
        <div class="block">
            <button
                class="button is-primary is-large"
                on:click="{() => {
                    push('/create');
                }}">투표 만들기</button>
        </div>
    </div>
</section>
