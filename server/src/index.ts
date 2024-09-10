require('./util/logger').initLogger('app.log')
import { App } from "./app";

async function main() {
  const app = new App()
  app.init()
  await app.start()
}

main()