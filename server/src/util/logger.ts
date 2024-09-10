import { join } from 'path'
import pino, { Logger } from 'pino'
import PinoPretty from 'pino-pretty'
import { APP_CONFIG } from '../app.config'
import { mkdirp } from 'mkdirp'

export let logger: Logger

/**
 * must be initialized in before everything else
 */
export function initLogger(filename: string) {
  // create logs dir if not exists
  mkdirp.sync(APP_CONFIG.server.paths.logs)

  logger = pino(
    {
      level: 'info',
      serializers: {
        error: pino.stdSerializers.err,
      },
      base: undefined,
      transport: {
        targets: [
          {
            level: 'info',
            target: 'pino-pretty',
            options: {},
          },
          {
            level: 'trace',
            target: 'pino/file',
            options: { destination: join(APP_CONFIG.server.paths.logs, filename) },
          },
        ],
      },
    }
  )
}

// initLogger('generic.log')