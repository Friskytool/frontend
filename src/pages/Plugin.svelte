<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import api, { getSettings } from "../services/api.js";
    import Setting from "../lib/Setting.svelte";

    export let params;
    $: mount(params);

    let roles = [];

    let plugin;
    let update_modal;

    const isEqual = (a, b) => {
        console.log(a, b);
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
        console.log("settings:", new_settings);

        let gdata = await api.get(`/api/guilds/${params.id}`);
        console.log(gdata);
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
</script>

{#if settings}
    <div class="m-2 lg:ml-4 w-full h-screen flex">
        <div class="mt-8" />

        <div class="w-full mb-auto flex-grow">
            <div class="dark:text-white font-semibold text-start ml-6 text-4xl">
                {plugin.name} Settings
            </div>
            <div
                class="rounded-lg grid md:grid-cols-2 sm:grid-cols-1 px-2 mx-auto py-2 text-2xl"
            >
                {#each Object.entries(new_settings) as [key, setting], i}
                    <div in:fly={{ y: 600, duration: 1000 + i * 300 }}>
                        <Setting
                            {key}
                            {setting}
                            {roles}
                            on:update={(v) =>
                                (new_settings[key].value = v.detail)}
                        />
                    </div>
                {/each}
            </div>
        </div>
        {#if update_modal}
            <div
                class="flex mr-4 ml-4 bg-gradient-to-r from-orange to-purple fixed place-self-end h-16 w-full rounded-md p-4 mb-4"
                transition:fly={{ y: 100, duration: 500 }}
            >
                <div class="text-white w-64 text-start text-xl">
                    You have unsaved changes
                </div>
                <button
                    class="bg-purple h-8 rounded-lg w-16 text-white ml-4 mr-4"
                    on:click={() =>
                        (new_settings = JSON.parse(JSON.stringify(settings)))}
                    >Reset</button
                >
                <button
                    class="bg-orange h-8 rounded-lg w-16 text-white"
                    on:click={saveSettings}>Save</button
                >
            </div>
        {/if}
    </div>
{/if}
