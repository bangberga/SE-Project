import {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "./firebaseConfig";

export function instanceOfStorageError(err: any): boolean {
  return (
    "code" in err &&
    "message" in err &&
    "name" in err &&
    "serverResponse" in err
  );
}

function deleteImage(imgUrl: string): Promise<void> {
  const _ref = ref(storage, imgUrl);
  return deleteObject(_ref);
}

export function deleteImages(imgUrls: string[]): Promise<void[]> {
  return Promise.all(imgUrls.map((url) => deleteImage(url)));
}

function uploadImage(img: File, middlePath?: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const _ref = ref(
      storage,
      `${middlePath ? middlePath : ""}${img.name}${Date.now()}`
    );
    const uploadFile = uploadBytesResumable(_ref, img);
    uploadFile.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        reject(error);
      },
      () => {
        resolve(getDownloadURL(uploadFile.snapshot.ref));
      }
    );
  });
}

export function uploadImages(
  imgs: FileList,
  middlePath?: string
): Promise<string[]> {
  const files: Promise<string>[] = [];
  for (const file of imgs) {
    files.push(uploadImage(file, middlePath));
  }
  return Promise.all(files);
}
