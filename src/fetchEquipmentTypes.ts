import { sendHubRequest } from './request'
import { ICachedNode } from './types/ICachedNode'
import { IEquipmentType } from './types/IEquipmentType'

export async function fetchEquipmentTypes(): Promise<IEquipmentType[]> {
  const endpoint = `/api/hubServices/fetchEquipmentTypes`

  const result = await sendHubRequest(endpoint, 'GET')
  if (result.success) {
    return result.data
  } else {
    throw result.error
  }
}
