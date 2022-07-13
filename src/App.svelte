<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import Router from "svelte-spa-router";
    import { push, location } from "svelte-spa-router";
    import routes from "./routes.js";
    import { getToken } from "./token.js";
    import { interval_id } from "./store.js";

    if (window.location.pathname.indexOf("index.html") == 1) {
        window.location.replace("/" + window.location.hash);
    }

    let navbar = undefined;
    let navbar_burger = undefined;

    onMount(() => {
        navbar_burger.addEventListener("click", () => {
            navbar.classList.toggle("is-active");
        });
    });

    let hide = false;

    location.subscribe((path) => {
        let tmp = get(interval_id);
        if (tmp != undefined) {
            clearInterval(tmp);
            interval_id.set(undefined);
        }

        if (path.startsWith("/create")) {
            let last = localStorage.getItem("last");
            if (last != null) {
                let token = getToken(last);

                if (token != undefined) {
                    let message = ["* 진행중인 투표가 감지되었습니다.", "* 해당 투표를 확인하시겠습니까?"];

                    if (confirm(message.join("\n"))) {
                        push(`/panel/${last}`);
                    }
                }
            }
        }

        navbar?.classList.remove("is-active");

        if (path == "/") {
            hide = true;
        } else {
            hide = false;
        }
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

{#if hide != true}
    <style>
        html {
            background-color: #fafafa;
        }

        body {
            background-color: #ffffff;
        }
    </style>

    <section class="section"></section>

    <section class="footer">
        <div class="container">
            <div class="colums">
                <div class="column">&copy; chick_0</div>
                <div class="column">
                    <a href="https://github.com/chick0">Github</a>
                </div>
                <div class="column">
                    <a href="mailto:chick_0@ch1ck.xyz">Email</a>
                </div>
            </div>
        </div>
    </section>
{/if}
