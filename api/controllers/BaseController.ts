const fs = require('fs')
const pdf = require('html-pdf')
import { Request, Response, NextFunction } from 'express';

class BaseController {
  generatePdf = async (html: string, req: Request, res: Response) => {
    const options = {
      type: 'pdf',
      format: 'A4',
      orientation: 'portrait'
    }

    pdf.create(html, options).toBuffer((err: any, buffer: any) => {
      if (err) {
        return res.status(500).json(err)
      }

      res.header("Content-Disposition", "attachment;");

      res.end(buffer)
    })
  }
}

export default BaseController;