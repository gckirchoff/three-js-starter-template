import * as THREE from "three";

import Loop from "./utils/Loop";
import World from "./World/World";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Resize from "./utils/Resize";
import AssetLoader from "./utils/AssetLoader";
import Preloader from "./UI/Preloader";
import InputController from "./UI/InputController";

export default class App {
  constructor() {
    // threejs elements
    this.canvas = document.querySelector("canvas.threejs");
    this.scene = new THREE.Scene();

    // Asset Loader
    this.assetLoader = new AssetLoader();

    // UI
    this.preloader = new Preloader();
    this.inputController = new InputController();

    // World
    this.world = new World(this);

    // Camera and Renderer
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);

    // Utils
    this.loop = new Loop(this);
    this.resize = new Resize();
  }
}
