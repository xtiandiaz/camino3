import * as THREE from 'three'
import * as COLOR from '../style/design-tokens/color'
import Chapter from './chapter'
import Stage from './stage'

export function setUpStage(): Stage {
  const canvas = document.querySelector("#c") as HTMLCanvasElement
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  
  const fov = 75
  const aspect = 2  // the canvas default
  const near = 0.1
  const far = 20
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 5

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(COLOR.DarkSchemeColor.background)
  
  renderer.render(scene, camera)
  
  return { canvas, renderer, camera, scene }
}

function resizeStage(stage: Stage) {
  function resizeRendererToDisplaySize() {
    const width = stage.canvas.clientWidth
    const height = stage.canvas.clientHeight
    const needResize = stage.canvas.width !== width || stage.canvas.height !== height
    if (needResize) {
      stage.renderer.setSize(width, height, false)
    }
    return needResize
  }
  
  if (resizeRendererToDisplaySize()) {
    stage.camera.aspect = stage.canvas.clientWidth / stage.canvas.clientHeight
    stage.camera.updateProjectionMatrix()
  }
}

export function run(chapter: Chapter) {    
  function render(time: number) {
    time *= 0.001  // convert time to seconds
    
    const stage = chapter.stage
    resizeStage(stage)
    chapter.onBeforeRender(time)
    
    stage.renderer.render(stage.scene, stage.camera)
    
    requestAnimationFrame(render)
  }
   
  requestAnimationFrame(render)
}
