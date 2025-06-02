type roleType = {
  id: string
  name: string
  description: string
}

type UserData = {
  id: string
  userName: string
  fullName: string
  email: string
  avatarUrl: string
  birthDay: string
}

type TokenResponse = {
  accessToken: string
  refreshToken: string
}

type LoginSuccessResponse = {
  value: {
    message: string
    userData: UserData
    tokenResponse: TokenResponse
  }
}

type GetAllRolesResponse = {
  id: string
  name: string
  description: string
  createdAt: string
}

type GetAllUsersResponse = {
  userDto: UserData
  roles: string[]
}

export type {
  roleType,
  LoginSuccessResponse,
  UserData,
  TokenResponse,
  GetAllUsersResponse,
  GetAllRolesResponse,
}
