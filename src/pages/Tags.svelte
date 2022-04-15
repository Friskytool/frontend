<script>
    // @ts-nocheck

    import api, { getUser } from "../services/api";
    import Tag from "../lib/Tag.svelte";
    import { bind } from "svelte-simple-modal";
    import { onMount } from "svelte";
    import SaveState from "../lib/SaveState.svelte";
    import CreateTag from "../lib/CreateTag.svelte";
    import { modal } from "../services/stores";
    export let params;

    const display = (data) => {
        if (filter) {
            return data.filter((d) =>
                d.name.toLowerCase().includes(filter.toLowerCase())
            );
        } else {
            return data;
        }
    };

    let user;
    let tags;
    $: console.log(tags);
    let tags_clone;
    let selected = null;
    let filter = null;
    let update_modal = false;
    $: update_modal = !isEqual(tags, tags_clone);
    onMount(async () => {
        tags = await api.get(`/api/guilds/${params.id}/tags`);
        tags_clone = JSON.parse(JSON.stringify(tags));
        user = await getUser();
    });

    const isEqual = (a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    const saveTags = async () => {
        for (const tag of tags) {
            console.log(tag);
            if (
                !isEqual(
                    tag,
                    tags_clone.find((t) => t.name === tag.name)
                )
            ) {
                await api.patch(
                    `/api/guilds/${params.id}/tags/${tag.name}`,
                    tag
                );
            }
        }
        tags_clone = JSON.parse(JSON.stringify(tags));
    };

    function createTagModal() {
        // @ts-ignore
        modal.set(
            bind(CreateTag, {
                data: { guild_id: params.id, author_id: user.id },
            })
        );
    }
</script>

<div
    class="ml-8 lg:ml-64 h-full w-full w-50 block dark:text-white p-2 lg:p-4 m-1"
>
    <div class="flex relative">
        <div class="p-4 flex-grow">
            <label for="table-search" class="sr-only">Search</label>
            <div class="relative mt-1">
                <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                >
                    <svg
                        class="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    id="table-search"
                    class="bg-black border border-white text-md rounded-lg focus:border-black focus:ring-orange ring-none block w-full pl-10 p-2.5"
                    placeholder="Filter tags"
                    bind:value={filter}
                />
            </div>
        </div>
        <div class="p-4">
            <button
                class="bg-black rounded-lg border text-black border-white dark:text-white px-4 py-3"
                on:click={createTagModal}
            >
                <div class="text-orange">Create Tag</div>
            </button>
        </div>
    </div>
    {#if tags}
        <div
            class="rounded-lg grid grid-cols-1 w-full px-2 mx-auto py-2 text-2xl"
        >
            {#each display(tags) as tag (tag.name + filter)}
                <div
                    class="w-full shadow-lg shadow-black bg-black rounded-lg px-3 py-2 m-2 rounded-lg border-1 border-black hover:border-white"
                    on:click={() => (selected = tag)}
                >
                    <Tag bind:data={tag} on:update={() => (tag = tag)} />
                </div>
            {/each}
        </div>
    {/if}
</div>
{#if update_modal}
    <SaveState
        reset={() => (tags = JSON.parse(JSON.stringify(tags_clone)))}
        on:update={() => {
            tags = tags;
        }}
        save={saveTags}
    />
{/if}
