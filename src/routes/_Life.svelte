<script lang="ts">
	import Color from "$lib/color";
	import Pixels from "$lib/pickles";
	import type { InitOutput } from "./life";
	import { World } from "./life";
	import { browser } from "$app/env";
	import { onDestroy, onMount } from "svelte";

	export let wasm: InitOutput;

	let parent: HTMLElement;
	let canvas: HTMLCanvasElement;
	let requestHandle: number;

	const width = 128;
	const height = 128;

	const bits = 32;
	const world = World.new(width, height);
	const contents = new Uint32Array(
		wasm.memory.buffer,
		world.contents(),
		Math.ceil((width * height) / bits)
	);

	let pixels: Pixels;

	const white = Color.fromHex(0xffffff);
	const black = Color.fromHex(0x000000);

	function update() {
		world.simulate();
	}

	function draw() {
		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				let index = y * width + x;
				let i = Math.floor(index / bits);
				let j = index % bits;

				let tmp = contents[i];

				const color = (() => {
					if ((tmp & (1 << j)) !== 0) {
						return black;
					}

					return white;
				})();

				pixels.set(x, y, color);
			}
		}

		pixels.draw();
	}

	const target = 1 / 15;
	const maxFrameSkip = 10;
	const maxDeltaTime = maxFrameSkip * target;

	let totalElapsedTime = 0;
	let accumulator = 0;

	function loop(timeStamp: number) {
		let deltaTime = (timeStamp - totalElapsedTime) / 1000;

		if (Number.isNaN(deltaTime)) {
			deltaTime = 0;
		}

		if (deltaTime > maxDeltaTime) {
			deltaTime = maxDeltaTime;
		}

		totalElapsedTime = timeStamp;

		accumulator += deltaTime;

		while (accumulator >= target) {
			update();

			accumulator -= target;
		}

		draw();

		if (browser) {
			requestHandle = requestAnimationFrame((timeStamp) => loop(timeStamp));
		}
	}

	onMount(() => {
		canvas.width = parent.clientWidth * 2;
		canvas.height = parent.clientHeight * 2;
		canvas.style.width = `${parent.clientWidth}px`;
		canvas.style.height = `${parent.clientHeight}px`;

		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				if (Math.random() <= 0.25) {
					world.set(x, y, true);
				}
			}
		}

		pixels = new Pixels(canvas, width, height);

		loop(0);
	});

	onDestroy(() => {
		if (browser) {
			cancelAnimationFrame(requestHandle);
		}
	});
</script>

<div class="canvas-wrapper-wrapper">
	<div bind:this={parent} class="canvas-wrapper">
		<div class="canvas-container">
			<canvas bind:this={canvas} />
		</div>
	</div>
</div>

<style>
	.canvas-wrapper-wrapper {
		border: 0.2rem solid black;
	}

	.canvas-wrapper {
		position: relative;
		padding-top: calc(1 / (1 / 1) * 100%);
	}

	.canvas-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
