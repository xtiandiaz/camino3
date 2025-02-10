import * as THREE from 'three'
import { FontLoader, Font, TextGeometry } from 'three/examples/jsm/Addons.js'
import * as STAGER from '../core/stage'
import * as PALETTE from '../assets/design-tokens/palette'

interface CardTextures {
  front: THREE.Texture
  back: THREE.Texture
}

class Card {
  static size = new THREE.Vector2(2, 8/3)
  object: THREE.Group
  
  private static _vertexShader: string
  private static _fragmentShader: string
  private static _font: Font
  // private _mesh: THREE.Mesh
  private _valueLabelMesh: THREE.Mesh
  
  constructor(textures: CardTextures, value: number) {
    const material = Card._createMaterial(textures)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(Card.size.x, Card.size.y), material)
    this._valueLabelMesh = Card._createValueLabelMesh(value)
    
    this.object = new THREE.Group()
    this.object.add(mesh)
    this.object.add(this._valueLabelMesh)
  }
  
  static async loadShaders(): Promise<void> {
    const vertexShaderResponse = await fetch('assets/shaders/card_vert.glsl')
    Card._vertexShader = await vertexShaderResponse.text()
    const fragmentShaderResponse = await fetch('assets/shaders/card_frag.glsl')
    Card._fragmentShader = await fragmentShaderResponse.text()
  }
  
  static async loadFont(): Promise<void> {
    const loader = new FontLoader()
    Card._font = await loader.loadAsync('assets/fonts/Inter_Bold.json')
  }
  
  static async loadTextures(frontURL: string, backURL: string): Promise<CardTextures> {
    const textures = await Promise.all([
      new THREE.TextureLoader().loadAsync(frontURL),
      new THREE.TextureLoader().loadAsync(backURL)
    ])
    return { front: textures[0], back: textures[1] }
    // const textures = [frontTexture, backTexture]
    // textures.forEach((t) => t.colorSpace = THREE.SRGBColorSpace
  }
  
  private static _createMaterial(textures: CardTextures): THREE.Material {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        front_texture: { value: textures.front },
        back_texture: { value: textures.back }
      },
      vertexShader: Card._vertexShader,
      fragmentShader: Card._fragmentShader
    })
    
    material.blending = THREE.CustomBlending
    material.side = THREE.DoubleSide
    
    return material
  }
  
  private static _createValueLabelMesh(value: number): THREE.Mesh {
    const geometry = new TextGeometry(
      value.toString(), 
      { font: Card._font, size: 0.3, depth: 0, curveSegments: 1 } 
  )
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: PALETTE.color(PALETTE.ColorKey.Mint)}))
  mesh.position.set(-Card.size.x * 0.5 + 0.2, Card.size.y * 0.5 - 0.5, 0.1)
  
  return mesh
  }
}

const stage = STAGER.createStage3D()
stage.camera.position.z = 5
stage.camera.layers.enableAll()

async function createCard(frontTextureURL: string, backTextureURL: string): Promise<Card> {
  const textures = await Card.loadTextures(frontTextureURL, backTextureURL)
  
  return new Card(textures, 7)
}

await Card.loadShaders()
await Card.loadFont()

const card = await createCard(
  'assets/card/front.png', 
  'assets/card/back.png'
)

stage.scene.add(card.object)

// INTERACTION

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let targetRotationY = 0

function onClick(event: MouseEvent) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  // console.log(pointer)
  
  raycaster.setFromCamera(pointer, stage.camera)
  const intersect = raycaster.intersectObject(card.object)
  // console.log(intersect)
  
  if (intersect.length > 0) {
    targetRotationY += Math.PI
  }
}

window.addEventListener('click', onClick)

const infoText = document.querySelector('#info') as HTMLHeadingElement
infoText.textContent = "Tap to flip"

stage.onBeforeRender = _ => {
  card.object.rotation.y += (targetRotationY - card.object.rotation.y) / 4
}

export default stage
