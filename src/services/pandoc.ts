// @ts-expect-error no type declarations for this deep import
import { createPandocInstance } from "../../node_modules/pandoc-wasm/src/core.js";
//@ts-expect-error
import wasmUrl from "../../node_modules/pandoc-wasm/src/pandoc.wasm?url";

const wasm = await (await fetch(wasmUrl)).arrayBuffer();
const instance = await createPandocInstance(wasm);

type ConversionResult<T extends string> = {
      stderr?: string,
      files: Record<T, Blob>,
}
export async function convert(from: string, to: string, file: string): Promise<Blob> {
      const _: <T extends string>(arg: { from: string, to: string, 'output-file': T, standalone: boolean }, file: string) => Promise<ConversionResult<T>> = instance.convert
      const result = await _({ from, to, standalone: true, 'output-file': 'output' }, file);

      if (result.stderr) {
            throw new Error(result.stderr);
      }
      return result.files.output;
}