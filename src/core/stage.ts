import * as THREE from 'three'

export default interface Stage {
  canvas: HTMLCanvasElement
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
}
