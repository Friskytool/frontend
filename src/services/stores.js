import { writable } from 'svelte/store';

export let guilds = writable([]);
guilds.subscribe(guilds => {
    console.log(`Update: ${guilds.length} guilds`);
});
export let user = writable({});
