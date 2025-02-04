import * as THREE from 'three'
import { CSS2DRenderer, CSS3DRenderer } from 'three/examples/jsm/Addons.js'
import * as COLOR from '../assets/design-tokens/color'

interface IRenderer {
  render(scene: THREE.Scene, camera: THREE.Camera): void
}

abstract class Stage<Renderer extends IRenderer> {
  renderer: Renderer
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  
  onBeforeRender?: ((time: number) => void)
  
  constructor(renderer: Renderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
  }
  
  abstract resizeIfNeeded(): void
  
  render(time: number = 0): void {
    time *= 0.001  // convert time to seconds
    
    this.resizeIfNeeded()
    this.onBeforeRender?.(time)
    
    this.renderer.render(this.scene, this.camera)
    
    requestAnimationFrame(t => this.render(t))
  }
}

class WebGLStage extends Stage<THREE.WebGLRenderer> {
  constructor(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
    super(renderer, camera, scene)
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

class CSSStage extends Stage<CSS3DRenderer> {
  constructor(renderer: CSS3DRenderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
    super(renderer, camera, scene)
    
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.backgroundColor = `#${COLOR.valueString(COLOR.ColorKey.SecondaryBackground)}`
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
  return new THREE.PerspectiveCamera(
    settings.fov, 
    1, 
    settings.near, 
    settings.far
  )
}

function createScene(): THREE.Scene {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(COLOR.value(COLOR.ColorKey.SecondaryBackground))
  
  return scene
}

export function createWebGLStage(cameraSettings: IPerspectiveCameraSettings = defaultPerspectiveCameraSettings): WebGLStage {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    canvas: document.querySelector("#canvas") as HTMLCanvasElement 
  })
  const camera = createCamera(cameraSettings)
  const scene = createScene()
  
  // const guiRenderer = new CSS2DRenderer()
  // guiRenderer.domElement.style.position = 'absolute'
  // guiRenderer.domElement.style.top = '0'
  // document.querySelector("#app")!.appendChild(guiRenderer.domElement)
  
  return new WebGLStage(renderer, camera, scene)
}

export function createStageCSS(cameraSettings: IPerspectiveCameraSettings = defaultPerspectiveCameraSettings): CSSStage {  
  const renderer = new CSS3DRenderer()
  const camera = createCamera(cameraSettings)
  const scene = createScene()
  
  return new CSSStage(renderer, camera, scene)
}
