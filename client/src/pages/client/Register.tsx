import { ChangeEvent, FormEvent, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  AuthError,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../../utils/firebaseConfig";
import strongPasswordChecker from "../../utils/strongPasswordChecker";

export default function Register() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);

  const handleChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImgFile(e.target.files[0]);
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current || !passwordRef.current) return;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (strongPasswordChecker(password) === "WEAK") return;
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (imgFile?.name) {
        const _ref = ref(storage, user.uid + "/profilePicture/" + imgFile.name);
        const uploadFile = uploadBytesResumable(_ref, imgFile);
        uploadFile.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {},
          async () => {
            const downloadURL = await getDownloadURL(uploadFile.snapshot.ref);
            await updateProfile(user, { photoURL: downloadURL });
          }
        );
      }
      await sendEmailVerification(user);
    } catch (error) {
      const authErr = error as AuthError;
      const errorCode = authErr.code;
      console.error(error);
    }
  };

  return (
    <section>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" ref={emailRef} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" ref={passwordRef} />
        </div>
        <div>
          <label htmlFor="re-password">Enter password again</label>
          <input type="password" />
        </div>
        {/* TODO: Re enter password */}
        <div>
          <label htmlFor="avatar">Upload avatar</label>
          <input type="file" accept="image/*" onChange={handleChangeImg} />
        </div>
        <button type="submit">Register</button>
      </form>
    </section>
  );
}
