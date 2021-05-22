import { BotCard } from "../models/BotCard";
import { Pagination } from "../models/GithubApi";

export interface IGithubService {
  getOrgRepositoriesByLanguage(org: string, language: string, pagination: Pagination): Promise<BotCard[] | null>
}