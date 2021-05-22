export interface GithubRepositoryInfo {
  description: string,
  full_name: string,
  language: string,
  owner: Owner
}

export interface Pagination {
  per_page: string,
  page: string,
  sort: string,
  direction: string
}

interface Owner {
  avatar_url: string
}