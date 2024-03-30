import * as THREE from "three";

import { sizeStore } from "./utils/Store";

export default class Renderer {
  constructor(app) {
    this.app = app;
    this.canvas = this.app.canvas;
    this.camera = this.app.camera;
    this.scene = this.app.scene;

    this.sizeStore = sizeStore;
    this.sizes = this.sizeStore.getState();

    this.#setInstance();
    this.#setResizeListener();
  }

  loop = () => {
    this.instance.render(this.scene, this.camera.instance);
  };

  #setInstance = () => {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  };

  #setResizeListener = () => {
    this.sizeStore.subscribe((sizes) => {
      this.instance.setSize(sizes.width, sizes.height);
      this.instance.setPixelRatio(sizes.pixelRatio);
    });
  };
}
