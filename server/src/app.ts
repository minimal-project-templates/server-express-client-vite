import { AppServer } from './app.server'

export class App {
  server: AppServer

  init() {
    this.server = new AppServer(this)
    this.server.init()
  }

  async start() {
    await this.server.start()
  }
}
