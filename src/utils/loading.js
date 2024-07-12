import { Loading } from "element-ui";

export class FullscreenLoading {
  constructor() {
    this.fullscreenLoading = null;
  }
  show(text) {
    this.fullscreenLoading = Loading.service({ fullscreen: true, text });
  }
  hide() {
    this.fullscreenLoading.close();
  }
}

export const fullLoading = new FullscreenLoading();
