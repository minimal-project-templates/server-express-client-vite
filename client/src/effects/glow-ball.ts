
export function glowBallEffect() {
  const neonBallBottomleft = document.querySelector<HTMLImageElement>('.glow-ball-left')
  const neonBallBottomRight = document.querySelector<HTMLImageElement>('.glow-ball-right')

  let _lastWeather = 1

  // GLOW BALL
  setInterval(() => {
    let lastWeather = _lastWeather
    Array.from(document.querySelectorAll('.glow-ball')).forEach(el => {
      if (lastWeather > 0) {
        el.classList.remove('night')
        el.classList.add('day')
        _lastWeather = -1
      } else {
        el.classList.remove('day')
        el.classList.add('night')
        _lastWeather = 1
      }
    })
  }, 10_000)

  window.onscroll = event => {
    const min = 200
    const max = 600
    let percentage = 500 / window.scrollY / (100 / 20)
    // console.log(percentage)
    let height = percentage * max * 2

    if (percentage > 1) {
      percentage = 1
    }

    if (height > max) {
      height = max
    }

    if (height < min) {
      height = min
    }
    // const height = Math.min(max, Math.max(max, percentage * max))
    // tardisImg.style.height = height + 'px'
    // tardisImg.style.position = `fixed`
    // tardisImg.style.transform = `scale(${percentage})`
    // tardisImg.style.opacity = percentage.toString()
    // tardisImg.style.left = (percentage * 1000).toString() + 'px'

    const ballLeftCurrentTop = parseInt(neonBallBottomleft.style.top, 10) || 0
    const ballRightCurrentTop = parseInt(neonBallBottomRight.style.top, 10) || 0

    // console.log(ballRightCurrentTop)
    neonBallBottomleft.style.backgroundColor = 'rgba('
    neonBallBottomleft.style.top = 600 + window.scrollY * 1.3 + 'px'
    neonBallBottomleft.style.opacity = (percentage * 2).toString() || '1'
    // neonBallBottomleft.style.top = ballLeftCurrentTop + (window.scrollY / 3) + 'px'
    neonBallBottomleft.style.left = window.scrollY / 4 + 'px'
    neonBallBottomRight.style.right = (window.scrollY / 2) * percentage + 'px'
    neonBallBottomRight.style.top = 200 + window.scrollY * 1.4 + 'px'
    neonBallBottomRight.style.opacity = (percentage * 2).toString()

    // console.log(neonBallBottomRight.style.right)
    // tardisImg.style.top = (percentage * 1000).toString() + 'px'
  }
}
