export interface I_v_UserAccount {
  userAccountId: number
  firstName: string
  lastName: string
  fullName?: string | null
  displayName?: string | null
  jobTitle?: string | null
  hireDate?: Date
  positionStartDate?: Date | null
  isTerminated: boolean
  externalId?: string | null
  profileImageUrl: string
  locationCodeId?: number | null
  nodeId?: number | null
  nodePath?: string | null
  positionPath?: string | null
  email?: string | null
  birthday?: Date | null
  cellPhone?: string | null
}
