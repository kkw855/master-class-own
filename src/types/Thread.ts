export default interface Thread {
  id: string;
  userId: string;
  contributors?: string[];
  firstPostId: string;
  forumId: string;
  lastPostAt: number;
  lastPostId: string;
  posts: string[];
  publishedAt: number;
  slug: string;
  title: string;
}
