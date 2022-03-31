<script>
    import { fly } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
    import Tags from "svelte-tags-input";
    import Switch from "./Switch.svelte";
    const dispatch = createEventDispatcher();

    function clickOutside(node, { enabled: initialEnabled, cb }) {
        const handleOutsideClick = ({ target }) => {
            if (
                !node.contains(target) &&
                target.id !== "remove-icon" &&
                !(
                    target.classList.length > 0 &&
                    target.classList[0].startsWith("s-")
                )
            ) {
                console.log(target);
                cb();
            }
        };

        function update({ enabled }) {
            if (enabled) {
                window.addEventListener("click", handleOutsideClick);
            } else {
                window.removeEventListener("click", handleOutsideClick);
            }
        }

        update({ enabled: initialEnabled });
        return {
            update,
            destroy() {
                window.removeEventListener("click", handleOutsideClick);
            },
        };
    }

    export let key = "";
    export let setting = {};
    export let roles = [];

    let value = insert(setting.value);
    $: update(value);

    function insert(value) {
        if (Array.isArray(value)) {
            return value
                .map((v) => roles.find((r) => r.id === v.id))
                .filter((v) => v !== undefined);
        }

        return value;
    }

    function update(value) {
        // if value is list map to every id element in list
        console.log(value);
        if (Array.isArray(value)) {
            console.log(value);
            value = value.map((v) => {
                return { id: v.id };
            });
        }
        dispatch("update", value);
    }

    let open = false;
</script>

<div
    id="setting:{key}"
    use:clickOutside={{
        enabled: open,
        cb: () => {
            open = false;
            update(value);
        },
    }}
    on:click={() => (open = true)}
    class="shadow-lg shadow-black bg-black rounded-lg px-4 py-4 m-2 rounded-lg"
>
    <div class="font-bold text-3xl mb-2 text-white">
        {setting.name}
    </div>
    {#if open}
        <div class="flex flex-col" in:fly={{ y: -100, duration: 500 }}>
            <p class="text-gray-700 text-base text-grey-400">
                {setting.description}
            </p>
            <div class="mt-3">
                {#if setting.type == "string"}
                    <textarea
                        type="text"
                        placeholder="Placeholder"
                        bind:value
                        class="text-white w-full h-24 p-2 relative bg-grey-700 rounded-lg text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
                    />
                {:else if setting.type == "number"}
                    <input
                        type="number"
                        placeholder="Placeholder"
                        bind:value
                        class="px-3 py-3 text-white relative bg-white bg-grey-700 rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full"
                    />
                {:else if setting.type == "boolean"}
                    <div class="flex justify-center">
                        <div class="form-check form-switch">
                            <Switch bind:checked={value} />
                        </div>
                    </div>
                {:else if setting.type == "select"}
                    <select
                        bind:value
                        class="px-3 py-3 text-white relative bg-white bg-grey-700 rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full"
                    >
                        {#each setting.options as option}
                            <option value={option}>{option}</option>
                        {/each}
                    </select>
                {:else if setting.type == "roles"}
                    <Tags
                        autoComplete={roles}
                        autoCompleteKey={"name"}
                        id={"id"}
                        placeholder="Add a role"
                        tags={value}
                        maxTags={10}
                        onlyUnique={true}
                        allowPaste={true}
                        allowDrop={true}
                        on:tags={(e) => (value = value)}
                    />
                {:else if setting.type == "list"}
                    <div class="max-w-lg m-2">
                        <div class="relative">
                            <input
                                class="appearance-none block w-full bg-grey-700 text-white border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
                                on:keydown={({ key, target }) => {
                                    if (key == "Enter") {
                                        // @ts-ignore
                                        value.push(target.value);
                                        // @ts-ignore
                                        target.value = "";
                                        value = value; // force update
                                    }
                                }}
                                placeholder="Enter role"
                            />

                            <!-- selections -->
                            {#each value as tag, i}
                                <div
                                    class="bg-grey-800 inline-flex items-center text-sm rounded mt-2 mr-1 overflow-hidden"
                                >
                                    <span
                                        class="ml-2 mr-1 leading-relaxed truncate max-w-xs px-1 text-white"
                                        x-text="tag">{tag}</span
                                    >
                                    <button
                                        class="w-6 h-8 inline-block align-middle text-gray-500 bg-blue-200 focus:outline-none"
                                        on:click={() => {
                                            value.splice(i, 1);
                                            value = value;
                                        }}
                                    >
                                        <svg
                                            id="remove-icon"
                                            class="w-6 h-6 fill-current mx-auto"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            ><path
                                                fill-rule="evenodd"
                                                d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"
                                            /></svg
                                        >
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
