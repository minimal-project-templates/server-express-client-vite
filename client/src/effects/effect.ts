export function getWeatherState() {
  const now = new Date()
  const seconds = now.getSeconds()

  return 60 / seconds
}
