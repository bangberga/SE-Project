import { useState, useCallback } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import styled from "styled-components";
import { FruitRes } from "../../interfaces/Fruit";
import { useProducts } from "./ProductsProvider";

export default function AddModal({
  fruit,
  isOpen,
  closeModal,
}: {
  fruit: FruitRes;
  isOpen: boolean;
  closeModal: () => void;
}) {
  const { quantity } = fruit;
  const { addToCart } = useProducts();
  const [count, setCount] = useState<number>(1);

  const increase = useCallback(() => {
    setCount((prev) => (prev >= quantity ? prev : prev + 1));
  }, [quantity]);

  const decrease = useCallback(() => {
    setCount((prev) => (prev <= 1 ? prev : prev - 1));
  }, []);

  return (
    <Wrapper
      style={{ transform: `${isOpen ? "translateY(0)" : "translateY(100%)"}` }}
    >
      <div className="btn-container">
        <button onClick={increase}>
          <AiOutlinePlus />
        </button>
        <span>{count}</span>
        <button onClick={decrease}>
          <AiOutlineMinus />
        </button>
      </div>
      {quantity === 0 ? (
        <p className="warning">This fruit is out of stock</p>
      ) : (
        ""
      )}
      <div className="text-btn-container">
        <span
          onClick={() => {
            if (count > quantity) return;
            addToCart({ ...fruit, purchaseQuantity: count });
          }}
        >
          Add
        </span>
        <span onClick={closeModal}>Back</span>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: var(--mainBorderRadius);
  background-color: var(--mainWhite);
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 10;
  transition: var(--mainTransition);
  .warning {
    color: var(--mainRed);
    font-size: smaller;
    font-weight: bolder;
  }
  .text-btn-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    span {
      cursor: pointer;
    }
  }
`;
