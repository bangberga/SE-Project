type Owner = {
  customClaims: { admin: boolean };
  uid: string;
  email: string;
  photoURL: string;
  displayName?: string;
  disabled: boolean;
};

type UserRes = {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
};

export type { Owner, UserRes };
