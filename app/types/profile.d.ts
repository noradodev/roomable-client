export interface UserProfile {
  phone: string | null
  address: string | null
  telegram_username: string | null
  profile_image: string | File | null
  telegram_id: number | null;
}

export interface User {
  id: number | string
  name: string
  email: string
  roles: string | string[]
  profile: UserProfile
}
