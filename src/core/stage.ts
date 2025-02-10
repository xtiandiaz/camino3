import * as THREE from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/Addons.js'
import * as PALETTE from '../assets/design-tokens/palette'
import MATTER from 'matter-js'

type PhysicsEngine = MATTER.Engine

interface IRenderer {
  render(scene: THREE.Scene, camera: THREE.Camera): void
}

abstract class Stage<Renderer extends IRenderer> {
  renderer: Renderer
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  physicsEngine?: PhysicsEngine
  
  onBeforeRender?: ((time: number) => void)
  
  private _lastTimestamp = 0
  
  constructor(renderer: Renderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene, physicsEngine?: PhysicsEngine) {
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
    this.physicsEngine = physicsEngine
    
    this.resizeIfNeeded()
  }
  
  abstract resizeIfNeeded(): void
  
  render(timestamp: number = 0): void {    
    this.resizeIfNeeded()
    this.onBeforeRender?.(timestamp * 0.001) // Convert to seconds 
    
    this.renderer.render(this.scene, this.camera)
    
    if (this.physicsEngine !== undefined) {
      const deltaTime = (timestamp - this._lastTimestamp) * 0.1
      MATTER.Engine.update(this.physicsEngine!, Math.min(deltaTime, 16.6))
    }
    
    requestAnimationFrame(t => this.render(t))
    
    this._lastTimestamp = timestamp
  }
}

class Stage3D extends Stage<THREE.WebGLRenderer> {
  constructor(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene, physicsEngine?: PhysicsEngine) {
    super(renderer, camera, scene, physicsEngine)
  }
  
  resizeIfNeeded(): void {
    const domElement = this.renderer.domElement
    const width = domElement.clientWidth
    const height = domElement.clientHeight
    const needsResizing = domElement.width !== width || domElement.height !== height
    
    if (needsResizing) {
      this.renderer.setSize(width, height, false)
      
      // if (this.camera instanceof THREE.PerspectiveCamera) {
        // const perspectiveCamera = this.camera as THREE.PerspectiveCamera
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
      // }
    }
  }
}

class Stage3DCSS extends Stage<CSS3DRenderer> {
  constructor(renderer: CSS3DRenderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
    super(renderer, camera, scene)
    
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.backgroundColor = `#${PALETTE.color(PALETTE.ColorKey.SecondaryBackground).toString(16)}`
    document.body.appendChild(renderer.domElement)
  }
  
  resizeIfNeeded(): void {
    this.renderer.setSize(document.body.clientWidth, document.body.clientHeight)
    const domElement = this.renderer.domElement
    this.camera.aspect = domElement.clientWidth / domElement.clientHeight
    this.camera.updateProjectionMatrix()
  }
}

interface IPerspectiveCameraSettings {
  fov: number
  near: number
  far: number
}

const defaultPerspectiveCameraSettings = { fov: 75, near: 0.1, far: 20 }

function createCamera(settings: IPerspectiveCameraSettings): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(
    settings.fov, 
    1, 
    settings.near, 
    settings.far
  )
  
  camera.position.z = 5
  
  return camera
}

function createScene(): THREE.Scene {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(PALETTE.color(PALETTE.ColorKey.SecondaryBackground))
  
  return scene
}

export function createStage3D(
  includePhysicsEngine: boolean = false,
  cameraSettings: IPerspectiveCameraSettings = defaultPerspectiveCameraSettings
): Stage3D {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    canvas: document.querySelector("#canvas") as HTMLCanvasElement 
  })
  const camera = createCamera(cameraSettings)
  const scene = createScene()
  
  let physicsEngine: PhysicsEngine | undefined = undefined
  if (includePhysicsEngine) {
    physicsEngine = MATTER.Engine.create({
      enableSleeping: true,
    })
  }
  
  // const guiRenderer = new CSS2DRenderer()
  // guiRenderer.domElement.style.position = 'absolute'
  // guiRenderer.domElement.style.top = '0'
  // document.querySelector("#app")!.appendChild(guiRenderer.domElement)
  
  return new Stage3D(renderer, camera, scene, physicsEngine)
}

export function createStage3DCSS(cameraSettings: IPerspectiveCameraSettings = defaultPerspectiveCameraSettings): Stage3DCSS {  
  const renderer = new CSS3DRenderer()
  const camera = createCamera(cameraSettings)
  const scene = createScene()
  
  return new Stage3DCSS(renderer, camera, scene)
}
