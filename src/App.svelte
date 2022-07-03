<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import Router from "svelte-spa-router";
    import { push, location } from "svelte-spa-router";
    import routes from "./routes.js";
    import { getToken } from "./token.js";
    import { webSocketStore } from "./store.js";

    let navbar = undefined;
    let navbar_burger = undefined;

    onMount(() => {
        navbar_burger.addEventListener("click", () => {
            navbar.classList.toggle("is-active");
        });
    });

    location.subscribe((path) => {
        let socket = get(webSocketStore);
        if (socket != undefined) {
            socket.close();
            webSocketStore.set(undefined);
        }

        if (path.startsWith("/create")) {
            let last = localStorage.getItem("last");
            if (last != null) {
                let token = getToken(last);

                if (token != undefined) {
                    let message = [
                        "* 진행중인 투표가 감지되었습니다.",
                        "* 해당 투표를 확인하시겠습니까?",
                    ];

                    if (confirm(message.join("\n"))) {
                        push(`/panel/${last}`);
                    }
                }
            }
        }

        navbar?.classList.remove("is-active");
    });
</script>

<nav class="navbar container">
    <div class="navbar-brand">
        <a class="navbar-item" href="#/">투표</a>
        <!-- svelte-ignore a11y-missing-attribute -->
        <a role="button" class="navbar-burger" bind:this="{navbar_burger}">
            <span></span>
            <span></span>
            <span></span>
        </a>
    </div>
    <div class="navbar-menu" bind:this="{navbar}">
        <div class="navbar-start">
            <a class="navbar-item" href="#/create">투표 생성</a>
            <a class="navbar-item" href="#/my-votes">내 투표</a>
        </div>
    </div>
</nav>

<Router routes="{routes}" />
