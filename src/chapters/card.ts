import * as THREE from 'three'
import * as STAGER from '../core/stager'
import Chapter from '../core/chapter'

async function createCard(frontURL: string, backURL: string): Promise<THREE.Mesh> {
  const frontTexture = await new THREE.TextureLoader().loadAsync(frontURL)
  const backTexture = await new THREE.TextureLoader().loadAsync(backURL)
  // const textures = [frontTexture, backTexture]
  // textures.forEach((t) => t.colorSpace = THREE.SRGBColorSpace)

  const vertexShaderResponse = await fetch('assets/shaders/card_vert.glsl')
  const vertexShader = await vertexShaderResponse.text()
  const fragmentShaderResponse = await fetch('assets/shaders/card_frag.glsl')
  const fragmentShader = await fragmentShaderResponse.text()
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      front_texture: { value: frontTexture },
      back_texture: { value: backTexture }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })
  material.blending = THREE.CustomBlending
  material.side = THREE.DoubleSide
  
  return new THREE.Mesh(new THREE.PlaneGeometry(2, 8/3), material)
}

const stage = STAGER.setUpStage()

const card = await createCard(
  'assets/textures/card/front.png', 
  'assets/textures/card/back.png'
)

stage.scene.add(card)

// INTERACTION

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let targetRotationY = 0

function onClick(event: MouseEvent) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  // console.log(pointer)
  
  raycaster.setFromCamera(pointer, stage.camera)
  const intersect = raycaster.intersectObject(card)
  // console.log(intersect)
  
  if (intersect.length > 0) {
    targetRotationY += Math.PI
  }
}

window.addEventListener('click', onClick)

// CONSOLIDATION

const infoText = document.querySelector('#info') as HTMLHeadingElement
infoText.textContent = "Tap to flip"

const chapter: Chapter = {
  stage: stage,
  onBeforeRender: (time) => {
    card.rotation.y += (targetRotationY - card.rotation.y) / 4
  }
}

export default chapter
