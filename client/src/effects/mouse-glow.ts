let el: HTMLElement

export function startMouseGlow() {

  if (!el) {
    el = document.createElement('div')
    el.id = 'neon-container'
    el.className= 'd-none d-md-block position-fixed'
    document.body.prepend(el)
  }

  const effect = new NeonBallEffect(2)
}

class NeonBallEffect {
  private container: HTMLElement
  private balls: HTMLDivElement[] = []
  private mouseX: number = 0
  private mouseY: number = 0

  constructor(ballCount: number = 5) {
    this.container = document.getElementById('neon-container') as HTMLElement
    this.createBalls(ballCount)
    this.addEventListeners()
    this.animate()
  }

  private createBalls(count: number): void {
    for (let i = 0; i < count; i++) {
      const ball = document.createElement('div')
      ball.className = 'neon-ball'
      ball.style.width = ball.style.height = `${10 + i * 2}px`
      ball.style.background = `rgba(128, 0, 255, ${1 - i * 0.15})`
      ball.style.boxShadow = `0 0 ${10 + i * 2}px ${4 + i}px rgba(128, 0, 255, ${0.8 - i * 0.1})`
      this.container.appendChild(ball)
      this.balls.push(ball)
    }
  }

  private addEventListeners(): void {
    document.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  private onMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX
    this.mouseY = e.clientY
  }

  private animate(): void {
    this.balls.forEach((ball, index) => {
      const nextBall = this.balls[index + 1] || { offsetLeft: this.mouseX, offsetTop: this.mouseY }
      const dx = nextBall.offsetLeft - ball.offsetLeft
      const dy = nextBall.offsetTop - ball.offsetTop

      ball.style.left = `${ball.offsetLeft + dx * 0.15}px`
      ball.style.top = `${ball.offsetTop + dy * 0.15}px`
    })

    requestAnimationFrame(this.animate.bind(this))
  }
}
