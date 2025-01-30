import * as THREE from 'three'
import * as STAGER from '../core/stager'
import Chapter from '../core/chapter'

async function createCard(frontURL: string, backURL: string): Promise<THREE.Mesh> {
  function createFaceGeometry(): THREE.PlaneGeometry {
    return new THREE.PlaneGeometry(2, 8/3)
  }
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
  
  return new THREE.Mesh(createFaceGeometry(), material)
}

const stage = STAGER.setUpStage()

const card = await createCard(
  'assets/textures/card/front.png', 
  'assets/textures/card/back.png'
)

stage.scene.add(card)

const chapter: Chapter = {
  stage: stage,
  onBeforeRender: (time) => {
    card.rotation.y = time
  }
}

export default chapter
