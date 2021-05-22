import { GithubService } from '../services/GithubService'
import { Request, Response } from 'express'
import { Pagination } from '../models/GithubApi'

const service = new GithubService()

export default {
  get: async (req: Request, res: Response) => {
    const { page, perPage, org, language } = req.query

    const pagination: Pagination = {
      page: page as string,
      per_page: perPage as string,
      direction: 'asc',
      sort: 'created'
    }

    const data = await service
      .getOrgRepositoriesByLanguage(String(org), String(language), pagination)

    if (data != null) {
      return res.status(200)
        .json({ data })
    }

    return res.status(400)
  }
}