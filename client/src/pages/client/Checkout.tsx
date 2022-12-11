import axios, { AxiosError } from "axios";
import { FormEvent, useCallback, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useUser } from "../../components/context/UserProvider";
import { useProducts } from "../../components/client/ProductsProvider";
import { FilteredCart } from "../../interfaces/Cart";
import { Modal } from "../../interfaces/Modal";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

export default function Checkout({
  filteredCart,
  handleClose,
}: {
  filteredCart: FilteredCart;
  handleClose: () => void;
}) {
  const { user: client } = useUser();
  const { deleteFromCartByOwner } = useProducts();
  const [loading, setLoading] = useState<boolean>(false);
  const { owner, cart } = filteredCart;
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const [modal, setModal] = useState<Modal>({ show: false, msg: "" });

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      if (!client) return;
      const phone = phoneRef.current;
      const address = addressRef.current;
      const description = descriptionRef.current;
      if (!phone || !address || !description) return;
      e.preventDefault();
      setLoading(true);
      try {
        await axios.post(
          `${baseUrl}/api/v1/transactions`,
          {
            listOfFruits: cart.map(({ _id, purchaseQuantity }) => ({
              fruitId: _id,
              quantity: purchaseQuantity,
            })),
            adminId: owner,
            phone: phone.value,
            address: address.value,
            description: description.value,
          },
          {
            headers: {
              Authorization: `Bearer ${await client.getIdToken()}`,
            },
          }
        );
        alert("Thanks for buying!");
        setModal({ show: true, type: "success", msg: "Successfully!" });
        deleteFromCartByOwner(owner);
      } catch (error) {
        const err = error as AxiosError;
        const { response } = err;
        const data = response?.data;
        if (data) {
          setModal({
            show: true,
            type: "error",
            msg: (data as { msg: string }).msg,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [client, owner]
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

  return (
    <Wrapper onClick={handleClose}>
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="title">Enter your information</h2>
          <div>
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              name="phone"
              className="text-input"
              ref={phoneRef}
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              className="text-input"
              ref={addressRef}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea name="description" ref={descriptionRef}></textarea>
          </div>
          <div>
            {modal.show ? (
              <p className={modal.type ? modal.type : ""}>{modal.msg}</p>
            ) : (
              ""
            )}
          </div>
          <div>
            <button
              type="submit"
              className="btn-primary block-btn"
              disabled={loading}
            >
              {loading ? "Loading..." : "Payment in cash"}
            </button>
            {/* <button>Paypal</button> */}
          </div>
          <div className="text-btn-container">
            <span onClick={handleClose}>Back</span>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 20;
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      margin: 0;
    }
    form {
      background-color: var(--mainWhite);
      padding: 20px 30px;
      border-radius: var(--mainBorderRadius);
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
      .text-btn-container {
        display: flex;
        justify-content: flex-end;
        span {
          cursor: pointer;
        }
      }
      textarea {
        width: 100%;
        height: 50px;
        resize: none;
        padding: 5px;
      }
      .block-btn {
        width: 100%;
        margin: 5px 0;
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
    }
  }
`;
