import { Request, Response } from 'express'

export default {
  get: async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello, World!' })
  }
}