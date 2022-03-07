<script>
	import { onMount } from "svelte";

	import { quintOut } from "svelte/easing";
	import { fade, draw, fly } from "svelte/transition";
	import { expand } from "../services/transitions.js";
	import { inner, outer } from "../assets/logo.js";

	let visible = false;

	onMount(async () => {
		visible = true;
	});
</script>

<div class="container ml-3 mt-16 lg:ml-8 h-full w-64">
	{#if visible}
		<span
			in:fade={{ delay: 4400 }}
			class="font-bold uppercase tracking-widest text-white"
			>Introducing</span
		>
		<svg
			viewBox="0 0 387.201 88.103"
			xmlns="http://www.w3.org/2000/svg"
			class="w-1/2 mr-10 mb-3"
			style="opacity: 1; transform: translateY(20px);"
			overflow="visible"
		>
			<g
				out:fade={{ duration: 200 }}
				opacity="0.7"
				stroke-linecap="round"
				fill-rule="evenodd"
				font-size="10pt"
				fill="none"
			>
				<path
					in:draw={{ duration: 10500 }}
					style="stroke-width: 3"
					d={inner}
				/>
			</g>
			<g
				id="svgGroup-2"
				stroke-linecap="round"
				fill-rule="evenodd"
				font-size="9pt"
				stroke-width="0.2mm"
				opacity="0.968"
			>
				<path
					in:expand={{
						duration: 1500,
						delay: 4400,
						easing: quintOut,
					}}
					d={outer}
					style="stroke-width: 3"
				/>
			</g>
		</svg>
	{/if}
	<div
		id="hook"
		in:expand={{ delay: 4400, easing: quintOut, duration: 1500 }}
		class="mt-2 h-32 lg:mt-8 overflow-visible text-orange font-bold lg:text-6xl md:text-4xl text-3xl"
	>
		Giveaways Reimagined
	</div>
</div>

<style>
	/* Make the svg stroke black if prefers dark otherwise make it white using css*/
	@media (prefers-color-scheme: light) {
		svg {
			stroke: black;
			fill: black;
		}
	}
	svg {
		stroke: white;
		fill: white;
	}

	#hook {
		background: -webkit-linear-gradient(#eee, #333);
		background-image: linear-gradient(60deg, #642ad6, #ff8b58 70%);
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
