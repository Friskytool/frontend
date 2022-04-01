<script>
    import { fly } from "svelte/transition";

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function update() {
        dispatch("update", null);
    }

    export let reset;
    export let save;

    const r = () => {
        reset();
        update();
    };

    const s = () => {
        save();
        update();
    };
</script>

<div
    class="flex m-1 bg-gradient-to-r from-orange to-purple items-stretch justify-between w-full fixed bottom-0 h-16 rounded-md p-3 mb-4"
    transition:fly={{ y: 100, duration: 500 }}
>
    <div class="flex-grow text-white text-start text-xl ml-1 justify-start">
        You have unsaved changes
    </div>

    <div class="justify-end">
        <button
            class="bg-purple rounded-lg h-10 w-16 text-white m-1"
            on:click={r}>Reset</button
        >
        <button
            class="bg-orange rounded-lg h-10 w-16 text-white m-1"
            on:click={s}>Save</button
        >
    </div>
</div>
