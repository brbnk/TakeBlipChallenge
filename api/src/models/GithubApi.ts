export interface GithubRepositoryInfo {
  description: string,
  full_name: string,
  language: string,
  owner: Owner,
  created_at: string
}

export interface Parameters {
  organization: string,
  language: string,
  limit: number
}

export interface Pagination {
  per_page: number,
  page: number,
  sort: string,
  direction: string
}

interface Owner {
  avatar_url: string
}