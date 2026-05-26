export {};

declare global {
  namespace Express {
    interface Request {
      session?: {
        userId: string;
        sessionId: string;
        email: string;
      };
    }
  }
}