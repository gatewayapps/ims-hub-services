import { sendHubRequest } from "./request";
import { I_v_UserAccount } from "./types/I_v_UserAccount";

export async function fetchOwnerAccountForUserAccount (userAccountId: number): Promise<I_v_UserAccount | undefined> {
  const result = await sendHubRequest(`/api/hubServices/user/${userAccountId}/ownerAccount`, 'GET')
  if(result.success){
    return result.data
  } else {
    return undefined
  }
}