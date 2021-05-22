import { GithubService } from '../services/GithubService'
import { Request, Response } from 'express'
import { Pagination } from '../models/GithubApi'

const NodeCache = require('node-cache')

const cache = new NodeCache()
const service = new GithubService()

export default {
  get: async (req: Request, res: Response) => {
    const { page, perPage, org, language } = req.query
    const cacheKey = process.env.CACHE_KEY

    const pagination: Pagination = {
      page: page as string,
      per_page: perPage as string,
      direction: 'asc',
      sort: 'created'
    }

    const cacheResponse = cache.get(cacheKey)

    if (cacheResponse ===  undefined) {
      const data = await service
        .getOrgRepositoriesByLanguage(String(org), String(language), pagination)

      if (data != null) {
        cache.set(cacheKey, data, 20)

        return res.status(200)
          .json({ data })
      }

      return res.status(400)
    }

    return res.status(200)
      .json({ data: cacheResponse })
  }
}