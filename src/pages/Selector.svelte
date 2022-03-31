<script>
    import { onMount } from "svelte";
    import { fly, fade } from "svelte/transition";
    import { link } from "svelte-spa-router";
    import { guilds as guilds_cache } from "../services/stores";
    import api from "../services/api.js";

    let guilds = $guilds_cache;
    $: console.log(guilds);
    onMount(async () => {
        await api
            .get("/api/user/guilds")
            .then((response) => {
                guilds_cache.update((_) => response);
                guilds = response;
            })

            .catch((e) => {
                window.location.href =
                    (import.meta.env.VITE_API_URL || "") + "/api/oauth/login";
                // console.log(e);
                // let w = window.open(
                //     `${import.meta.env.VITE_API_URL}/api/oauth/login`,
                //     "_blank",
                //     "toolbar=no,width=400,height=575"
                // );
                // setInterval(() => {
                //     if (w && w.closed) {
                //         window.location.reload();
                //     }
                // }, 1000);
            });
    });

    const etrim = function (str, length) {
        return str.length > length ? str.substring(0, length) + "..." : str;
    };

    console.log("selector");
</script>

<h1
    class="dark:text-white text-6xl ml-3 lg:ml-6 mt-3 text-center"
    transition:fade
>
    Select a Server
</h1>
<div
    class="mt-6 grid gap-4 content-center grid-flow-row lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
>
    {#each guilds as entry, i}
        {#if (entry.permissions & 0x20) == 0x20}
            <a
                class="overflow-x-visible container button shadow-lg shadow-orange/50 border-white-200 border rounded-lg transform transition duration-200 hover:scale-90 transition ease-out duration-700 hover:shadow-xl"
                href="/app/{entry.id}"
                use:link
                in:fly={{
                    y: 600,
                    duration: 300 + i * 30,
                }}
            >
                <div class="bg-white dark:bg-black">
                    <div class="px-4 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-1/6 w-1/6">
                                <img
                                    class="rounded-full"
                                    src="https://cdn.discordapp.com/icons/{entry.id}/{entry.icon}.webp?size=256"
                                    alt="Server Icon"
                                    width="256"
                                    height="256"
                                    loading="lazy"
                                />
                            </div>
                            <div class="ml-4">
                                <div
                                    class="lg:text-3xl sm:text-xl font-medium relative truncate dark:text-white"
                                >
                                    {etrim(entry.name, 20)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        {/if}
    {/each}
</div>
