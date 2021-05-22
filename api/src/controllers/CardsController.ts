import { GithubService } from '../services/GithubService'
import { Request, Response } from 'express'
import { Parameters } from '../models/GithubApi'
import { sanitize } from '../utils/strings'

const NodeCache = require('node-cache')
const cache = new NodeCache()

const service = new GithubService()

export default {
  get: async (req: Request, res: Response) => {
    const { org, language, limit } = req.query

    let cacheCofig = {
      key: `${sanitize(String(org))}-${sanitize(String(language))}`,
      time: 120
    }

    const parameters: Parameters = {
      organization: org as string,
      language: language as string,
      limit: Number(limit)
    }

    const cacheResponse = cache.get(cacheCofig.key)

    if (cacheResponse ===  undefined) {
      const data = await service
        .getOrgRepositoriesByLanguage(parameters)

      if (data != null) {
        cache.set(cacheCofig.key, data, cacheCofig.time)

        return res.status(200).json({ data })
      }

      return res.status(400)
    }

    return res.status(200).json({ data: cacheResponse })
  }
}