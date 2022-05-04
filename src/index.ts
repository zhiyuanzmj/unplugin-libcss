import fs from 'fs'
import { resolve } from 'path'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'

let viteConfig: any

export default createUnplugin<Options>(options => ({
  name: 'unplugin-libcss',
  transformInclude(id) {
    return id.endsWith('main.ts')
  },
  transform(code) {
    return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
  },
  configResolved(resolvedConfig: any) {
    viteConfig = resolvedConfig
  },
  writeBundle(option: any, bundle: any) {
    const files = Object.keys(bundle)
    const cssFile = files.find(v => v.endsWith('.css'))
    if (!cssFile)
      return

    for (const file of files) {
      if (!bundle[file].isEntry) {
        // only for entry
        continue
      }
      const outDir = viteConfig.build.outDir || 'dist'
      const filePath = resolve(viteConfig.root, outDir, file)
      const data = fs.readFileSync(filePath, {
        encoding: 'utf8',
      })
      fs.writeFileSync(filePath, `import './${cssFile}';\n${data}`)
    }
  },
}))
