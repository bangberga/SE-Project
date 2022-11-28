import axios, { AxiosError } from "axios";
import { useCallback, useState, FormEvent, ChangeEvent, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAdmin } from "../../components/admin/AdminProvider";
import { FruitReq } from "../../interfaces/Fruit";
import { deleteImages, uploadImages } from "../../utils/storage";
import { useStock } from "../../components/admin/StockProvider";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

export default function SingleFruit() {
  const [imgFiles, setImgFiles] = useState<FileList | null>();
  const { id } = useParams();
  const { admin } = useAdmin();
  const { fruits } = useStock();
  const fruit = useMemo(
    () => fruits.find((fruit) => fruit._id === id) || null,
    [fruits]
  );
  const [updateFruit, setUpdateFruit] = useState<FruitReq>({
    name: fruit ? fruit.name : "",
    price: fruit ? fruit.price : 0,
    quantity: fruit ? fruit.quantity : 0,
    description: fruit ? fruit.description : "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      setLoading(true);
      e.preventDefault();
      if (!admin || !fruit || fruit.owner !== admin.uid) return;
      if (isNaN(Number(fruit.price))) return;
      const { name, quantity, price, description } = updateFruit;
      const body: FruitReq = { name, price, quantity, description };
      if (imgFiles?.length) {
        await deleteImages(
          fruit.image.filter((img) => img !== "/unavailable image.jpg")
        );
        body.image = await uploadImages(imgFiles);
      }
      try {
        await axios.patch(`${baseUrl}/api/v1/fruits/${id}`, body, {
          headers: {
            Authorization: `Bearer ${await admin.getIdToken()}`,
          },
        });
      } catch (error) {
        const err = error as AxiosError;
        if (err.status === 404) {
          // handle error
        }
      } finally {
        setLoading(false);
      }
    },
    [admin, fruit, imgFiles, updateFruit]
  );

  const handleChangeFiles = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setImgFiles(e.target.files);
  }, []);

  const handleChangeValue = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUpdateFruit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  if (!fruit)
    return (
      <div>
        <h2>Ooops! no fruit found</h2>
      </div>
    );
  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <h2 className="title">Edit fruit</h2>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={updateFruit.name}
            onChange={handleChangeValue}
            className="text-input"
          />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            min={0}
            value={updateFruit.price}
            onChange={handleChangeValue}
            className="text-input"
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            min={0}
            name="quantity"
            value={updateFruit.quantity}
            onChange={handleChangeValue}
            className="text-input"
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            placeholder="enter description"
            value={updateFruit.description}
            onChange={handleChangeValue}
            className="text-input"
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
        <div className="img-container">
          {fruit.image.map((img, index) => (
            <img src={img} key={index} width={200} />
          ))}
        </div>
        <div className="btn-container">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Edit"}
          </button>
          <Link to="/admin/stock">Back</Link>
        </div>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  .title {
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
  .img-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 10px;
  }
  .img-container img {
    width: 100%;
    height: 70px;
    object-fit: cover;
    margin-top: 10px;
  }
  .btn-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    align-items: center;
  }
`;
