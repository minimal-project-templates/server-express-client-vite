import { defineConfig } from 'vite'

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
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