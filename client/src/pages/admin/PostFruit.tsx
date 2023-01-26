import axios, { AxiosError } from "axios";
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { TbSortAscendingNumbers } from "react-icons/tb";
import { ImPriceTags } from "react-icons/im";
import { useUserContext } from "../../components/context/UserProvider";
import { instanceOfStorageError, uploadImages } from "../../utils/storage";
import { FruitReq } from "../../interfaces/Fruit";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Button from "../../components/Button";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

export default function PostFruitModal() {
  const [imgFiles, setImgFiles] = useState<FileList | null>();
  const { user, addModal } = useUserContext();
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
      if (!name || !price || !quantity || !description || !user) return;
      if (isNaN(Number(price.value))) return;
      const body: FruitReq = {
        name: name.value,
        quantity: Number(quantity.value),
        price: Number(price.value),
      };
      if (description.value) body.description = description.value;
      try {
        if (imgFiles?.length) {
          const fileNames = await uploadImages(imgFiles);
          body.image = fileNames;
        }
        await axios.post(`${baseUrl}/api/v1/fruits`, body, {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });
        addModal({
          show: true,
          type: "success",
          msg: "New fruit added!",
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
      }
      setLoading(false);
    },
    [imgFiles, user]
  );

  const handleChangeFiles = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setImgFiles(e.target.files);
  }, []);

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <h2 className="title">Post new fruit</h2>
        <Input
          type="text"
          ref={nameRef}
          label="Name"
          icon={MdOutlineDriveFileRenameOutline}
          placeholder="Enter name..."
        />
        <Input
          label="Price"
          type="text"
          min={0}
          ref={priceRef}
          icon={ImPriceTags}
          placeholder="Enter price..."
        />
        <Input
          label="Quantity"
          type="number"
          min={0}
          ref={quantityRef}
          icon={TbSortAscendingNumbers}
          placeholder="Enter quantity..."
        />
        <TextArea label="Description" ref={descriptionRef} />
        <Input
          label="Image"
          type="file"
          accept="image/*"
          multiple={true}
          onChange={handleChangeFiles}
        />
        <div className="btn-container">
          <Button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "max-content" }}
          >
            {loading ? "Loading..." : "Post"}
          </Button>
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
  form {
    background-color: var(--mainWhite);
    box-shadow: var(--darkShadow);
    padding: 20px 30px;
    min-width: 500px;
    div {
      margin-bottom: 10px;
    }
    .btn-container {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      align-items: center;
    }
  }
`;
