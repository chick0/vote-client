<script>
    import Router from "svelte-spa-router";
    import { push, location } from "svelte-spa-router";
    import { get } from "svelte/store";
    import routes from "./routes.js";
    import { getToken } from "./token.js";
    import { webSocketStore } from "./store.js";

    location.subscribe((path) => {
        let socket = get(webSocketStore);
        if(socket != undefined){
            console.log("closed from App.svelte!");
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
    });

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".navbar-burger").forEach((burger) => {
            burger.addEventListener("click", () => {
                document
                    // @ts-ignore
                    .getElementById(burger.dataset.target)
                    .classList.toggle("is-active");
            });
        });
    });
</script>

<nav class="navbar container">
    <div class="navbar-brand">
        <a class="navbar-item" href="#/">투표</a>
        <!-- svelte-ignore a11y-missing-attribute -->
        <a role="button" class="navbar-burger" data-target="navbar">
            <span></span>
            <span></span>
            <span></span>
        </a>
    </div>
    <div id="navbar" class="navbar-menu">
        <div class="navbar-start">
            <a class="navbar-item" href="#/create">투표 생성</a>
            <a class="navbar-item" href="#/my-votes">내 투표</a>
        </div>
    </div>
</nav>

<Router routes="{routes}" />
