import { Crepe, CrepeConfig } from "@milkdown/crepe";
import { EditorPlugin } from "./editor_plugin";
import { ErrorToast } from "../error_toast";


async function upload(file: File): Promise<string> {
      return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                  if (typeof reader.result == 'string') {
                        resolve(reader.result);
                        return;
                  }
                  ErrorToast('unable to load the image provided');
            })
            reader.addEventListener('error', () => ErrorToast('unable to load the image provided'));
            reader.readAsDataURL(file);
      })
}
async function asDomUrl(url: string): Promise<string> {
      const res = await fetch(url)      
      const file = await res.blob()
      return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                  if (typeof reader.result == 'string') {
                        resolve(reader.result);
                        return;
                  }
                  reject(new Error('unable to load the image provided'));
            })
            reader.addEventListener('error', () => reject(new Error('unable to load the image provided')));
            reader.readAsDataURL(file);
      })
}
export class ImagePlugin implements EditorPlugin {

      onConfig(config: CrepeConfig): void {
            config.featureConfigs ??= {};
            config.featureConfigs[Crepe.Feature.ImageBlock] = {
                  onUpload: upload,
                  blockOnUpload: upload,
                  inlineOnUpload: upload,
                  proxyDomURL: asDomUrl,
                  onImageLoadError: () => { ErrorToast('unable to load the image provided') }
            };
      }
      onBeforeCreate(): void { }
      onCreate(): void { }
      onDestroy(): void { }
}