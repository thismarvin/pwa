/* tslint:disable */
/* eslint-disable */
/**
 */
export class World {
	free(): void;
	/**
	 * @param {number} width
	 * @param {number} height
	 * @returns {World}
	 */
	static new(width: number, height: number): World;
	/**
	 * @returns {number}
	 */
	contents(): number;
	/**
	 */
	simulate(): void;
	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 */
	get(x: number, y: number): boolean;
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {boolean} value
	 */
	set(x: number, y: number, value: boolean): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
	readonly memory: WebAssembly.Memory;
	readonly __wbg_world_free: (a: number) => void;
	readonly world_new: (a: number, b: number) => number;
	readonly world_contents: (a: number) => number;
	readonly world_simulate: (a: number) => void;
	readonly world_get: (a: number, b: number, c: number) => number;
	readonly world_set: (a: number, b: number, c: number, d: number) => void;
}

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function init(module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
