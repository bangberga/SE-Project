type Owner = {
  customClaims: { admin: boolean };
  displayName?: string;
  email: string;
  photoURL: string;
  uid: string;
  disabled: boolean;
};

type UserRes = {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
};

export type { Owner, UserRes };
