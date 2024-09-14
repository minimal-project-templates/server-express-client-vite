
export function renderRainHeavyEffect(amount: number) {
  const maxRainDrops = Math.round(amount * 0.4)
  const canvas = document.getElementById('shootingStarsCanvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  class RainDrop {
    private x: number
    private y: number
    private length: number
    private speed: number
    private angle: number
    private opacity: number
    private fade: number

    constructor() {
      this.reset()
    }

    reset() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height * 0.5
      this.length = Math.random() * 80 + 10
      this.speed = Math.random() * 5 + 2
      this.angle = Math.random() * 60 + 20
      this.opacity = Math.random() * 0.8 + 0.2
      this.fade = 0.005
    }

    draw() {
      ctx.beginPath()
      ctx.moveTo(this.x + -(canvas.width / 200), this.y)
      ctx.lineTo(
        this.x + -(canvas.width / 200) - this.length * Math.cos((this.angle * Math.PI) / 180),
        this.y + this.length * Math.sin((this.angle * Math.PI) / 180)
      )
      ctx.strokeStyle = `rgba(8, 0, 255, ${this.opacity})`
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.closePath()
    }

    update() {
      this.x -= this.speed * Math.cos((this.angle * Math.PI) / 180)
      this.y += this.speed * Math.sin((this.angle * Math.PI) / 180)
      this.opacity -= this.fade

      if (this.opacity <= 0) {
        this.reset()
      }
    }
  }

  const stars: RainDrop[] = []
  for (let i = 0; i < maxRainDrops; i++) {
    stars.push(new RainDrop())
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    stars.forEach(star => {
      star.draw()
      star.update()
    })
    requestAnimationFrame(animate)
  }

  animate()

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}