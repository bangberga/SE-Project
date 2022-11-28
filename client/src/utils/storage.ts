import {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "./firebaseConfig";

function deleteImage(imgUrl: string) {
  const _ref = ref(storage, imgUrl);
  return deleteObject(_ref);
}

export function deleteImages(imgUrls: string[]) {
  return Promise.all(imgUrls.map((url) => deleteImage(url)));
}

function uploadImage(img: File, middlePath?: string) {
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
      (error) => {},
      () => {
        resolve(getDownloadURL(uploadFile.snapshot.ref));
      }
    );
  });
}

export function uploadImages(imgs: FileList, middlePath?: string) {
  const files: Promise<string>[] = [];
  for (const file of imgs) {
    files.push(uploadImage(file, middlePath));
  }
  return Promise.all(files);
}
