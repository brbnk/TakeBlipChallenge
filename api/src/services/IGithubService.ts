import { BotCard } from "../models/BotCard";
import { Parameters } from "../models/GithubApi";

export interface IGithubService {
  getOrgRepositoriesByLanguage(parameters: Parameters): Promise<BotCard[] | null>
}