import { Response } from 'express'

export class HttpResponse<T> {
  private response: Response;

  constructor(response: Response) {
    this.response = response;
  }

  public Ok(data: T) {
    return this.response.status(200).json({ data })
  }

  public BadRequest() {
    return this.response.status(400).send(null)
  }
}