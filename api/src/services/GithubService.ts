import { BotCard, BotCards } from "../models/BotCard";
import { IGithubService } from "./IGithubService";
import { GithubRepositoryInfo, Pagination, Parameters } from "../models/GithubApi";
import axios, { AxiosInstance } from 'axios'
import parseLinkHeader from 'parse-link-header'

export class GithubService implements IGithubService {
  private axiosInstance: AxiosInstance
  private pagination: Pagination

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.github.com',
    })

    this.axiosInstance.defaults.headers['Accept'] = 'application/vnd.github.v3+json'
    this.pagination = { page: 1, per_page: 30, sort: 'created', direction: 'asc' }
  }

  public async getOrgRepositoriesByLanguage({ organization, language, limit }: Parameters): Promise<BotCards | null> {
    const path = `/orgs/${organization}/repos`
    const parameters = this.getParameterString(this.pagination)

    try {
      const { data, status, headers } =
        await this.axiosInstance.get<GithubRepositoryInfo[]>(`${path}?${parameters}`)

      let linkHeader = parseLinkHeader(headers.link)

      if (status === 200) {
        const filteredRepositoriesByLanguage = await this.requestNextPages(data, linkHeader, limit, language)
        const botCards = this.mapGithubResponseToBotCard(filteredRepositoriesByLanguage).slice(0, limit)
        const takeBlipObject = this.getTakeBlipObject(botCards)
        return takeBlipObject
      }

      return null
    }
    catch (error) {
      return null // prevent app crash
    }
  }

  private mapGithubResponseToBotCard(repositories: GithubRepositoryInfo[]): BotCard[] {
    return repositories.map(repo => ({
      description: repo.description,
      fullname: repo.full_name,
      avatar: repo.owner.avatar_url,
      language: repo.language,
      created: repo.created_at
    }))
  }

  private getTakeBlipObject(cards: BotCard[]) {
    return cards.reduce((obj, card, index) => {
      return { ...obj, [`card${index}`]: card}
    }, {} as BotCards)
  }

  private filterRepositoriesByLanguage(repositories: GithubRepositoryInfo[], language: string) {
    return repositories.filter(d => d.language === language)
  }

  private getParameterString(pagination: Pagination | any) {
    const parameters = Object.keys(pagination).map((parameter: any) => {
      const value = pagination[parameter]
      return `${parameter}=${value}`
    })

    return parameters.join('&')
  }

  private async requestNextPages(data: GithubRepositoryInfo[], linkHeader: any, limit: number, language: string) {
    let filteredRepositories = this.filterRepositoriesByLanguage(data, language)

    while (filteredRepositories.length < limit && linkHeader?.next != null) {
      let nextPage = await this.axiosInstance.get<GithubRepositoryInfo[]>(linkHeader.next.url)

      filteredRepositories = [
        ...filteredRepositories,
        ...this.filterRepositoriesByLanguage(nextPage.data, language)
      ]

      linkHeader = parseLinkHeader(nextPage.headers.link)
    }

    return filteredRepositories
  }
}