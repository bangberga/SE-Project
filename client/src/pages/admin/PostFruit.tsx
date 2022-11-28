import axios from "axios";
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAdmin } from "../../components/admin/AdminProvider";
import { uploadImages } from "../../utils/storage";
import { FruitReq } from "../../interfaces/Fruit";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

export default function PostFruitModal() {
  const [imgFiles, setImgFiles] = useState<FileList | null>();
  const { admin } = useAdmin();
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      setLoading(true);
      e.preventDefault();
      const [name, price, quantity, description] = [
        nameRef.current,
        priceRef.current,
        quantityRef.current,
        descriptionRef.current,
      ];
      if (!name || !price || !quantity || !description || !admin) return;
      if (isNaN(Number(price.value))) return;
      const body: FruitReq = {
        name: name.value,
        quantity: Number(quantity.value),
        price: Number(price.value),
      };
      if (description.value) body.description = description.value;
      if (imgFiles?.length) {
        const fileNames = await uploadImages(imgFiles);
        body.image = fileNames;
      }
      try {
        await axios.post(`${baseUrl}/api/v1/fruits`, body, {
          headers: {
            Authorization: `Bearer ${await admin.getIdToken()}`,
          },
        });
      } catch (error) {
        //handle error
      } finally {
        setLoading(false);
      }
    },
    [imgFiles]
  );

  const handleChangeFiles = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setImgFiles(e.target.files);
  }, []);

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <h2 className="title">Post new fruit</h2>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" ref={nameRef} className="text-input" />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            min={0}
            ref={priceRef}
            className="text-input"
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            min={0}
            name="quantity"
            ref={quantityRef}
            className="text-input"
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            placeholder="enter description"
            ref={descriptionRef}
          ></textarea>
        </div>
        <div>
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            multiple={true}
            onChange={handleChangeFiles}
          />
        </div>
        <div className="btn-container">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Post"}
          </button>
          <Link to="/admin/stock" className="btn-text-link">
            Back
          </Link>
        </div>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  h2 {
    color: var(--primaryColor);
  }
  label {
    font-weight: bold;
    color: var(--primaryColor);
    display: block;
  }
  .text-input {
    display: block;
    width: 500px;
    height: 40px;
    border: none;
    background-color: var(--mainBackground);
    border-radius: var(--mainBorderRadius);
    padding: 0 10px;
  }
  form {
    background-color: var(--mainWhite);
    box-shadow: var(--darkShadow);
    padding: 20px 30px;
  }
  div {
    margin-bottom: 10px;
  }
  p {
    margin: 0;
  }
  textarea {
    width: 100%;
    height: 50px;
    resize: none;
    padding: 5px;
  }
  .success,
  .error {
    display: flex;
    justify-content: center;
    height: var(--inputHeight);
    border-radius: var(--mainBorderRadius);
    align-items: center;
  }
  .success {
    color: var(--mainGreen);
    background-color: var(--mainLightGreen);
  }
  .error {
    color: var(--mainRed);
    background-color: var(--mainLightRed);
  }
  .btn-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    align-items: center;
  }
`;
