import * as THREE from "three";

import { appStateStore } from "../utils/Store";
import Physics from "./Physics";
import Environment from "./Environment";

export default class World {
  constructor(app) {
    this.app = app;
    this.scene = this.app.scene;

    // create world classes
    this.physics = new Physics(this.app, this);

    appStateStore.subscribe((state) => {
      if (state.physicsReady) {
        this.environment = new Environment(this.app, this);
      }
    });

    this.loop();
  }

  loop = (deltaTime, elapsedTime) => {
    this.physics.loop();
  };

  #setCube = () => {
    this.cubeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    this.scene.add(this.cubeMesh);
  };
}
