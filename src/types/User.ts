export default interface User {
  avatar: string;
  email: string;
  lastVisitAt: number;
  name: string;
  isModerator?: boolean;
  registeredAt: number;
  username: string;
  usernameLower: string;
  id: string;
  twitter?: string;
  website?: string;
}
