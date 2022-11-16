import { User } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";

export default interface GlobalContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}
