export interface IPackageDependencies {
  [packageId: string]: {
    required: boolean
    version: string
  }
}

export interface IPackagePermission {
  id: string
  name: string
  description?: string
}

export interface IPackageRole {
  id: string
  name: string
  rank: number
  permissions: IPackagePermission[]
}

export interface IPackageTag {
  id: string
  name: string
  description?: string
}

export interface IPackageTask {
  name: string
  modulePath: string
  schedule: string
}

export interface IPackageMetadata {
  packageId: string
  author: string
  version: string
  buildId: string
  coreVersion?: string
  clientVersion?: string
  commit: string
  buildTime: number
  name: string
  shortName: string
  color: string
  iconSource: string
  icon: string
  updateURL: string
  packageDependencies?: IPackageDependencies
  roles?: IPackageRole[]
  tags?: IPackageTag[]
  tasks?: IPackageTask[]
  // activities?:
  // events?:
}
