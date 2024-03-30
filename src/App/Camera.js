import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

import { sizeStore } from "./utils/Store";

export default class Camera {
  constructor(app) {
    this.app = app;
    this.canvas = this.app.canvas;

    this.sizeStore = sizeStore;
    this.sizes = this.sizeStore.getState();

    this.#setInstance();
    this.#setControls();
    this.#setResizeListener();
  }

  loop = () => {
    this.controls.update();
  };

  #setInstance = () => {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      200
    );
    this.instance.position.z = 100;
    this.instance.position.y = 20;
  };

  #setControls = () => {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  };

  #setResizeListener = () => {
    this.sizeStore.subscribe((sizes) => {
      this.instance.aspect = sizes.width / sizes.height;
      this.instance.updateProjectionMatrix();
    });
  };
}
