const NodeCache = require('node-cache')

interface ICache<T> {
  setValue(value: T): void;
  getValue(): any;
}

export interface CacheConfig {
  key: string,
  time: number
}

export class Cache<T> implements ICache<T> {
  private key: string
  private time: number
  private cache: any

  constructor() {
    this.cache = new NodeCache()
    this.key = ''
    this.time = 0
  }

  public setConfig(cacheConfig: CacheConfig) {
    this.key = cacheConfig.key
    this.time = cacheConfig.time
  }

  public setValue(data: T) {
    this.cache.set(this.key, data, this.time)
  }

  public getValue() {
    return this.cache.get(this.key)
  }
 }