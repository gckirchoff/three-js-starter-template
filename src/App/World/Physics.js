import * as THREE from "three";
import { appStateStore } from "../utils/Store";

export default class Physics {
  constructor(app, world) {
    this.app = app;
    this.scene = this.app.scene;

    this.meshMap = new Map();

    import("@dimforge/rapier3d").then((RAPIER) => {
      const gravity = { x: 0, y: -9.81, z: 0 };
      this.world = new RAPIER.World(gravity);
      this.rapier = RAPIER;

      this.rapierLoaded = true;
      appStateStore.setState({ physicsReady: true });
    });
  }
  add = (mesh, type, collider) => {
    const rigidBodyType = this.#getRigidBodyType(type);
    const rigidBody = this.world.createRigidBody(rigidBodyType);

    const colliderType = this.#getColliderType(mesh, collider);
    this.world.createCollider(colliderType, rigidBody);

    // Setting rigid body position and rotation
    const worldPosition = mesh.getWorldPosition(new THREE.Vector3());
    const worldRotation = mesh.getWorldQuaternion(new THREE.Quaternion());
    rigidBody.setTranslation(worldPosition);
    rigidBody.setRotation(worldRotation);

    this.meshMap.set(mesh, rigidBody);
  };

  #getRigidBodyType = (type) => {
    if (type === "dynamic") {
      return this.rapier.RigidBodyDesc.dynamic();
    } else if (type === "fixed") {
      return this.rapier.RigidBodyDesc.fixed();
    } else {
      throw new Error(`Invalid rigitBodyType: ${type}`);
    }
  };

  #getColliderType = (mesh, collider) => {
    switch (collider) {
      case "cuboid":
        const dimensions = this.computeCuboidDimensions(mesh);
        return this.rapier.ColliderDesc.cuboid(
          dimensions.x / 2,
          dimensions.y / 2,
          dimensions.z / 2
        );
      case "ball":
        const radius = this.#computeBallDimensions(mesh);
        return this.rapier.ColliderDesc.ball(radius);
      case "trimesh":
        const { vertices, indices } = this.#computeTrimeshDimensions(mesh);
        return this.rapier.ColliderDesc.trimesh(vertices, indices);
      default:
        throw new Error(`Invalid collider: ${collider}`);
    }
  };

  computeCuboidDimensions = (mesh) => {
    mesh.geometry.computeBoundingBox();
    const size = mesh.geometry.boundingBox.getSize(new THREE.Vector3());
    const worldScale = mesh.getWorldScale(new THREE.Vector3());
    size.multiply(worldScale);
    return size;
  };

  #computeBallDimensions = (mesh) => {
    mesh.geometry.computeBoundingSphere();
    const radius = mesh.geometry.boundingSphere.radius;
    const worldScale = mesh.getWorldScale(new THREE.Vector3());
    const maxScale = Math.max(worldScale.x, worldScale.y, worldScale.z);
    return radius * maxScale;
  };

  #computeTrimeshDimensions = (mesh) => {
    const vertices = mesh.geometry.attributes.position.array;
    const indices = mesh.geometry.index.array;
    const worldScale = mesh.getWorldScale(new THREE.Vector3());

    // const scaledVertices = [];
    // for (let i = 0; i < vertices.length; i += 3) {
    //   scaledVertices.push(vertices[i] * worldScale.x);
    //   scaledVertices.push(vertices[i + 1] * worldScale.y);
    //   scaledVertices.push(vertices[i + 2] * worldScale.z);
    // }

    const scaledVertices = vertices.map(
      (vertex, index) => vertex * worldScale.getComponent(index % 3)
    );

    return {
      vertices: scaledVertices,
      indices,
    };
  };

  loop = () => {
    if (!this.rapierLoaded) {
      return;
    }

    this.world.step();

    this.meshMap.entries().forEach(([mesh, rigidBody]) => {
      // extracting the position and rotation from the rigid body
      const position = new THREE.Vector3().copy(rigidBody.translation());
      const rotation = new THREE.Quaternion().copy(rigidBody.rotation());

      // transforming the position to the parent mesh's local space
      position.applyMatrix4(
        new THREE.Matrix4().copy(mesh.parent.matrixWorld).invert()
      );

      // transforming the rotation to the parent mesh's local space
      const inverseParentMatrix = new THREE.Matrix4()
        .extractRotation(mesh.parent.matrixWorld)
        .invert();
      const inverseParentRotation =
        new THREE.Quaternion().setFromRotationMatrix(inverseParentMatrix);
      rotation.premultiply(inverseParentRotation);

      mesh.position.copy(position);
      mesh.quaternion.copy(rotation);
      // mesh.parent.worldToLocal(position);
      // this.cubeMesh.position.set(position.x, position.y, position.z);
    });
  };
}
