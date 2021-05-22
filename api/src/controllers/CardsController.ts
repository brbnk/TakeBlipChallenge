import { GithubService } from '../services/GithubService'
import { Request, Response } from 'express'
import { Pagination, Parameters } from '../models/GithubApi'

const NodeCache = require('node-cache')

const cache = new NodeCache()

const cacheCofig = {
  key: "GITHUBINFO",
  time: 20
}

const service = new GithubService()

export default {
  get: async (req: Request, res: Response) => {
    const { org, language, limit } = req.query

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

        return res.status(200)
          .json({ data })
      }

      return res.status(400)
    }

    return res.status(200)
      .json({ data: cacheResponse })
  }
}