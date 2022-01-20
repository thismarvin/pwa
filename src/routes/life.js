/* tslint:disable */
/* eslint-disable */
let wasm;

let cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
	if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
		cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
	}
	return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
	return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
 */
export class World {
	static __wrap(ptr) {
		const obj = Object.create(World.prototype);
		obj.ptr = ptr;

		return obj;
	}

	__destroy_into_raw() {
		const ptr = this.ptr;
		this.ptr = 0;

		return ptr;
	}

	free() {
		const ptr = this.__destroy_into_raw();
		wasm.__wbg_world_free(ptr);
	}
	/**
	 * @param {number} width
	 * @param {number} height
	 * @returns {World}
	 */
	static new(width, height) {
		var ret = wasm.world_new(width, height);
		return World.__wrap(ret);
	}
	/**
	 * @returns {number}
	 */
	contents() {
		var ret = wasm.world_contents(this.ptr);
		return ret;
	}
	/**
	 */
	simulate() {
		wasm.world_simulate(this.ptr);
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 */
	get(x, y) {
		var ret = wasm.world_get(this.ptr, x, y);
		return ret !== 0;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {boolean} value
	 */
	set(x, y, value) {
		wasm.world_set(this.ptr, x, y, value);
	}
}

async function load(module, imports) {
	if (typeof Response === "function" && module instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming === "function") {
			try {
				return await WebAssembly.instantiateStreaming(module, imports);
			} catch (e) {
				if (module.headers.get("Content-Type") != "application/wasm") {
					console.warn(
						"`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
						e
					);
				} else {
					throw e;
				}
			}
		}

		const bytes = await module.arrayBuffer();
		return await WebAssembly.instantiate(bytes, imports);
	} else {
		const instance = await WebAssembly.instantiate(module, imports);

		if (instance instanceof WebAssembly.Instance) {
			return { instance, module };
		} else {
			return instance;
		}
	}
}

async function init(input) {
	if (typeof input === "undefined") {
		// input = new URL("life_bg.wasm", import.meta.url);
	}
	const imports = {};
	imports.wbg = {};
	imports.wbg.__wbindgen_throw = function (arg0, arg1) {
		throw new Error(getStringFromWasm0(arg0, arg1));
	};

	if (
		typeof input === "string" ||
		(typeof Request === "function" && input instanceof Request) ||
		(typeof URL === "function" && input instanceof URL)
	) {
		input = fetch(input);
	}

	const { instance, module } = await load(await input, imports);

	wasm = instance.exports;
	init.__wbindgen_wasm_module = module;

	return wasm;
}

export default init;
