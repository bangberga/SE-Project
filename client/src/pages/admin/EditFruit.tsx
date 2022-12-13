import axios, { AxiosError } from "axios";
import {
  useCallback,
  useState,
  FormEvent,
  ChangeEvent,
  useMemo,
  useEffect,
} from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useUser } from "../../components/context/UserProvider";
import { FruitReq } from "../../interfaces/Fruit";
import {
  deleteImages,
  instanceOfStorageError,
  uploadImages,
} from "../../utils/storage";
import { useStock } from "../../components/admin/StockProvider";
import { Modal } from "../../interfaces/Modal";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

export default function SingleFruit() {
  const [imgFiles, setImgFiles] = useState<FileList | null>();
  const { id } = useParams();
  const { user } = useUser();
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
  const [modal, setModal] = useState<Modal>({ show: false, msg: "" });

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      setLoading(true);
      e.preventDefault();
      if (!user || !fruit || fruit.owner !== user.uid) return;
      if (isNaN(Number(fruit.price))) return;
      const { name, quantity, price, description } = updateFruit;
      const body: FruitReq = { name, price, quantity, description };
      try {
        if (imgFiles?.length) {
          await deleteImages(
            fruit.image.filter((img) => img !== "/unavailable image.jpg")
          );
          body.image = await uploadImages(imgFiles);
        }
        await axios.patch(`${baseUrl}/api/v1/fruits/${id}`, body, {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });
        setModal({ show: true, type: "success", msg: "Edit successfully!" });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            const msg = (error.response.data as { msg: string }).msg;
            setModal({ type: "error", show: true, msg: msg });
          }
        }
        if (instanceOfStorageError(error)) {
          setModal({
            type: "error",
            show: true,
            msg: "Image must be less than 200kB",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [user, fruit, imgFiles, updateFruit]
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

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (modal.show) {
      timeout = setTimeout(() => {
        setModal((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [modal.show]);

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
        <div>
          {modal.show ? (
            <p className={modal.type ? modal.type : ""}>{modal.msg}</p>
          ) : (
            ""
          )}
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
  p {
    margin: 0;
  }
  form {
    background-color: var(--mainWhite);
    box-shadow: var(--darkShadow);
    padding: 20px 30px;
    div {
      margin-bottom: 10px;
    }
    label {
      font-weight: bold;
      color: var(--primaryColor);
      display: block;
    }
    .title {
      color: var(--primaryColor);
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
  }
`;
