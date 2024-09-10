import { json, urlencoded } from 'body-parser'
import express, { Application } from 'express'
import { readFileSync } from 'fs'
import helmet from 'helmet'
import http from 'http'
import https from 'https'
import { join } from 'path'
import { App } from './app'
import { APP_CONFIG } from './app.config'
import { logger } from './util/logger'
import { engine } from 'express-handlebars'

export class AppServer {
  private expressApp: Application
  private protocol = APP_CONFIG.env.prod ? 'https' : 'http'
  private server: https.Server | http.Server

  constructor(public app: App) {}

  init() {
    this.expressApp = express()
    this.expressApp.use(json())
    this.expressApp.use(urlencoded({ extended: true }))
    this.expressApp.use(express.static(APP_CONFIG.server.paths.client))

    if (APP_CONFIG.server.render?.ssr !== false) {
      this.expressApp.engine('handlebars', engine())
      this.expressApp.set('view engine', 'handlebars')
      this.expressApp.set('views', './views')
    }
  }

  async start() {
    return new Promise(resolve => {
      const PORT = APP_CONFIG.server.port
      const HOST = APP_CONFIG.server.host

      // do special stuff, depending on PROD or DEV
      if (APP_CONFIG.env.prod) {
        this.startProdMode()
      } else {
        this.startDevMode()
      }

      // start listening
      this.server.listen(PORT, HOST, () => {
        logger.info(`Server is running at ${this.protocol}://${HOST}:${PORT}`)
        resolve(true)
      })
    })
  }

  /**
   * start PROD mode
   */
  private startProdMode() {
    this.expressApp.use(helmet())

    const credentials = {
      key: readFileSync(join(APP_CONFIG.server.paths.certs, 'certificate.key')),
      cert: readFileSync(join(APP_CONFIG.server.paths.certs, 'certificate.crt')),
    }

    this.server = https.createServer(credentials, this.expressApp)
  }

  /**
   * start DEV mode
   */
  private startDevMode() {
    this.server = http.createServer(this.expressApp)
  }
}
