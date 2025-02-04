import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/Addons.js'
import * as STAGER from '../core/stage'

const stage = STAGER.createStageCSS({ fov: 75, near: 0.1, far: 5000 })
stage.camera.position.z = 750

const assetsResponse = await fetch('./assets/card_css/index.html')
const responseText = await assetsResponse.text()
const assetsDocument = new DOMParser().parseFromString(responseText, 'text/html')

const frontDiv = assetsDocument.getElementById('card1_frontFace') as HTMLDivElement
const frontImg = frontDiv.querySelector('img') as HTMLImageElement
// const frontImg = document.createElement('img')
frontImg.src = './assets/card_css/img/front.png'
const frontH1 = frontDiv.querySelector('h1') as HTMLHeadingElement
frontH1.textContent = '8'
const frontFace = new CSS3DObject(frontDiv)
frontFace.position.set(0, 0, 0.1)

const backDiv = assetsDocument.getElementById('card1_backFace') as HTMLImageElement
const backImg = backDiv.querySelector('img') as HTMLImageElement
// const backImg = document.createElement('img')
backImg.src = './assets/card_css/img/back.png'
const backFace = new CSS3DObject(backDiv)
backFace.rotation.y = Math.PI
// backFace.position.set(0, 0, -0.1)

// const valueHeading = document.createElement('h1')
// valueHeading.textContent = '7'
// const valueObject = new CSS3DObject(valueHeading)
// valueObject.position.set(-125, 175 - 64, 0.1)

const cardObject = new THREE.Object3D()
// cardObject.position.set(0, 0, 0.1)
cardObject.add(frontFace, backFace)

stage.scene.add(cardObject)

stage.onBeforeRender = time => {
  cardObject.rotation.y = time
}

export default stage
