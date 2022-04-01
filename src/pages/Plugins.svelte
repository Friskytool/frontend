<script>
    import api from "../services/api.js";
    import Switch from "../lib/Switch.svelte";
    import SaveState from "../lib/SaveState.svelte";
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { guilds } from "../services/stores.js";

    export let params = {};
    let update_modal = false;
    let plugin_data;
    let plugins, plugins_copy;
    $: update_modal = JSON.stringify(plugins) !== JSON.stringify(plugins_copy);

    const savePlugins = async () => {
        let data = [];
        for (const [k, v] of Object.entries(plugins)) {
            if (v) {
                data.push(k);
            }
        }

        await api.post(`/api/guilds/${params.id}/plugins`, data);

        plugins_copy = JSON.parse(JSON.stringify(plugins));
    };
    let guild = $guilds.find((g) => g.id == params.id) || {};
    onMount(async () => {
        if (!guild["id"]) {
            if ($guilds.length == 0) {
                await api
                    .get("/api/user/guilds")
                    .then((response) => {
                        guilds.update((_) => response);
                    })

                    .catch((e) => {
                        window.location.href =
                            (import.meta.env.VITE_API_URL || "") +
                            "/api/oauth/login";
                    });

                guild = await api.get(`/api/guilds/${params.id}`);
            }
        }
        plugin_data = await api.get("/static/plugins.json");
        let enabled_plugins = await api.get(`/api/guilds/${params.id}/plugins`);
        let eplugins = {};
        for (const plugin of plugin_data) {
            eplugins[plugin.key] = enabled_plugins.includes(plugin.key);
        }

        plugins = eplugins;
        plugins_copy = JSON.parse(JSON.stringify(plugins));
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
                {#if plugins}
                    {#each plugin_data as plugin, i}
                        <div
                            class="shadow-lg shadow-black bg-black rounded-lg px-6 py-4 m-2 rounded-lg border-2 hover:border-white {plugins_copy[
                                plugin.key
                            ]
                                ? 'cursor-pointer'
                                : 'cursor-not-allowed'}"
                            on:click={(e) => {
                                if (
                                    // @ts-ignore
                                    !["INPUT", "SPAN"].includes(
                                        e.target.nodeName
                                    ) &&
                                    plugins_copy[plugin.key]
                                ) {
                                    push(
                                        `/app/${guild["id"]}/plugins/${plugin.slug}`
                                    );
                                }
                            }}
                            in:fly={{ y: 600, duration: 1000 + i * 300 }}
                        >
                            <div
                                class="font-bold text-3xl mb-2 text-white flex"
                            >
                                <div class="flex-grow">
                                    {plugin.name}
                                </div>
                                <div class="ml-3">
                                    <Switch
                                        bind:checked={plugins[plugin.key]}
                                    />
                                </div>
                            </div>

                            <p class="text-gray-700 text-base text-grey-400">
                                {plugin.description}
                            </p>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
    {#if update_modal}
        <SaveState
            save={savePlugins}
            on:update={() => {
                update_modal = update_modal;
            }}
            reset={() => (plugins = JSON.parse(JSON.stringify(plugins_copy)))}
        />
    {/if}
{/if}
