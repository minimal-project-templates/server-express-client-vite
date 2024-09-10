import { json, urlencoded } from 'body-parser'
import express, { Application } from 'express'
import { App } from './app'
import { logger } from './util/logger'
import { APP_CONFIG } from './app.config'

export class AppServer {
  private server: Application

  constructor(public app: App) {}

  init() {
    this.server = express()
    this.server.use(json())
    this.server.use(urlencoded({ extended: true }))
    this.server.use(express.static(APP_CONFIG.server.paths.client))
  }

  async start() {
    return new Promise((resolve) => {
      const PORT = APP_CONFIG.server.port
      const HOST = APP_CONFIG.server.host

      this.server.listen(PORT, HOST, () => {
        logger.info(`Server is running at http://${HOST}:${PORT}`)
        resolve(true)
      })
    })
  }
}
