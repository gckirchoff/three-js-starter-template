import * as THREE from "three";

export default class Loop {
  constructor(app) {
    this.app = app;
    this.camera = this.app.camera;
    this.renderer = this.app.renderer;
    this.world = this.app.world;

    this.clock = new THREE.Clock();
    this.previousElapsedTime = 0;
    this.loop();
  }

  loop = () => {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousElapsedTime;
    this.previousElapsedTime = elapsedTime;

    this.world.loop(deltaTime, elapsedTime);
    this.camera.loop();
    this.renderer.loop();
    window.requestAnimationFrame(this.loop);
  };
}
