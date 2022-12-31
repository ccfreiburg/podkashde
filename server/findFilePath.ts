import fs from 'fs'
import path from 'path'

export function findFile(name: string, path: string) : string {
  const dirs = [path]
  while (dirs.length>0) {
    const currentDir = dirs.pop()
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        if (!(fs.lstatSync(`${currentDir}/${item}`)).isDirectory()) {
          if (item===name) 
            return `${currentDir}/${item}`
        } else
          dirs.push(`${currentDir}/${item}`)
      }
  }
  return ""
}

