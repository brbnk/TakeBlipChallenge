import { BotCards } from "../models/BotCard";
import { Parameters } from "../models/GithubApi";

export interface IGithubService {
  getOrgRepositoriesByLanguage(parameters: Parameters): Promise<BotCards | null>
}