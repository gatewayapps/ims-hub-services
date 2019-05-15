import crypto from 'crypto'

/**
 * Generates a SHA256 HMAC signature of a data value using the provided secret. The result is a
 * hex encoded string.
 * @param data Value to be signed
 * @param secret Key to be used when generating the signature
 */
export function signDataWithSecret(data: string | object, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret)
  switch (typeof data) {
    case 'object': {
      hmac.update(JSON.stringify(data))
      break
    }
    case 'string': {
      hmac.update(data)
      break
    }
    default: {
      throw new TypeError('Data must be a string, object, or array')
    }
  }

  return hmac.digest('hex')
}
