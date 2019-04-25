import { IPackageMetadata } from './IPackageMetadata'

export interface IPackageMetadataRequestBody {
  data: IPackageMetadata
  signature: string
}
