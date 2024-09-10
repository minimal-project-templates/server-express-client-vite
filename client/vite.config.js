import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      resolve: {
        alias: {
          '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
        }
      },
      server: {
        port: 4000
      }
    }
  } else {
    // command === 'build'
    return {
      // build specific config
    }
  }
})