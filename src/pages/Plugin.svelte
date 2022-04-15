<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import SaveState from "../lib/SaveState.svelte";
    import api, { getSettings } from "../services/api.js";
    import Setting from "../lib/Setting.svelte";
    import { guilds } from "../services/stores.js";

    export let params;
    $: mount(params);

    let roles;

    let plugin;
    let update_modal;

    const isEqual = (a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    let settings, new_settings;
    $: update_modal = !isEqual(settings, new_settings);

    const mount = async (p) => {
        plugin = await api
            .get("/static/plugins.json")
            .then((items) => items.find((item) => item.slug === p.plugin));
        settings = await getSettings(p.id).then((items) => items[plugin.key]);

        new_settings = JSON.parse(JSON.stringify(settings));

        let gdata = await api.get(`/api/guilds/${params.id}`);
        console.log("gdata roles:", gdata.roles);
        roles = gdata.roles;
    };

    const saveSettings = async () => {
        let data = {};
        for (const [k, v] of Object.entries(new_settings)) {
            if (settings[k] !== v) {
                data[k] = v.value;
            }
        }

        await api.post(`/api/guilds/${params.id}/settings`, {
            [plugin.key]: data,
        });

        settings = JSON.parse(JSON.stringify(new_settings));
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
    });
</script>

{#if settings && roles}
    <div class="m-1 ml-8 lg:ml-64 h-full flex">
        <div class="mt-8" />

        <div class="w-full mb-auto flex-grow">
            <div class="dark:text-white font-semibold text-start ml-6 text-4xl">
                {plugin.name} Settings
            </div>
            <div
                class="rounded-lg grid md:grid-cols-2 sm:grid-cols-1 px-2 mx-auto py-2 text-2xl"
            >
                {#each Object.entries(new_settings) as [key, setting], i (new_settings[key])}
                    <div in:fly={{ x: 200, duration: 300 + i * 100 }}>
                        <Setting
                            bind:key
                            bind:setting
                            bind:roles
                            on:update={(v) =>
                                (new_settings[key].value = v.detail)}
                        />
                    </div>
                {/each}
            </div>
        </div>
    </div>

    {#if update_modal}
        <SaveState
            reset={() => (new_settings = JSON.parse(JSON.stringify(settings)))}
            on:update={() => {
                new_settings = new_settings;
            }}
            save={saveSettings}
        />
    {/if}
{/if}
