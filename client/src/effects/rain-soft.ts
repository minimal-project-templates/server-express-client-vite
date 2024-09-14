let mouse = {
  x: 2,
  y: 0,
}

window.addEventListener('mousemove', event => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

export function renderRainSoftEffect(amount: number) {
  const canvas = document.getElementById('rainCanvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const raindropsAmount = amount

  class Raindrop {
    private x: number
    private y: number
    private length: number
    private speed: number
    private angle: number
    private opacity: number
    private thickness: number
    private tick = 0

    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.length = Math.random() * 20 + 10
      this.speed = Math.random() * 5 + 2
      this.thickness = Math.random() * 2 + 1
      this.opacity = Math.random() * 0.2 + 0.2
    }

    update() {
      this.y += this.speed
      if (this.y > canvas.height) {
        this.y = 0 - this.length
      }

      if (mouse.x < canvas.width / 2) {
        this.x -= this.speed
      } else {
        this.x += this.speed
      }

      if (this.x > canvas.width) {
        this.x = this.length
      }
      if (this.x <= 0) {
        this.x = this.length + canvas.width / 2
      }

      // Follow mouse with slight delay
      let dx = mouse.x - this.x
      let dy = mouse.y - this.y
      // this.x += dx * 0.001;
      // this.y += dy * 0.005;
    }

    draw() {
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x, this.y + this.length)
      ctx.strokeStyle = `rgba(68, 142, 247, ${this.opacity})`
      ctx.lineWidth = this.thickness
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }

  const raindrops: Raindrop[] = []
  for (let i = 0; i < raindropsAmount; i++) {
    raindrops.push(new Raindrop())
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let raindrop of raindrops) {
      raindrop.update()
      raindrop.draw()
    }

    requestAnimationFrame(animate)
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })

  animate()
}
