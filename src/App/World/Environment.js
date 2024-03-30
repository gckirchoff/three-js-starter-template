import * as THREE from "three";

export default class Environment {
  constructor(app, world) {
    this.app = app;
    this.scene = this.app.scene;
    this.physics = world.physics;

    this.#loadEnvironment();
    this.#addGround();
    this.addMeshes();
  }

  #loadEnvironment = () => {
    // lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set(1, 1, 1);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
  };

  #addGround = () => {
    const groundGeometry = new THREE.BoxGeometry(100, 1, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: "turquoise",
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    this.scene.add(groundMesh);
    this.physics.add(groundMesh, "fixed", "cuboid");
  };

  addMeshes = () => {
    // const group = new THREE.Group();
    // group.rotation.x = 0.3;
    // this.scene.add(group);
    // group.position.y = 20;
    // const geometry = new THREE.TorusKnotGeometry(0.5, 0.1, 30, 8);
    // const material = new THREE.MeshStandardMaterial({ color: "blue" });
    // this.cubeMesh = new THREE.Mesh(geometry, material);
    // const cubeMesh2 = new THREE.Mesh(geometry, material);
    // cubeMesh2.position.set(3, 20, 0)
    // cubeMesh2.scale.set(5, 5, 5);
    // this.scene.add(cubeMesh2)
    // this.cubeMesh.position.y = 10;
    // this.cubeMesh.rotation.x = 0.5;
    // this.cubeMesh.rotation.z = 0.5;
    // this.cubeMesh.scale.set(5, 5, 5);
    // this.scene.add(this.cubeMesh);
    // this.physics.add(this.cubeMesh, "dynamic", "trimesh");
    // this.physics.add(cubeMesh2, "dynamic", "trimesh");

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: "blue",
    });

    for (let i = 0; i < 100; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() + 5) * 10,
        (Math.random() - 0.5) * 10
      );
      mesh.scale.set(
        Math.random() + 0.5,
        Math.random() + 0.5,
        Math.random() + 0.5
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      this.scene.add(mesh);
      this.physics.add(mesh, "dynamic", "cuboid");
    }
  };
}
