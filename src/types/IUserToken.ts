export interface IUserToken {
  userAccountId: number
  displayName: string
  claims: string[]
  exp: number
  email?: string | null
  profileImageUrl?: string | null
  tags: string[]
}
