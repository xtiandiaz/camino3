import * as THREE from 'three'
import * as STAGER from '../utils/stager'
import Chapter from '../utils/chapter'

const stage = STAGER.setUpStage()

const color = 0xFFFFFF
const intensity = 3
const light = new THREE.DirectionalLight(color, intensity)
light.position.set(-1, 2, 4)
stage.scene.add(light)

const boxWidth = 1
const boxHeight = 1
const boxDepth = 1
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

const material = new THREE.MeshPhongMaterial({color: 0x44aa88})

const cube = new THREE.Mesh(geometry, material)

stage.scene.add(cube)

const chapter: Chapter = {
  stage: stage,
  onRender: (time: number) => {
    cube.rotation.x = time
    cube.rotation.y = time  
  }
}

export default chapter
