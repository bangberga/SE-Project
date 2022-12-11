import { useCallback, useState } from "react";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FruitRes } from "../../interfaces/Fruit";
import { formatDate } from "../../utils/formatDate";
import styled from "styled-components";
import ShowHideText from "../ShowHideText";
import AddModal from "./AddModal";
import ImageGallery from "../ImageGallery";

export default function Fruit({ fruit }: { fruit: FruitRes }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const { name, price, quantity, createdAt, image, description } = fruit;

  return (
    <Card>
      <ImageGallery
        second={3}
        images={image.map((url) => (
          <LazyLoadImage
            src={url}
            placeholderSrc={url}
            alt="fruit image"
            className="item-img"
            effect="blur"
          />
        ))}
      />
      <div className="body">
        <div>
          <header className="header">
            <h3 className="name">{name}</h3>
            <p className="price">${price}</p>
          </header>
          <p>{quantity} kg left</p>
        </div>
        <hr />
        <div className="description">
          <ShowHideText children={description} max={15} />
        </div>
        <hr />
        <div className="time">
          <p>Created at: {formatDate(createdAt)}</p>
        </div>
        <div className="btn-container">
          <button onClick={openModal} className="add-btn">
            <MdOutlineAddShoppingCart />
          </button>
        </div>
      </div>
      <AddModal fruit={fruit} isOpen={isOpen} closeModal={closeModal} />
      {isOpen ? <div className="shadow"></div> : ""}
    </Card>
  );
}

const Card = styled.article`
  background-color: var(--mainWhite);
  position: relative;
  overflow: hidden;
  .lazy-load-image-background.blur.lazy-load-image-loaded {
    width: 100%;
  }
  p,
  h3 {
    margin: 0;
  }
  .name {
    text-transform: capitalize;
    letter-spacing: 0;
  }
  div {
    margin-bottom: 5px;
  }
  .body {
    padding: 10px;
  }
  .item-img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }
  .header {
    display: flex;
    justify-content: space-between;
  }
  .price {
    color: var(--primaryColor);
    background-color: var(--primaryLightColor);
    padding: 0 10px;
    border-radius: var(--mainBorderRadius);
    font-weight: 400;
  }
  .description {
    font-size: small;
  }
  .time {
    font-size: x-small;
    font-weight: 400;
    font-style: italic;
  }
  .btn-container {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      background-color: var(--primaryLightColor);
      color: var(--primaryColor);
      border: none;
      cursor: pointer;
      font-weight: bolder;
    }
  }
  .shadow {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 5;
  }
`;
