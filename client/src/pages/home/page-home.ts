import { jarallax } from 'jarallax'
// import $ from 'jquery'
import { glowBallEffect } from '../../effects/glow-ball.ts'
import { renderHightWayEffectCanvas } from '../../effects/highway-canvas.ts'
import { startMouseGlow } from '../../effects/mouse-glow.ts'
import { renderRainHeavyEffect } from '../../effects/rain-heavy.ts'
import { renderRainSoftEffect } from '../../effects/rain-soft.ts'
import { renderSnowEffect } from '../../effects/snow.ts'
import { getRandomAmount, getRandomBool } from '../../util/util.ts'
import './page-home.scss'
import { renderHightWayEffectWebGL } from '../../effects/highway-threejs.ts'

window.addEventListener('click', () => {
  var myVideo = document.getElementById('video') as HTMLVideoElement;
  if (typeof myVideo.loop == 'boolean') { // loop supported
    myVideo.loop = true;
  } else { // loop property not supported
    myVideo.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    }, false);
  }
  //...
  myVideo.play();
}, {once: true})


export interface IProject {
  name: string
  img: string
  description: string
  href: string
}

export class PageHome {

  private projects: IProject[] = [
    {
      name: 'Natix',
      description: 'Speed limits, turn restrictions, traffic lights, stop signs and exit signs detected by Hivemapper Map AI.',
      img: 'images/natix.png',
      href: 'https://www.natix.network/'
    },
    {
      name: 'Dimo',
      description: 'With blockchain technology, DIMO guarantees openness, fairness, and performance in ways that are impossible for traditional platforms.',
      img: 'images/dimo.png',
      href: 'https://dimo.org/'
    },
    {
      name: 'Hivermapper',
      description: 'NATIX Network technology employs multiple decentralized data validation techniques to confirm the accuracy and authenticity of the data, ensuring its reliability and trustworthiness.',
      img: 'images/hivemapper.png',
      href: 'https://hivemapper.com/'
    },
    {
      name: 'Natix',
      description: 'Speed limits, turn restrictions, traffic lights, stop signs and exit signs detected by Hivemapper Map AI.',
      img: 'images/natix.png',
      href: 'https://www.natix.network/'
    },
    {
      name: 'Dimo',
      description: 'With blockchain technology, DIMO guarantees openness, fairness, and performance in ways that are impossible for traditional platforms.',
      img: 'images/dimo.png',
      href: 'https://dimo.org/'
    },
    {
      name: 'Hivermapper',
      description: 'NATIX Network technology employs multiple decentralized data validation techniques to confirm the accuracy and authenticity of the data, ensuring its reliability and trustworthiness.',
      img: 'images/hivemapper.png',
      href: 'https://hivemapper.com/'
    },
  ]

  init() {
    jarallax(document.querySelectorAll('.jarallax'), {})
  }

  onDOMLoaded() {
    const effects = [renderSnowEffect, renderRainSoftEffect, renderRainHeavyEffect]

    // renderHightWayEffectCanvas()
    renderHightWayEffectWebGL()
    // glowBallEffect()

    effects.forEach(effect => {
      if (getRandomBool()) {
        // effect(getRandomAmount())
      }
    })

    startMouseGlow()
    document.getElementById('app').style.visibility = 'visible'

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, 50)

    this.startDynamicLink()
    this.loadProjects()
  }

  interpolate(template: string, params: any) {
    const replaceTags = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '(': '%28', ')': '%29' } as any;
    const safeInnerHTML = (text: string) => text.toString().replace(/[&<>\(\)]/g, tag => replaceTags[tag] || tag);
    const keys = Object.keys(params);
    const keyVals = Object.values(params).map(safeInnerHTML as any);
    return new Function(...keys, `return \`${template}\``)(...keyVals);
 }

 private loadProjects() {
  const container1 = document.getElementById('projectsWrapper1')
  const container2 = document.getElementById('projectsWrapper2')
  const template = document.getElementById('projectBlockTmpl')

  this.projects.forEach(project => { 
    container1.innerHTML += this.interpolate(template.innerHTML.toString().trim(), project)
    container2.innerHTML += this.interpolate(template.innerHTML.toString().trim(), project)
  })
}

  private startDynamicLink() {
    const container = document.getElementById('dynamicLinks')
    const template = document.getElementById('linkSliderTmpl')
    const data = { name: 'John Doe', age: 25}    
    // container.innerHTML += this.interpolate(template.innerHTML.toString().trim(), data)
  }
}
