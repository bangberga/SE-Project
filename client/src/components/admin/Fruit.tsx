import { Link } from "react-router-dom";
import { FruitRes } from "../../interfaces/Fruit";
import { useStock } from "./StockProvider";
import { formatDate, interval } from "../../utils/formatDate";
import styled from "styled-components";
import ShowHideText from "../ShowHideText";

export default function Fruit({
  name,
  price,
  quantity,
  createdAt,
  updatedAt,
  image,
  _id,
  description,
}: FruitRes) {
  const { handleDeleteFruit } = useStock();
  return (
    <Card>
      <img src={image[0]} alt="fruit image" className="item-img" />
      <div className="body">
        <div>
          <header className="header">
            <h3>{name}</h3>
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
          {updatedAt !== createdAt && <p>Updated at: {interval(updatedAt)}</p>}
        </div>
        <div className="btn-container">
          <span
            onClick={(e) => handleDeleteFruit(_id)}
            className="btn-text-delete"
          >
            Delete
          </span>
          <Link className="btn-text-link" to={`/admin/stock/edit/${_id}`}>
            Detail
          </Link>
        </div>
      </div>
    </Card>
  );
}

const Card = styled.article`
  background-color: var(--mainWhite);
  p,
  h3 {
    margin: 0;
  }
  h3 {
    text-transform: capitalize;
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
  }
  .btn-text-delete,
  .btn-text-link {
    transition: var(--mainTransition);
    cursor: pointer;
    :hover {
      font-weight: bolder;
    }
  }
  .btn-text-delete {
    color: var(--mainRed);
  }
  .btn-text-link {
    color: var(--primaryColor);
  }
`;
