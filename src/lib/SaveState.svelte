<script>
    import { fly } from "svelte/transition";

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function update() {
        dispatch("update", null);
    }

    export let reset;
    export let save;

    let loading = false;

    const r = async () => {
        loading = true;
        await reset();
        await update();
        loading = false;
    };

    const s = async () => {
        loading = true;
        await save();
        await update();
        loading = false;
    };
</script>

<div
    class="s-keep flex m-1 bg-gradient-to-r from-orange to-purple items-stretch justify-between w-full fixed bottom-0 h-16 rounded-md p-3 mb-4"
    transition:fly={{ y: 100, duration: 500 }}
>
    <div
        class="s-keep flex-grow text-white text-start text-xl ml-1 justify-start"
    >
        You have unsaved changes
    </div>

    <div class="s-keep justify-end">
        <button
            class="s-keep bg-purple rounded-lg h-10 w-16 text-white m-1"
            on:click={r}>Reset</button
        >
        <button
            class="s-keep bg-orange rounded-lg h-10 w-16 text-white m-1"
            on:click={async () => {
                loading = true;
                await s();
            }}
            disabled={loading}
        >
            {#if loading}
                <div class="flex justify-center items-center">
                    <svg
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
            {:else}
                Save
            {/if}</button
        >
    </div>
</div>
