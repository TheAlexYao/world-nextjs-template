interface MiniKitUser {
  username: string;
}

interface MiniKitGlobal {
  user?: MiniKitUser;
}

declare global {
  interface Window {
    MiniKit?: MiniKitGlobal;
  }
}

export {} 