import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const path = join(`${__dirname}`, '..', 'routes')
  readdirSync(path).map(async file => {
    if (!file.includes('.test.') && !file.includes('.js.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
