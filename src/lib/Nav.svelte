<script>
    import { fly } from "svelte/transition";
    import { link } from "svelte-spa-router";

    let isActive = false;
    function toggleMenu() {
        isActive = !isActive;
    }
</script>

<nav class="navbar" in:fly={{ y: -10, duration: 50 }}>
    <div class="max-w-7x mx-auto px-2 sm:px-6 lg:px-8">
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
                        on:click={toggleMenu}
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

            <div
                class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
            >
                <a href="/" class="flex-shrink-0 flex items-center" use:link>
                    <img
                        class="block lg:hidden h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                        alt="Friskytool"
                    />
                    <img
                        class="hidden lg:block h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                        alt="Friskytool"
                    />
                </a>
                <div class="hidden sm:block sm:ml-6">
                    <div class="flex space-x-4">
                        <!-- Current: "bg-grey-900 text-white", Default: "text-grey-300 hover:bg-grey-700 hover:text-white dark:text-white" -->
                        <a
                            href="/app"
                            class="text-grey-300 hover:bg-grey-700 hover:text-white dark:text-white px-3 py-2 rounded-md text-sm font-medium"
                            aria-current="page"
                            use:link>Dashboard</a
                        >

                        <a
                            href="https://patreon.com/Friskytool"
                            class="text-grey-300 hover:bg-grey-700 hover:text-white dark:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >Donate</a
                        >

                        <a
                            href="/stats"
                            class="text-grey-300 hover:bg-grey-700 hover:text-white dark:text-white px-3 py-2 rounded-md text-sm font-medium"
                            use:link>Stats</a
                        >

                        <a
                            href="https://discord.gg/TMu242J"
                            class="text-grey-300 hover:bg-grey-700 hover:text-white dark:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >Support</a
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    {#if isActive}
        <div
            class="sm:hidden"
            id="mobile-menu"
            transition:fly={{ y: -10, duration: 250 }}
        >
            <div class="px-2 pt-2 pb-3 space-y-1">
                <!-- Current: "bg-grey-900 text-white", Default: "text-grey-300 hover:bg-grey-700 hover:text-white dark:text-white" -->
                <a
                    href="/app"
                    class="bg-grey-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                    aria-current="page"
                    use:link>Dashboard</a
                >

                <a
                    href="https://patreon.com/Friskytool"
                    class="text-grey-300 hover:bg-grey-700 hover:text-white dark:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >Donate</a
                >

                <a
                    href="/stats"
                    class="text-grey-300 hover:bg-grey-700 hover:text-white dark:text-white block px-3 py-2 rounded-md text-base font-medium"
                    use:link>Stats</a
                >

                <a
                    href="https://discord.gg/TMu242J"
                    class="text-grey-300 hover:bg-grey-700 hover:text-white dark:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >Help</a
                >
            </div>
        </div>
    {/if}
</nav>

<style>
    :global([aria-current]) {
        font-weight: bold;
    }
</style>
