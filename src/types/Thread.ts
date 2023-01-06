export default interface Thread {
  readonly id: string;
  readonly userId: string;
  readonly contributors?: readonly string[];
  readonly firstPostId: string;
  readonly forumId: string;
  readonly lastPostAt: number;
  readonly lastPostId: string;
  readonly posts: readonly string[];
  readonly publishedAt: number;
  readonly slug: string;
  readonly title: string;
}
