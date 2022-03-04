import FormData from 'form-data'
import {createReadStream} from 'fs'
import http from 'http'
import https from 'https'

export const optionFactory = (
  urlObject: URL,
  apiKey: string,
  headers: {[key: string]: string | number}
): https.RequestOptions => ({
  hostname: urlObject.hostname,
  path: urlObject.pathname,
  port: urlObject.port,
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    ...headers
  }
})

export const post = async <T>(
  url: string,
  apiKey: string,
  body: string
): Promise<T> =>
  new Promise((resolve, reject) => {
    const urlObject = new URL(url)

    const request = urlObject.protocol === 'https:' ? https : http

    const options = optionFactory(urlObject, apiKey, {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    })

    const req = request
      .request(options, res => {
        let r = ''

        res.on('data', chunk => {
          r += chunk
        })

        res.on('end', () => {
          if (res.statusCode !== 200 && res.statusCode !== 201) {
            reject(new Error(`Status code: ${res.statusCode} - ${r}`))
          } else {
            resolve(JSON.parse(r))
          }
        })
      })
      .on('error', err => {
        reject(err)
      })

    req.write(body)
    req.end()
  })

export const upload = async <T>(
  url: string,
  apiKey: string,
  path: string
): Promise<T> =>
  new Promise((resolve, reject) => {
    const readStream = createReadStream(path)

    const form = new FormData()
    form.append('artefact', readStream)

    const urlObject = new URL(url)

    const request = urlObject.protocol === 'https:' ? https : http

    const options = optionFactory(urlObject, apiKey, {
      'Content-Type': form.getHeaders()['content-type']
    })

    const req = request
      .request(options, res => {
        let r = ''

        res.on('data', chunk => {
          r += chunk
        })

        res.on('end', () => {
          if (res.statusCode !== 200 && res.statusCode !== 201) {
            reject(new Error(`Status code: ${res.statusCode} - ${r}`))
          } else {
            resolve(JSON.parse(r))
          }
        })
      })
      .on('error', err => {
        reject(err)
      })

    req.end()
  })
