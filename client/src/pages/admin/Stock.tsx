import { Link } from "react-router-dom";
import styled from "styled-components";
import { useStock } from "../../components/admin/StockProvider";
import Fruit from "../../components/admin/Fruit";

export default function FruitsContainer() {
  const { fruits } = useStock();
  return (
    <Wrapper>
      <Link to="/admin/stock/new" className="btn-primary">
        Post new fruit
      </Link>
      <h2 className="title">Your stock</h2>
      <div className="underline"></div>
      {fruits.length === 0 ? (
        <h1 className="msg">Your stock is empty!</h1>
      ) : (
        <div className="fruits-container">
          {fruits.map((fruit) => (
            <Fruit key={fruit._id} {...fruit} />
          ))}
        </div>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  margin: 0 2rem;
  .title {
    margin: 10px 0;
    text-align: center;
  }
  .msg {
    margin: 50px 0;
    font-size: 3rem;
    text-align: center;
  }
  .fruits-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
    gap: 20px 20px;
  }
  .loading-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;
