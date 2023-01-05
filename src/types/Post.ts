export default interface Post {
  id: string;
  userId: string;
  threadId: string;
  edited?: {
    at: number;
    by: string;
    moderated: boolean;
  };
  publishedAt: number;
  text: string;
  reactions?: {
    [emoji: string]: {
      [key: string]: string;
    };
  };
}
