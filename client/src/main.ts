import {PageHome} from './pages/home/page-home'

function main() {
  const page = new PageHome()
  page.init()

  document.addEventListener('DOMContentLoaded', () =>  page.onDOMLoaded())
  
  // window.onload = () => page.onDOMLoaded()
}

main()