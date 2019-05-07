import { signDataWithSecret } from '../src/signDataWithSecret'
describe('signDataWithSecret', () => {
  it('should sign a json object correctly', () => {
    const testBody = {}
    const testSecret = 'abc123'
    const testSignature = 'b65d06306051d683161164b9e008febf52ec4eafbe8ee54f7e07062a1b6a5d0a'
    expect(signDataWithSecret(testBody, testSecret)).toEqual(testSignature)
  })

  it('should sign a string correctly', () => {
    const testBody = 'hello, world'
    const testSecret = 'abc123'
    const testSignature = '34cf07c86cdd544c838b3fe104e6ec0813eb04b70ace447964634a4aae5fc9b6'
    expect(signDataWithSecret(testBody, testSecret)).toEqual(testSignature)
  })

  it('should throw an error when called with data that is not a string or object', () => {
    const testBody: any = 123456
    const testSecret = 'abc123'
    expect(() => signDataWithSecret(testBody, testSecret)).toThrow(TypeError)
  })
})
