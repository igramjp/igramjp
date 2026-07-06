/* tslint:disable */
/* eslint-disable */
/**
* Frequency in Hz for a MIDI note (0-127).
* `temperament` is "sanbun", "just", or "equal".
* @param {number} midi_note
* @param {string} root_key
* @param {number} reference_frequency
* @param {string} temperament
* @param {boolean} root_anchor
* @returns {number}
*/
export function note_frequency(midi_note: number, root_key: string, reference_frequency: number, temperament: string, root_anchor: boolean): number;
/**
* Note name with octave for a MIDI note, e.g. 69 -> "A4".
* @param {number} midi_note
* @returns {string}
*/
export function note_label(midi_note: number): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly note_frequency: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly note_label: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
