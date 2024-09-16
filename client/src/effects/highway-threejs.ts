import * as THREE from 'three'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { getRandomAmount, getRandomBool } from '../util/util'
import { mousePosition } from './effect'

const lightColors = ['#2a5c9d', 'purple', 'white']
const lightColor = lightColors[Math.floor(Math.random()*lightColors.length)];

addEventListener('wheel', function (event) {
  if (event.buttons & 1) {
    console.log
  }
})

function renderSkyBox(scene: THREE.Scene, loader: THREE.CubeTextureLoader) {
  loader.setPath('images/')

  const textureCube = loader.load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'])

  scene.background = textureCube
}

function renderRoad(scene: THREE.Scene, textureLoader: THREE.TextureLoader) {
  const roadTexture = textureLoader.load('images/road.jpg')
  roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping
  roadTexture.repeat.set(1, 10) // Repeat the texture for a continuous road
  const highwayGeometry = new THREE.PlaneGeometry(50, 1000) // Extended length for continuous driving
  const highwayMaterial = new THREE.MeshStandardMaterial({ map: roadTexture })
  const highway = new THREE.Mesh(highwayGeometry, highwayMaterial)
  highway.rotation.x = -Math.PI / 2
  highway.receiveShadow = true
  scene.add(highway)

  return highway
}

function renderCars(scene: THREE.Scene, textureLoader: THREE.TextureLoader, amount = 10) {
  // Create cars
  const colors = ['green', 'black', 'gray']

  const carGeometry = new THREE.BoxGeometry(2, 1, 4)

  const color = colors[Math.floor(Math.random()*colors.length)];
  const carMaterial = new THREE.MeshStandardMaterial({ color })
  const carMesh = new THREE.Mesh(carGeometry, carMaterial)
  const cars: THREE.Mesh[] = []

  while (amount--) {
    const x = getRandomBool() ? (getRandomBool() ? -20 : -15) : getRandomBool() ? 15 : 5
    const z = x > 0 ? getRandomAmount() : -getRandomAmount()
    const material = carMaterial.clone()
    // const color = x > 0 ? 'red' : 'green'
    const color = colors[Math.floor(Math.random()*colors.length)];
    material.color = new THREE.Color(color)
    const car = carMesh.clone()
    car.material = material

    car.position.set(x, 0.5, z)
    car.castShadow = true
    car.receiveShadow = true
    scene.add(car)
    cars.push(car)
  }

  return cars
}

async function renderStreetLights(scene: THREE.Scene, objLoader: OBJLoader, mtlLoader: MTLLoader) {
  // load meshes
  const materials = await mtlLoader.loadAsync('models/streetlight/streetlight.mtl')
  materials.preload()

  objLoader.setMaterials(materials)
  const streetLightObj = await objLoader.loadAsync('models/streetlight/streetlight.obj')
  const lights: THREE.PointLight[] = []

  function add(side: 'LEFT' | 'RIGHT', z: number) {
    // pole
    const x = side === 'LEFT' ? -25 : 25
    const object = streetLightObj.clone()
    object.position.set(x, 0, z)
    object.scale.set(3, 3, 3)
    object.rotation.y = side === 'RIGHT' ? Math.PI : 0
    lights.push(object as any)
    scene.add(object)

    // light
    const sphere = new THREE.SphereGeometry(0.4, 5, 8)
    const light = new THREE.PointLight(lightColor, 300, 700)
    const lightMesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: lightColor }))
    light.add(lightMesh)
    light.position.x = side === 'LEFT' ? x + 1.2 : x - 1.2
    light.position.y = 5.7
    light.position.z = z
    light.castShadow = true
    scene.add(light)
    lights.push(light)
  }

  for (let i = -100; i <= 100; i += 40) {
    add('LEFT', i)
    add('RIGHT', i)
  }

  return lights
}

export async function renderHightWayEffectWebGL() {
  const speed = 0.2

  // Set up loaders
  const OBJLoaderRef = new OBJLoader()
  const MTLLoaderRef = new MTLLoader()
  const fbxLoader = new FBXLoader()
  const textureLoader = new THREE.TextureLoader()
  const cubeTextureLoader = new THREE.CubeTextureLoader()

  // Set up a renderer
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.domElement.style.zIndex = '0 '
  renderer.domElement.style.top = '0'
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap // default THREE.PCFShadowMap

  document.body.prepend(renderer.domElement)

  // Create a scene
  const scene = new THREE.Scene()

  // Set up a camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 5, 15)
  camera.lookAt(0, 0, 0)
  // let light1, light2, light3, light4

  //   object.traverse(function (child) {
  //       if ((child as THREE.Mesh).isMesh) {
  //           // (child as THREE.Mesh).material = material
  //           if ((child as THREE.Mesh).material) {
  //               ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
  //           }
  //       }
  //   })
  //   object.scale.set(.01, .01, .01)

  // Load textures

  renderSkyBox(scene, cubeTextureLoader)
  const highway = renderRoad(scene, textureLoader)
  const lights = await renderStreetLights(scene, OBJLoaderRef, MTLLoaderRef)

  const cars = renderCars(scene, textureLoader, 15)

  // //Create a DirectionalLight and turn on shadows for the light
  const light = new THREE.DirectionalLight(0xaafaff, 1)
  light.position.set(20, 10, -100000) //default; light shining from top
  // light.castShadow = true // default false
  scene.add(light)

  // //Set up shadow properties for the light
  // light.shadow.mapSize.width = 512 // default
  // light.shadow.mapSize.height = 512 // default
  // light.shadow.camera.near = 0.5 // default
  // light.shadow.camera.far = 500 // default
  let flickerUntil: number
  let flickIndex: number
  let flickerState = false
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate)

    cars.forEach(car => {
      // Move cars
      if (car.position.x > 0) {
        car.position.z += 0.4
        if (car.position.z > 20) car.position.z = -150
      } else {
        car.position.z -= 0.2
        if (car.position.z < -150) car.position.z = 20
      }
    })

    highway.position.z += speed
    if (highway.position.z >= 500) {
      highway.position.z = -500 // Reset position for continuous effect
    }

    // Move each light and pole towards the camera
    lights.forEach((light, index) => {
      light.position.z += speed
      // console.log( light.position.z < (camera.position.z) - 100)
      light.castShadow = light.position.z < camera.position.z && light.position.z > camera.position.z - 100
      if (light.position.z > 50) {
        light.position.z = -160 // Reset to the start of the road
        // light.lookAt(0, 0,  light.position.z)
      }


      // if (light.isLight) {
      if (light.isLight && index === 11 || index === 5) {
        // if (!flickerUntil) {
        if (!flickerUntil || Date.now() > flickerUntil) {
          flickerState = !flickerState
          flickerUntil = Date.now() + getRandomAmount() * 10
        }

        if (!flickerState) {
          light.color = new THREE.Color('black')
        } else {
          light.color = new THREE.Color(lightColor)
        }
      }

    })
    const offset = (mousePosition.x - renderer.domElement.width / 2) / 50
    // let speed = 0.1
    let whereTo = 2
    var cameraTarget = new THREE.Vector3(offset / 4, 5, 15)

    camera.position.lerp(cameraTarget, 0.03)
    camera.lookAt(0, 0, -15)

    // camera.position.set(offset, 5, 15)

    renderer.render(scene, camera)
  }

  // Start animation
  animate()
}
