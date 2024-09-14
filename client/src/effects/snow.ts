let mouse = {
  x: 2,
  y: 0,
}

window.addEventListener('mousemove', event => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

export function renderSnowEffect(amount: number) {
  const canvas = document.getElementById('starCanvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  mouse.x = canvas.width / 2

  const stars: any[] = []
  const maxStars = Math.round(amount * 0.5)

  class Star {
    private x: number
    private y: number
    private radius: number
    private dy: number
    private dx: number
    private flicker: number
    private color: string

    constructor() {
      this.init()
    }

    init() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.radius = Math.random() * 2 + 1
      this.color = `rgba(0, 255, 255, ${Math.random()})`
      this.dy = Math.random() * 1 + 0.5
      this.dx = (Math.random() - 0.5) * 2
      this.flicker = Math.random() * 0.1 + 0.05
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.shadowBlur = Math.random() * 15
      ctx.shadowColor = 'purple'
      ctx.fill()
    }

    update() {
      this.y += this.dy
      this.x += this.dx

      if (this.y > canvas.height) {
        this.init()
        this.y = 0
      }

      if (this.x > canvas.width || this.x < 0) {
        this.init()
        this.y = Math.random() * canvas.height
      }

      this.radius += Math.sin(this.flicker) * 0.1
      this.flicker += 0.1

      this.draw()
    }
  }

  function init() {
    for (let i = 0; i < maxStars; i++) {
      stars.push(new Star())
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    stars.forEach(star => star.update())
    requestAnimationFrame(animate)
  }

  init()
  animate()

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}
