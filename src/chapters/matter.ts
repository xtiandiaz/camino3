import * as STAGE from '../core/stage'
import * as THREE from 'three'
import * as PALETTE from '../assets/design-tokens/palette'
import MATTER from 'matter-js'

const stage = STAGE.createStage3D(true)
stage.camera.position.z = 10

const world = stage.physicsEngine!.world

const rigidBody = MATTER.Bodies.rectangle(0, -10, 1, 1, {
  mass: 5,
  friction: 0.1
})
MATTER.World.add(world, rigidBody)
const ground = MATTER.Bodies.rectangle(0, 5, 200, 10, { isStatic: true })
MATTER.World.add(world, ground)

const bodyGeometry = new THREE.CircleGeometry(0.5)
const body = new THREE.Mesh(
  bodyGeometry, 
  new THREE.MeshBasicMaterial({ color: PALETTE.color(PALETTE.ColorKey.Purple) })
)
stage.scene.add(body)

window.addEventListener('keyup', e => {
  console.log(e.code)
  if (e.code === 'Space') {
    MATTER.Body.applyForce(rigidBody, { x: 0, y: 0 }, { x: 0, y: -1 })
  }
})

stage.onBeforeRender = _ => {
  const newPos = rigidBody.position
  body.position.set(newPos.x, -newPos.y, body.position.z)
}

export default stage
