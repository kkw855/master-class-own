export default interface User {
  readonly avatar: string;
  readonly email: string;
  readonly lastVisitAt: number;
  readonly name: string;
  readonly isModerator?: boolean;
  readonly registeredAt: number;
  readonly username: string;
  readonly usernameLower: string;
  readonly id: string;
  readonly twitter?: string;
  readonly website?: string;
}
