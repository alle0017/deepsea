// @ts-expect-error no type declarations for this deep import
import { createPandocInstance } from "../../node_modules/pandoc-wasm/src/core.js";
//@ts-expect-error
import wasmUrl from "../../node_modules/pandoc-wasm/src/pandoc.wasm?url";

const wasm = await (await fetch(wasmUrl)).arrayBuffer();
const instance = await createPandocInstance(wasm);

type ConversionResult = {
      stderr?: string,
      stdout: string
}
export async function convert(from: string, to: string, file: string): Promise<ConversionResult> {
      const result = await instance.convert({ from, to, standalone: true }, file);
      return result
}