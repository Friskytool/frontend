<script>
    // @ts-nocheck

    import { clickOutside } from "../services/clickOutside.js";
    import Switch from "../lib/Switch.svelte";
    import { modal } from "../services/stores.js";
    import api from "../services/api.js";
    let tag_error = "";

    export let data = {};

    export let _data = {
        ...{
            name: "",
            description: "",
            tagscript: "",
            options: [],
            guild_id: "",
            author_id: "",
        },
        ...data,
    };
    $: {
        _data.name = _data.name.toLocaleLowerCase();
        console.log(_data);
        tag_error = validateTag(_data);
        autoGenerateVariables(_data.tagscript);
    }

    const validateOption = (option_data) => {
        if (
            option_data.name.length == 0 &&
            option_data.description.length == 0 &&
            option_data.type == 3 &&
            option_data.required == false
        ) {
            return "";
        }
        if (option_data.name.length === 0 || option_data.name.length > 32) {
            return "Name must be between 1 and 32 characters";
        }
        if (option_data.name.indexOf(" ") !== -1) {
            return "Name cannot contain spaces";
        }
        if (
            option_data.description.length == 0 ||
            option_data.description.length > 128
        ) {
            return "Description must be between 1 and 128 characters";
        }

        if (_data.options.find((o) => o.name === option_data.name)) {
            return "Argument names must be unique";
        }
        return "";
    };

    const validateTag = (_data) => {
        if (_data.name.length == 0 || _data.name.length > 32) {
            return "Name must be between 1 and 32 characters";
        }
        if (_data.name.indexOf(" ") !== -1) {
            return "Name cannot contain spaces";
        }
        if (_data.description.length == 0 || _data.description.length > 128) {
            return "Description must be between 1 and 128 characters";
        }
        if (_data.tagscript.length == 0 || _data.tagscript.length > 1024) {
            return "Tagscript must be between 1 and 1024 characters";
        }

        if (error_message) {
            return "View Argument create error";
        }

        if (new_option.name !== "" && new_option.description !== "") {
            return "You have an incomplete argument";
        }

        return "";
    };

    function autoGenerateVariables(text) {
        let variables = [];
        let regex = /\{([^}]+)\}/g;
        let match;
        let allowed = ["target", "user", "args"];
        while ((match = regex.exec(text)) !== null) {
            let variable = match[1];

            if (allowed.includes(variable)) {
                variables.push(variable);
            }
        }
        variables = [...new Set(variables)];
        let m = (b, a) => {
            return a === b || a.startsWith(b + "(");
        };
        for (const v of variables) {
            if (_data.options.find((o) => o.name == v)) {
                continue;
            }
            console.log(v);
            if (m(v, "target")) {
                _data.options.push({
                    name: "target",
                    description: "Autogenerated variable",
                    type: 6,
                    required: false,
                });
            } else if (m(v, "user")) {
                _data.options.push({
                    name: "user",
                    description: "Autogenerated variable",
                    type: 6,
                    required: true,
                });
            } else if (m(v, "args")) {
                _data.options.push({
                    name: "args",
                    description: "Autogenerated variable",
                    type: 6,
                    required: false,
                });
            }
        }
        for (const option of _data.options) {
            console.log(
                option.name,
                allowed.includes(option.name),
                option.description
            );
            if (allowed.includes(option.name)) {
                console.log(option);
                if (!variables.includes(option.name)) {
                    _data.options.splice(_data.options.indexOf(option), 1);
                }
            }
        }
        _data = _data;
    }
    const createTag = async () => {
        let error = validateTag(_data);
        if (error) {
            tag_error = error;
            return;
        }

        let response = await api.post(
            `/api/guilds/${_data.guild_id}/tags`,
            _data
        );
        console.log(response);
        modal.update((_) => null);
    };

    let o_types = ["text", "number", "boolean", "user", "channel", "role"];
    let list_open = null;
    let list_open2 = null;
    let error_message = "";
    let new_option = {
        name: "",
        description: "",
        type: 3,
        required: false,
    };
    $: error_message = validateOption(new_option);
</script>

<div class="bg-black text-white">
    <div class="text-center">
        <h1 class="text-xl lg:text-3xl">Create Tag</h1>
    </div>
    <div>
        <div class="mb-4">
            <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="name"
            >
                Name
            </label>
            <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-black leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                bind:value={_data.name}
            />
        </div>
        <div class="mb-4">
            <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="description"
            >
                Description
            </label>
            <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-black leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="text"
                placeholder="Description"
                bind:value={_data.description}
            />
        </div>

        <div class="mb-4">
            <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="tagscript"
            >
                Tag Script
            </label>

            <div class="relative">
                <pre
                    aria-hidden="true"
                    style="min-height: 4.1em; max-height: 30em">{_data.tagscript +
                        "\n\n"}</pre>
                <textarea
                    type="text"
                    spellcheck="false"
                    placeholder="Tag Script"
                    bind:value={_data.tagscript}
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
        </div>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="options">
            Arguments
        </label>
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
            {#each _data.options as option}
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
                    <button
                        class="p-2 text-md lg:text-xl border-2 text-red border-red pr-3 rounded-lg"
                        on:click={() => {
                            _data.options = _data.options.filter(
                                (o) => o.name != option.name
                            );
                        }}>x</button
                    >
                </tr>
            {/each}
            <!-- Create new option -->
            <tr class="bg-grey-700 rounded-md">
                <td class="inline-block">
                    <input
                        class="bg-black rounded-md focus:outline-none"
                        bind:value={new_option.name}
                    />
                </td>
                <td>
                    <input
                        class="bg-black rounded-md focus:outline-none"
                        bind:value={new_option.description}
                    />
                </td>
                <td>
                    <div class="mt-1 w-32 removable relative bg-black">
                        <button
                            type="button"
                            class="relative removable w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange sm:text-sm"
                            use:clickOutside
                            on:click_outside={() => (list_open = null)}
                            on:click={() =>
                                (list_open2 =
                                    list_open2 == new_option.name
                                        ? null
                                        : new_option.name)}
                        >
                            <span class="flex items-center">
                                <span class="ml-3 block truncate">
                                    {o_types[new_option.type - 3]}
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
                        {#if list_open2 == new_option.name}
                            <ul
                                class="absolute removable divide-x z-10 mt-1 dark:text-white bg-black shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 w-full overflow-auto focus:outline-none sm:text-sm"
                                tabindex="-1"
                            >
                                <!--
        Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

        Highlighted: "text-white bg-indigo-600", Not Highlighted: "dark:text-white"
      -->
                                {#each o_types as type, i}
                                    {#if i + 3 != new_option.type}
                                        <li
                                            class="dark:text-white z-10 removable hover:bg-grey-700 cursor-default select-none relative py-2 pl-2"
                                            id="listbox-option-0"
                                            role="option"
                                            on:click={() => {
                                                new_option.type = i + 3;
                                                list_open2 = null;
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
                </td>
                <td>
                    <Switch bind:checked={new_option.required} />
                </td>
                <button
                    class="p-2 text-md lg:text-xl text-white bg-black border-2 text-green border-green rounded-lg"
                    disabled={error_message !== ""}
                    on:click={() => {
                        _data.options = [new_option, ..._data.options];
                        new_option = {
                            name: "",
                            description: "",
                            type: 3,
                            required: false,
                        };
                    }}>+</button
                >
            </tr>
        </table>
        {#if error_message != ""}
            <div class="text-red text-sm mt-2">
                Argument Error: {error_message}
            </div>
        {/if}
        <div class="inline-block mt-8">
            <button disabled={tag_error != ""} on:click={createTag}>
                <div
                    class="p-2 bg-black border border-green text-green rounded-lg"
                >
                    Create Tag
                </div>
            </button>
            <button
                on:click={() => modal.update((_) => null)}
                class="p-2 bg-black border border-red text-red rounded-lg ml-2"
                >Cancel
            </button>
        </div>
        {#if tag_error != ""}
            <div class="text-red text-sm mt-2">
                Tag Validation Error: {tag_error}
            </div>
        {/if}
    </div>
</div>

<style>
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
