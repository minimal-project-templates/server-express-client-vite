import { join } from "path"

export const APP_CONFIG = {
  env: {
    prod: false
  },
  server: {
    port: +process.env['PUBLIC_SERVER_PORT'],
    host: process.env['PUBLIC_SERVER_HOST'],
    paths: {
      client: join(__dirname, '..', process.env['PUBLIC_SERVER_CLIENT_PATH']),
      logs: join(__dirname, '../../_data/logs'),
      certs: join(__dirname, '../../certs'),
    }
  }
}

APP_CONFIG.env.prod = APP_CONFIG.server.port === 443