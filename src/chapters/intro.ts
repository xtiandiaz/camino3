import * as THREE from 'three'
import * as STAGER from '../core/stager'
import * as COLOR from '../style/design-tokens/color'
import Chapter from '../core/chapter'

const stage = STAGER.setUpStage()

const color = 0xFFFFFF
const intensity = 3
const light = new THREE.DirectionalLight(color, intensity)
light.position.set(-1, 2, 4)
stage.scene.add(light)

const boxWidth = 2
const boxHeight = 2
const boxDepth = 2
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

const material = new THREE.MeshPhongMaterial({color: COLOR.value(COLOR.ColorKey.Indigo)})

const cube = new THREE.Mesh(geometry, material)

stage.scene.add(cube)

const chapter: Chapter = {
  stage: stage,
  onBeforeRender: (time: number) => {
    cube.rotation.x = time
    cube.rotation.y = time  
  }
}

export default chapter
