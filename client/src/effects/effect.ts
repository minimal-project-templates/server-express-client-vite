export const mousePosition = {
  x: 2,
  y: 0,
}

window.addEventListener('mousemove', event => {
  mousePosition.x = event.clientX
  mousePosition.y = event.clientY
})

window.addEventListener('touchmove', event => {
  console.log(event)
  mousePosition.x = event.changedTouches[0].pageX;
  mousePosition.x = event.changedTouches[0].clientY;
  // mousePosition.x = event.clientX
  // mousePosition.y = event.clientY
})

export function getWeatherState() {
  const now = new Date()
  const seconds = now.getSeconds()

  return 60 / seconds
}
