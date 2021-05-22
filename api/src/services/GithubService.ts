import { BotCard } from "../models/BotCard";
import { IGithubService } from "./IGithubService";
import { GithubRepositoryInfo, Pagination } from "../models/GithubApi";

import axios, { AxiosInstance } from 'axios'

export class GithubService implements IGithubService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.github.com',
    })

    this.axiosInstance.defaults.headers['Accept'] = 'application/vnd.github.v3+json'
  }

  public async getOrgRepositoriesByLanguage(org: string, language: string, pagination: Pagination): Promise<BotCard[] | null> {
    const path = `/orgs/${org}/repos`
    const parameters = this.getParameterString(pagination)

    const { data, status } = await this.axiosInstance.get<GithubRepositoryInfo[]>(`${path}?${parameters}`)

    if (status === 200) {
      const filteredRepositories = this.filterRepositoriesByLanguage(data, language)

      const botCards: BotCard[] = filteredRepositories.map(({ description, full_name, owner }) => ({
        description,
        fullname: full_name,
        avatar: owner.avatar_url
      }))

      return botCards
    }

    return null
  }

  private filterRepositoriesByLanguage(repositories: GithubRepositoryInfo[], language: string) {
    return repositories
      .filter(d => d.language === language)
      .slice(0, 5)
  }

  private getParameterString(pagination: Pagination | any) {
    const parameters = Object.keys(pagination).map((parameter: any) => {
      const value = pagination[parameter]
      return `${parameter}=${value}`
    })

    return parameters.join('&')
  }
}