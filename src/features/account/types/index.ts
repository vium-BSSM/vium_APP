export interface MyProfile {
  nickname: string;
  handle: string;
  profileImageUrl: string | null;
}

export type MyPageMenuKey = 'logout' | 'settings' | 'inquiry' | 'withdraw';
