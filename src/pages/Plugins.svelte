<script>
    import api from "../services/api.js";
    import { link, push } from "svelte-spa-router";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { guilds } from "../services/stores.js";
    export let params = {};
    let plugin_data = api.get("/static/plugins.json");
    let guild = $guilds.find((g) => g.id == params.id) || {};
    $: console.log(guild);
    onMount(async () => {
        if (!guild["id"]) {
            if ($guilds.length == 0) {
                push("/app");
            }
            guild = await api.get(`/api/guilds/${params.id}`);
        }
    });
</script>

{#if guild}
    <div class="m-2 lg:ml-4 w-full">
        <!-- <h1
            class="rounded-lg px-4 mx-auto py-2 dark:text-green text-7xl mt-3 text-left"
            in:fly={{ y: 0, duration: 500 }}
        >
            {guild.name}
        </h1> -->
        <div class="mt-8" />

        <div class="w-full">
            <div class="dark:text-white font-semibold text-start ml-6 text-4xl">
                Plugins
            </div>
            <div
                class="rounded-lg grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 px-4 mx-auto py-4 text-2xl"
            >
                {#await plugin_data then plugins}
                    {#each plugins as plugin, i}
                        <a
                            class="shadow-lg shadow-black bg-black rounded-lg px-6 py-4 m-2 rounded-lg border-2 hover:border-white"
                            use:link
                            in:fly={{ y: 600, duration: 1000 + i * 300 }}
                            href="/app/{guild['id']}/plugins/{plugin.slug}"
                        >
                            <div class="font-bold text-3xl mb-2 text-white">
                                {plugin.name}
                            </div>
                            <p class="text-gray-700 text-base text-grey-400">
                                {plugin.description}
                            </p>
                        </a>
                    {/each}
                {/await}
            </div>
        </div>
    </div>
{/if}
