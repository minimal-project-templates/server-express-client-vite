
// import * as THREE from 'three';

export function renderHightWayEffect() {
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

// class Highway {
//     private scene: THREE.Scene;
//     private camera: THREE.PerspectiveCamera;
//     private renderer: THREE.WebGLRenderer;
//     private road: THREE.Mesh;
//     private lights: THREE.PointLight[] = [];

//     constructor() {
//         this.scene = new THREE.Scene();
//         this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         this.renderer = new THREE.WebGLRenderer();
//         this.renderer.setSize(window.innerWidth, window.innerHeight);
//         document.body.appendChild(this.renderer.domElement);

//         this.createRoad();
//         this.createLights();
//         this.setupCamera();

//         this.animate();
//     }

//     private createRoad() {
//         const roadGeometry = new THREE.PlaneGeometry(10, 100);
//         const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
//         this.road = new THREE.Mesh(roadGeometry, roadMaterial);
//         this.road.rotation.x = -Math.PI / 2;
//         this.scene.add(this.road);
//     }

//     private createLights() {
//         for (let i = -45; i <= 45; i += 10) {
//             const leftLight = new THREE.PointLight(0xffff00, 1, 10);
//             leftLight.position.set(-3, 2, i);
//             this.scene.add(leftLight);
//             this.lights.push(leftLight);

//             const rightLight = new THREE.PointLight(0xffff00, 1, 10);
//             rightLight.position.set(3, 2, i);
//             this.scene.add(rightLight);
//             this.lights.push(rightLight);
//         }
//     }

//     private setupCamera() {
//         this.camera.position.z = 15;
//         this.camera.position.y = 5;
//         this.camera.lookAt(this.road.position);
//     }

//     private animate() {
//         requestAnimationFrame(() => this.animate());

//         // Animate lights (optional)
//         this.lights.forEach((light) => {
//             light.intensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
//         });

//         this.renderer.render(this.scene, this.camera);
//     }
// }

// // Create and initialize the highway
// const highway = new Highway();