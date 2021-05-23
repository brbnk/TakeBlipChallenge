import { Request, Response } from 'express'
import { Parameters } from '../models/GithubApi'
import { BotCards } from '../models/BotCard'
import { sanitize } from '../utils/strings'
import { GithubService } from '../services/GithubService'
import { HttpResponse } from '../core/http'
import { Cache } from '../core/cache'

const cache = new Cache<BotCards>()

export default {
  get: async (req: Request, res: Response) => {
    const { org, language, limit } = req.query

    // cache key follows the pattern: 'org-language-limit'
    cache.setConfig({
      key: `${sanitize(String(org))}-${sanitize(String(language))}-${limit}`,
      time: 120
    })

    const service = new GithubService()
    const httpResponse = new HttpResponse<BotCards>(res)

    const parameters: Parameters = {
      organization: org as string,
      language: language as string,
      limit: Number(limit)
    }

    const cacheResponse = cache.getValue()

    if (cacheResponse ===  undefined) {
      const data = await service.getOrgRepositoriesByLanguage(parameters)

      if (data != null) {
        cache.setValue(data)
        return httpResponse.Ok(data)
      }

      return httpResponse.BadRequest()
    }

    return httpResponse.Ok(cacheResponse)
  }
}