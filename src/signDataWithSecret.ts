import crypto from 'crypto'

/**
 * Generates a SHA256 HMAC signature of a data value using the provided secret. The result is a
 * hex encoded string.
 * @param data Value to be signed
 * @param secret Key to be used when generating the signature
 */
export function signDataWithSecret(data: any, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(JSON.stringify(data))
  return hmac.digest('hex')
}
