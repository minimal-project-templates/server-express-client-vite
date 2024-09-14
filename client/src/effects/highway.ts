// Import Three.js
import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { mousePosition } from './effect'

export function renderHightWayEffect2() {
  const canvas = document.getElementById('highwayCanvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  function drawSky() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5)
    gradient.addColorStop(0, '#000033')
    gradient.addColorStop(1, '#001f3f')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5)
  }

  function drawStars() {
    ctx.fillStyle = 'white'
    const stars = 1
    for (let i = 0; i < stars; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height * 0.5
      ctx.beginPath()
      ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function drawRoad(time: number) {
    const lanes = 3
    const laneWidth = canvas.width / lanes
    const vanishingPoint = { x: canvas.width / 2, y: canvas.height * 0.6 }

    // Draw road
    ctx.fillStyle = '#1c1c1c'
    ctx.beginPath()
    ctx.moveTo(0, canvas.height)
    ctx.lineTo(canvas.width, canvas.height)
    ctx.lineTo(vanishingPoint.x, vanishingPoint.y)
    ctx.fill()

    // Draw lane markings
    ctx.strokeStyle = 'purple'
    ctx.lineWidth = 2
    for (let i = 0; i <= lanes; i++) {
      const x = i * laneWidth
      ctx.setLineDash([20, 30])
      ctx.lineDashOffset = time / 40 // Reversed direction
      ctx.beginPath()
      ctx.moveTo(x, canvas.height)
      ctx.lineTo(
        vanishingPoint.x,
        // vanishingPoint.x + (x - vanishingPoint.x) * 0.1,
        vanishingPoint.y
      )
      ctx.stroke()
    }

    ctx.setLineDash([])
  }

  function drawLights(time: number) {
    const lightSpacing = 200
    const lightCount = Math.ceil(canvas.width / lightSpacing) + 1

    for (let i = 0; i < lightCount; i++) {
      const x = ((i * lightSpacing + time / 20) % (canvas.width + lightSpacing)) - lightSpacing / 2
      const y = canvas.height * 0.5
      const scale = Math.max(0, 1 - (canvas.width - x) / canvas.width)

      // Only draw if scale is positive
      if (scale > 0) {
        // Light pole
        ctx.strokeStyle = '#333'
        ctx.lineWidth = 2 * scale
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x, y - 50 * scale)
        ctx.stroke()

        // Light
        ctx.fillStyle = 'rgba(255, 255, 200, 0.8)'
        ctx.beginPath()
        ctx.arc(x, y - 50 * scale, 5 * scale, 0, Math.PI * 2)
        ctx.fill()

        // Light glow
        const gradient = ctx.createRadialGradient(x, y - 50 * scale, 0, x, y - 50 * scale, 30 * scale)
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.4)')
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y - 50 * scale, 30 * scale, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  function animate(time: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // drawSky()
    // drawStars()
    drawRoad(time)
    drawLights(time)

    requestAnimationFrame(animate)
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })

  animate(0)
}
// Import Three.js

export function renderHightWayEffect() {
  // Create a scene
  const scene = new THREE.Scene()

  // Set up a camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 5, 15)
  camera.lookAt(0, 0, 0)
  mousePosition
  // Set up a renderer
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.domElement.style.zIndex = '0 '
  renderer.domElement.style.top = '0'

  document.body.prepend(renderer.domElement)

  // Load textures
  const textureLoader = new THREE.TextureLoader()
  const roadTexture = textureLoader.load('images/road.jpg')
  roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping
  roadTexture.repeat.set(1, 10) // Repeat the texture for a continuous road

  const loader = new THREE.CubeTextureLoader()
  // loader.setPath('textures/cube/Bridge2/')

  const textureCube = loader.load(['images/posx.jpg', 'images/negx.jpg', 'images/posy.jpg', 'images/negy.jpg', 'images/posz.jpg', 'images/negz.jpg'])

  scene.background = textureCube

  const skyTexture = textureLoader.load('images/sky.jpg')

  // Create the highway (a large plane) with the road texture
  // Create the highway (a large plane) with the road texture
  const highwayGeometry = new THREE.PlaneGeometry(50, 1000) // Extended length for continuous driving
  const highwayMaterial = new THREE.MeshStandardMaterial({ map: roadTexture })
  const highway = new THREE.Mesh(highwayGeometry, highwayMaterial)
  highway.rotation.x = -Math.PI / 2
  scene.add(highway)

  // Create cars
  const carGeometry = new THREE.BoxGeometry(2, 1, 4)
  const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })

  const car1 = new THREE.Mesh(carGeometry, carMaterial)
  car1.position.set(-10, 0.5, -20)
  scene.add(car1)

  const car2 = new THREE.Mesh(carGeometry, carMaterial)
  car2.position.set(10, 0.5, 20)
  scene.add(car2)

  // Create streetlights with glow
  const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
  const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffaa, emissive: 0xffff00 } as any)

  const lights: any[] = []

  for (let i = -500; i <= 500; i += 20) {
    // Add light source
    const light = new THREE.PointLight(0xffffaa, 1, 50)
    light.position.set(-25, 5, i)
    scene.add(light)

    // Add a small sphere to simulate the light glow
    const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), glowMaterial)
    glowSphere.position.copy(light.position)
    scene.add(glowSphere)

    // Light pole
    const lightPole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 10), lightMaterial)
    lightPole.position.set(-25, 5, i)
    scene.add(lightPole)

    // Mirror the same on the other side of the road
    const light2 = new THREE.PointLight(0xffffaa, 1, 50)
    light2.position.set(25, 5, i)
    scene.add(light2)

    const glowSphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), glowMaterial)
    glowSphere2.position.copy(light2.position)
    scene.add(glowSphere2)

    const lightPole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 10), lightMaterial)
    lightPole2.position.set(25, 5, i)
    scene.add(lightPole2)

    const params = {
      threshold: 0,
      strength: 1,
      radius: 0,
      exposure: 1,
    }

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    bloomPass.threshold = params.threshold
    bloomPass.strength = params.strength
    bloomPass.radius = params.radius

    // Store the lights and poles for animation
    lights.push(light, glowSphere, lightPole, light2, glowSphere2, lightPole2)
  }

  // Create a skybox
  // Create a skybox
  const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32)
  const skyboxMaterial = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide,
  })
  const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial)
  // scene.add(skybox)

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // Animation loop
  function animate() {
    requestAnimationFrame(animate)

    // Move cars
    car1.position.z += 0.1
    if (car1.position.z > 100) car1.position.z = -100

    car2.position.z -= 0.1
    if (car2.position.z < -100) car2.position.z = 100

    highway.position.z += 0.2
    if (highway.position.z >= 500) {
      highway.position.z = -500 // Reset position for continuous effect
    }

    // Move each light and pole towards the camera
    lights.forEach(light => {
      light.position.z += 0.2
      if (light.position.z > 10) {
        light.position.z -= 1000 // Reset to the start of the road
      }
    })

    renderer.render(scene, camera)

    // Animate road texture to create a moving effect
    // roadTexture.offset.y += 0.02
    // console.log(mousePosition.x)
    const offset = (mousePosition.x - renderer.domElement.width / 2) / 50
    console.log(offset)
    camera.position.set(offset, 5, 15)
  }

  // Start animation
  animate()
}
