import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { OrderRes } from "../../interfaces/Order";

export default function OrderModal({
  handleClose,
  order,
}: {
  handleClose: () => void;
  order: OrderRes | null;
}) {
  return (
    <Wrapper onClick={handleClose}>
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <h3 className="title">Ordered fruits</h3>
        <hr />
        <div className="fruits-container">
          {order ? (
            order.listOfFruits.map((fruit, index) =>
              fruit.fruitId ? (
                <article className="item" key={fruit.fruitId._id}>
                  <header>
                    <LazyLoadImage
                      src={fruit.fruitId.image[0]}
                      placeholderSrc={fruit.fruitId.image[0]}
                      alt="fruit photo"
                      className="photo"
                      effect="blur"
                    />
                  </header>
                  <footer>
                    <p className="highlight">{fruit.fruitId.name}</p>
                    <p>Quantity: {fruit.quantity}</p>
                  </footer>
                </article>
              ) : (
                <p className="del-msg italic" key={index}>
                  This fruit has been deleted !
                </p>
              )
            )
          ) : (
            <>
              <article className="skeleton">
                <Skeleton width={50} height={50} />
                <Skeleton width={100} height={20} count={2} />
              </article>
              <article className="skeleton">
                <Skeleton width={50} height={50} />
                <Skeleton width={300} height={20} count={2} />
              </article>
              <article className="skeleton">
                <Skeleton width={50} height={50} />
                <Skeleton width={250} height={20} />
              </article>
            </>
          )}
        </div>
        <div className="btn-container">
          <span className="text-btn" onClick={handleClose}>
            Back
          </span>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  .container {
    background: var(--mainWhite);
    padding: 1rem;
    border-radius: var(--mainBorderRadius);
    .title {
      margin: 0;
    }
    hr {
      margin: 10px 0;
    }
    .fruits-container {
      display: grid;
      row-gap: 10px;
      .photo {
        width: 50px;
        height: 50px;
        border-radius: var(--mainBorderRadius);
        object-fit: cover;
      }
      .item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        column-gap: 10px;
        p {
          text-transform: capitalize;
        }
      }
      .del-msg {
        color: var(--mainRed);
        font-size: small;
      }
      .skeleton {
        display: grid;
        grid-template-columns: 50px 1fr;
        column-gap: 10px;
      }
    }
  }
  .btn-container {
    display: flex;
    justify-content: flex-end;
    .text-btn {
      cursor: pointer;
      color: var(--primaryColor);
    }
  }
`;
