<script>
    // @ts-nocheck

    export let data;
    $: update(data);

    import { createEventDispatcher } from "svelte";
    import { clickOutside } from "../services/clickOutside";
    import Switch from "./Switch.svelte";
    const dispatch = createEventDispatcher();

    function update(value) {
        console.log(value);
        dispatch("update", value);
    }

    let o_types = ["text", "number", "boolean", "user", "channel", "role"];
    let new_tag = {
        id: "",
        name: "",
        color: "",
        is_default: false,
        is_active: false,
    };
    let open = true;

    let list_open = null;
</script>

<div
    class="bg-black rounded-md m-1 p-2 w-full"
    on:click={() => (open = true)}
    use:clickOutside
    on:click_outside={() => (open = false)}
>
    <div class="text-start">
        <div
            class="lg:text-6xl text-3xl capitalize mb-2 lg:mb-4 text-gray-700 transform"
        >
            {data.name}
        </div>
    </div>
    {#if open}
        <div class="text-grey-400 text-xl lg:text-3xl m-1 mb-3">Arguments</div>
        <table
            class="bg-black shadow-bottom divide-y divide-orange shadow-orange rounded-lg"
        >
            <thead>
                <tr>
                    <th class="text-white lg:text-xl p-2">Name</th>
                    <th class="text-white text-xl lg:text-xl p-2"
                        >Description</th
                    >
                    <th class="text-white text-xl lg:text-xl p-2">Type</th>
                    <th class="text-white text-xl lg:text-xl p-2">Required</th>
                </tr>
            </thead>
            {#each data.options as option}
                <tr class="container bg-black m-2 rounded-md p-2">
                    <td class="inline-block">
                        <input
                            class="bg-black rounded-md focus:outline-none focus:bg-grey-700"
                            bind:value={option.name}
                        />
                    </td>
                    <td>
                        <input
                            class="bg-black rounded-md focus:outline-none focus:bg-grey-700"
                            bind:value={option.description}
                        />
                    </td>
                    <td>
                        <div>
                            <div class="mt-1 w-32 removable relative bg-black">
                                <button
                                    type="button"
                                    class="relative removable w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange sm:text-sm"
                                    use:clickOutside
                                    on:click_outside={() => (list_open = null)}
                                    on:click={() =>
                                        (list_open =
                                            list_open == option.name
                                                ? null
                                                : option.name)}
                                >
                                    <span class="flex items-center">
                                        <span class="ml-3 block truncate">
                                            {o_types[option.type - 3]}
                                        </span>
                                    </span>
                                    <span
                                        class="absolute inset-y-0 right-0 flex items-center pointer-events-none"
                                    >
                                        <!-- Heroicon name: solid/selector -->
                                        <svg
                                            class="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                </button>

                                <!--
      Select popover, show/hide based on select state.

      Entering: ""
        From: ""
        To: ""
      Leaving: "transition ease-in duration-100"
        From: "opacity-100"
        To: "opacity-0"
    -->
                                {#if list_open == option.name}
                                    <ul
                                        class="absolute removable divide-x z-10 mt-1 dark:text-white bg-black shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 w-full overflow-auto focus:outline-none sm:text-sm"
                                        tabindex="-1"
                                    >
                                        <!--
        Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

        Highlighted: "text-white bg-indigo-600", Not Highlighted: "dark:text-white"
      -->
                                        {#each o_types as type, i}
                                            {#if i + 3 != option.type}
                                                <li
                                                    class="dark:text-white z-10 removable hover:bg-grey-700 cursor-default select-none relative py-2 pl-2"
                                                    id="listbox-option-0"
                                                    role="option"
                                                    on:click={() => {
                                                        option.type = i + 3;
                                                        list_open = null;
                                                    }}
                                                >
                                                    <div
                                                        class="flex items-center removable"
                                                    >
                                                        <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                                                        <span
                                                            class="font-normal removable block truncate"
                                                        >
                                                            {type}
                                                        </span>
                                                    </div>
                                                </li>
                                            {/if}
                                        {/each}
                                        <!-- More items... -->
                                    </ul>
                                {/if}
                            </div>
                        </div>
                    </td>
                    <td class="text-center bg-black">
                        <Switch bind:checked={option.required} />
                    </td>
                </tr>
            {/each}
        </table>
        <div class="text-grey-400 text-xl lg:text-3xl m-1 mt-3 lg:mt-6">
            Tagscript
        </div>

        <div class="containertxt">
            <pre
                aria-hidden="true"
                style="min-height: 4.1em; max-height: 30em">{data.tagscript +
                    "\n\n"}</pre>
            <textarea
                type="text"
                spellcheck="false"
                placeholder="Placeholder"
                bind:value={data.tagscript}
                class="text-white w-full h-24 p-2 relative bg-grey-700 rounded-lg leading-tight focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
            />
        </div>
    {/if}
</div>

<style>
    .containertxt {
        position: relative;
    }

    pre,
    textarea {
        font-family: inherit;
        padding: 0.5em;
        box-sizing: border-box;
        line-height: 1.2;
        overflow: hidden;
    }

    textarea {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        resize: none;
    }
</style>
