import axios, { AxiosError } from "axios";
import { useCallback, useState, FormEvent, ChangeEvent, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { ImPriceTags } from "react-icons/im";
import { TbSortAscendingNumbers } from "react-icons/tb";
import { useUserContext } from "../../components/context/UserProvider";
import { FruitReq } from "../../interfaces/Fruit";
import {
  deleteImages,
  instanceOfStorageError,
  uploadImages,
} from "../../utils/storage";
import { useStockContext } from "../../components/admin/StockProvider";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Button from "../../components/Button";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

export default function SingleFruit() {
  const [imgFiles, setImgFiles] = useState<FileList | null>();
  const { id } = useParams();
  const { user, addModal } = useUserContext();
  const { fruits } = useStockContext();
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
        addModal({
          show: true,
          type: "success",
          msg: "Edit successfully!",
          id: Date.now(),
          ms: 4000,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            const msg = (error.response.data as { msg: string }).msg;
            addModal({
              type: "error",
              show: true,
              msg: msg,
              id: Date.now(),
              ms: 4000,
            });
          }
        }
        if (instanceOfStorageError(error)) {
          addModal({
            type: "error",
            show: true,
            msg: "Image must be less than 200kB",
            id: Date.now(),
            ms: 4000,
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
        <Input
          label="Name"
          type="text"
          value={updateFruit.name}
          onChange={handleChangeFiles}
          placeholder="Enter new name..."
          icon={MdOutlineDriveFileRenameOutline}
        />
        <Input
          label="Price"
          type="text"
          min={0}
          value={updateFruit.price}
          onChange={handleChangeValue}
          icon={ImPriceTags}
          placeholder="Enter new price..."
        />
        <Input
          label="Quantity"
          type="number"
          min={0}
          value={updateFruit.quantity}
          onChange={handleChangeValue}
          icon={TbSortAscendingNumbers}
          placeholder="Enter new quantity..."
        />
        <TextArea
          label="Description"
          onChange={handleChangeValue}
          value={updateFruit.description}
        />
        <Input
          label="Image"
          type="file"
          accept="image/*"
          multiple={true}
          onChange={handleChangeFiles}
        />
        <div className="img-container">
          {fruit.image.map((img, index) => (
            <img src={img} key={index} width={200} />
          ))}
        </div>
        <div className="btn-container">
          <Button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "max-content" }}
          >
            {loading ? "Loading..." : "Edit"}
          </Button>
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
  form {
    background-color: var(--mainWhite);
    box-shadow: var(--darkShadow);
    padding: 20px 30px;
    min-width: 500px;
    div {
      margin-bottom: 10px;
    }
    .title {
      color: var(--primaryColor);
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
