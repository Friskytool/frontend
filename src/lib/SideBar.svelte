<script>
    import { location, push } from "svelte-spa-router";
    import { fly } from "svelte/transition";
    import { link } from "svelte-spa-router";
    import api from "../services/api.js";
    let plugins_visible = false;

    setTimeout(() => {
        plugins_visible = true;
    }, 1500);
    let guild_id = $location.split("/")[2];
    location.subscribe((l) => {
        guild_id = l.split("/")[2];
    });
    let menu = `hidden`;
    $: console.log("menu", menu);
    let plugin_data = api.get("/static/plugins.json");
</script>

<!-- <div class="sm:hidden">
    <div class="relative h-16 w-screen block border-4 dark:border-white">
        xS
    </div>
</div> -->

<div class="sm:hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <!-- Mobile menu button-->
                <button
                    type="button"
                    class="inline-flex items-center justify-center p-2 rounded-md text-grey-400 hover:text-white dark:text-white hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                >
                    <span class="sr-only">Open main menu</span>
                    <!--
            Icon when menu is closed.

            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          -->
                    <svg
                        class="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                        on:click={() => {
                            if (menu == "") {
                                menu = "hidden";
                            } else {
                                menu = "";
                            }
                        }}
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                    <!--
            Icon when menu is open.

            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          -->
                    <svg
                        class="hidden h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
<aside
    class="h-screen {menu} lg:inline-block"
    aria-label="Sidebar"
    in:fly={{ x: -10, duration: 450 }}
>
    <div
        class="w-64 px-3 py-4 rounded bg-white dark:bg-black md:h-full sm:relative shadow-md shadow-orange/50"
    >
        <ul class="space-y-2">
            <li>
                <a
                    href="/app"
                    use:link
                    class="flex items-center p-2 text-base font-normal text-grey rounded-lg dark:text-white hover:bg-grey-700 dark:hover:bg-grey-700"
                >
                    <svg
                        class="w-6 h-6 text-grey transition duration-75 dark:text-grey group-hover:text-grey dark:group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        ><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path
                            d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
                        /></svg
                    >
                    <span class="ml-3">Servers</span>
                </a>
            </li>
            <li>
                <button
                    type="button"
                    class="flex items-center w-full p-2 text-base font-normal text-grey transition duration-75 rounded-lg group hover:bg-grey-700 dark:text-white dark:hover:bg-grey-700"
                    on:click={() => {
                        push(`/app/${guild_id}/`);
                    }}
                >
                    <svg
                        class="flex-shrink-0 w-6 h-6 text-grey transition duration-75 group-hover:text-grey dark:text-grey dark:group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        ><path
                            fill-rule="evenodd"
                            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                            clip-rule="evenodd"
                        /></svg
                    >
                    <span
                        class="flex-1 ml-3 text-left whitespace-nowrap"
                        sidebar-toggle-item="">Plugins</span
                    >
                    <svg
                        sidebar-toggle-item=""
                        class="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        ><path
                            fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        /></svg
                    >
                </button>
                {#if plugins_visible}
                    <ul id="dropdown-example" class="py-2 space-y-2">
                        {#await plugin_data}
                            <li>
                                <div
                                    class="cursor-wait flex items-center w-full p-2 text-base font-normal text-grey transition duration-75 rounded-lg group hover:bg-grey-700 dark:text-white dark:hover:bg-grey-700 pl-11"
                                >
                                    Loading...
                                </div>
                            </li>
                        {:then plugins}
                            {#each plugins as plugin, i}
                                <li in:fly={{ x: -30, delay: i * 100 }}>
                                    <a
                                        href="/app/{guild_id}/plugins/{plugin.slug}"
                                        class="flex items-center w-full p-2 text-base font-normal text-grey transition duration-75 rounded-lg group hover:bg-grey-700 dark:text-white dark:hover:bg-grey-700 pl-11"
                                        use:link>{plugin.name}</a
                                    >
                                </li>
                            {/each}
                        {/await}
                    </ul>
                {/if}
            </li>
            <li>
                <a
                    href="/app/{guild_id}/custom-bot"
                    use:link
                    class="flex items-center p-2 text-base font-normal text-grey rounded-lg dark:text-white hover:bg-grey-700 dark:hover:bg-grey-700"
                >
                    <svg
                        class="flex-shrink-0 w-6 h-6 text-grey transition duration-75 dark:text-grey group-hover:text-grey dark:group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        ><path
                            d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        /></svg
                    >
                    <span class="flex-1 ml-3 whitespace-nowrap">Custom Bot</span
                    >
                    <span
                        class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-grey bg-grey-100 rounded-full dark:bg-orange dark:text-grey"
                        >Premium</span
                    >
                </a>
            </li>
            <li>
                <a
                    href="/app/{guild_id}/giveaways"
                    use:link
                    class="flex items-center p-2 text-base font-normal text-grey rounded-lg dark:text-white hover:bg-grey-700 dark:hover:bg-grey-700"
                >
                    <svg
                        class="flex-shrink-0 w-6 h-6 text-grey transition duration-75 dark:text-grey group-hover:text-grey dark:group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        ><path
                            d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"
                        /><path
                            d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                        /></svg
                    >
                    <span class="flex-1 ml-3 whitespace-nowrap">Giveaways</span>
                    <span
                        class="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200"
                        >0</span
                    >
                </a>
            </li>
            <li>
                <a
                    href="https://discord.gg/TMu242J"
                    target="_blank"
                    class="flex items-center p-2 text-base font-normal text-grey rounded-lg dark:text-white hover:bg-grey-700 dark:hover:bg-grey-700"
                >
                    <svg
                        class="flex-shrink-0 w-6 h-6 text-grey transition duration-75 dark:text-grey group-hover:text-grey dark:group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        ><path
                            fill-rule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd"
                        /></svg
                    >
                    <span class="flex-1 ml-3 whitespace-nowrap"
                        >Support Server</span
                    >
                </a>
            </li>
        </ul>
    </div>
</aside>
