
declare module '#auth' {
  interface SessionData {
    id: string;
    name: string;
    email: string;
    roles: 'landlord' | string;
    profile: {
      user_id: string;
      phone: string | null;
      telegram_id: string | null;
      telegram_username: string | null;
      address: string| null;
      profile_image: string | null;

    }
  }
}