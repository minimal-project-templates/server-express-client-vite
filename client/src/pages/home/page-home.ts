import { jarallax } from 'jarallax'
import { startMouseGlow } from '../../effects/mouse-glow.ts'
import { glowBallEffect } from '../../effects/glow-ball.ts'
import { renderRainSoftEffect } from '../../effects/rain-soft.ts'
import { renderRainHeavyEffect } from '../../effects/rain-heavy.ts'
import { renderSnowEffect } from '../../effects/snow.ts'
import { renderHightWayEffect } from '../../effects/highway.ts'
import './page-home.scss'

document.addEventListener('DOMContentLoaded', () => {
  jarallax(document.querySelectorAll('.jarallax'), {})
  renderEffects()
  document.getElementById('app').style.display = 'block'
})

function renderEffects() {
  const getRandomBool = () => Math.random() < 0.5
  const getRandomAmount = () => Math.round(Math.random() * 100)

  renderHightWayEffect()
  glowBallEffect()

  const effects = [
    renderSnowEffect,
    renderRainSoftEffect,
    renderRainHeavyEffect
  ]

  effects.forEach(effect => {
    if (getRandomBool()) {
      effect(getRandomAmount())
    }
  })

  startMouseGlow()
}