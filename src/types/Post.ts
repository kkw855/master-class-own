export default interface Post {
  readonly id: string;
  readonly userId: string;
  readonly threadId: string;
  readonly edited?: {
    readonly at: number;
    readonly by: string;
    readonly moderated: boolean;
  };
  readonly publishedAt: number;
  readonly text: string;
  readonly reactions?: {
    readonly [emoji: string]: {
      readonly [key: string]: string;
    };
  };
}
