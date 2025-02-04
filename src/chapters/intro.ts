import * as THREE from 'three'
import * as STAGE from '../core/stage'
import * as COLOR from '../assets/design-tokens/color'

const stage = STAGE.createWebGLStage()
stage.camera.position.z = 5

const light = new THREE.DirectionalLight(0xFFFFFF, 3)
light.position.set(-1, 2, 4)
stage.scene.add(light)

const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshPhongMaterial({color: COLOR.value(COLOR.ColorKey.Indigo)})
const cube = new THREE.Mesh(geometry, material)
stage.scene.add(cube)

stage.onBeforeRender = time => {
  cube.rotation.x = time
  cube.rotation.y = time
}

export default stage
