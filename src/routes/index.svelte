<script lang="ts">
	import Life from "./_Life.svelte";
	import init from "./life";
	import wasmUrl from "./life_bg.wasm?url";
</script>

<svelte:head>
	<title>Life</title>
</svelte:head>

<main>
	<section>
		{#await fetch(wasmUrl) then input}
			{#await init(input) then wasm}
				<Life {wasm} />
			{/await}
		{/await}
	</section>
</main>

<style>
	:global(html, body) {
		font-size: min(5vw, 16px);
		margin: 0;
		padding: 0;
		min-height: 100vh;
	}

	main {
		display: flex;
		min-height: 100vh;
	}

	section {
		--padding: 1rem;

		margin: auto;
		padding: var(--padding);
		width: calc(100vw - calc(var(--padding) * 2));
		max-width: calc(800px - calc(var(--padding) * 2));
	}
</style>
