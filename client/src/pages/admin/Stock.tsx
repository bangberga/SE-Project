import { Link } from "react-router-dom";
import styled from "styled-components";
import { useStock } from "../../components/admin/StockProvider";
import Fruit from "../../components/admin/Fruit";
import { RotatingLines } from "react-loader-spinner";

export default function FruitsContainer() {
  const { fruits, loading } = useStock();

  return (
    <Wrapper>
      <Link to="/admin/stock/new" className="btn-primary">
        Post new fruit
      </Link>
      <h2 className="title">Your stock</h2>
      <div className="underline"></div>
      {loading ? (
        <div>
          <div className="loading-container">
            <RotatingLines
              strokeColor="#476a2e"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          </div>
        </div>
      ) : fruits.length === 0 ? (
        <h1 className="msg">Your stock is empty!</h1>
      ) : (
        <div className="fruits-container">
          {fruits.map((fruit) => (
            <Fruit key={fruit._id} fruit={fruit} />
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
  .loading-container {
    width: 100%;
    display: flex;
    justify-content: center;
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
