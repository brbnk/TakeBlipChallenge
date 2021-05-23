export interface BotCard {
  description: string,
  fullname: string,
  avatar: string,
  created: string,
  language: string
}

export type BotCards = Record<string, BotCard>