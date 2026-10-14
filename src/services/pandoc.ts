// @ts-expect-error no type declarations for this deep import
import { createPandocInstance } from "../../node_modules/pandoc-wasm/src/core.js";
//@ts-expect-error
import wasmUrl from "../../node_modules/pandoc-wasm/src/pandoc.wasm?url";
interface Pandoc {
      convert<T extends string>(arg: { from: string, to: string, 'output-file': T, standalone: boolean }, file: string): Promise<ConversionResult<T>>;
}
let instance: Pandoc | undefined;

fetch(wasmUrl).then(async buff => instance = await createPandocInstance(await buff.arrayBuffer()))

type ConversionResult<T extends string> = {
      stderr?: string,
      files: Record<T, Blob>,
}
export async function convert(from: string, to: string, file: string): Promise<Blob> {
      const result = await instance?.convert({ from, to, standalone: true, 'output-file': 'output' }, file);
      if (!result) {
            throw new Error('invalid result found. maybe pandoc has not loaded correctly')
      }
      if (result.stderr) {
            throw new Error(result.stderr);
      }
      return result.files.output;
}