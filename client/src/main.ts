import { jarallax } from 'jarallax'
import './styles/style.scss'
import { startMouseGlow } from './util/mouse-glow.ts'
import { renderStars1, renderStars2 } from './util/falling-stars.ts'

document.addEventListener('DOMContentLoaded', () => {
  jarallax(document.querySelectorAll('.jarallax'), {})
  startMouseGlow()
  renderStars1()
  renderStars2()
  document.getElementById('app').style.display = 'block'
})

const tardisImg = document.querySelector<HTMLImageElement>('.tardis-img')
const neonBallBottomleft = document.querySelector<HTMLImageElement>('.glow-ball-left')
const neonBallBottomRight = document.querySelector<HTMLImageElement>('.glow-ball-right')

window.onscroll = (event) => {
  const min = 200
  const max = 600
  let percentage = (500 / window.scrollY) / (100 / 20)
  console.log(percentage)
  let height = (percentage * max) * 2

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
  tardisImg.style.height = height + 'px'
  tardisImg.style.position = `fixed`
  tardisImg.style.transform = `scale(${percentage})`
  tardisImg.style.opacity = percentage.toString()
  tardisImg.style.left = (percentage * 1000).toString() + 'px'

  const ballLeftCurrentTop = parseInt(neonBallBottomleft.style.top, 10) || 0
  const ballRightCurrentTop = parseInt(neonBallBottomRight.style.top, 10) || 0

  console.log(ballRightCurrentTop)
  neonBallBottomleft.style.top = 600 + (window.scrollY * 1.3) + 'px'
  neonBallBottomleft.style.opacity = (percentage * 2).toString()
  // neonBallBottomleft.style.top = ballLeftCurrentTop + (window.scrollY / 3) + 'px'
  neonBallBottomleft.style.left = (window.scrollY / 4) + 'px'
  neonBallBottomRight.style.right = (window.scrollY / 2 * percentage) + 'px'
  neonBallBottomRight.style.top = (window.scrollY * 1.4) + 'px'
  neonBallBottomRight.style.opacity =  (percentage * 2).toString()

  console.log(neonBallBottomRight.style.right)
  // tardisImg.style.top = (percentage * 1000).toString() + 'px'
 }