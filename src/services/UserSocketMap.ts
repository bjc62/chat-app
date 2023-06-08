class UserSocketMap {
  private static instance: UserSocketMap;
  private userSocketMap: Map<string, string>;

  private constructor() {
    this.userSocketMap = new Map<string, string>();
  }

  public static getInstance(): UserSocketMap {
    if (UserSocketMap.instance) return UserSocketMap.instance;
    else {
      UserSocketMap.instance = new UserSocketMap();
      return UserSocketMap.instance;
    }
  }

  public set(userEmail: string, socketId: string): void {
    this.userSocketMap.set(userEmail, socketId);
  }

  public get(userEmail: string) {
    if (this.userSocketMap.get(userEmail)) {
      return this.userSocketMap.get(userEmail);
    } else {
      console.error(`user email not found: ${userEmail}`);
      throw new Error(`user email not found: ${userEmail}`);
    }
  }
}

export default UserSocketMap;
