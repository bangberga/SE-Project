import axios, { AxiosError } from "axios";
import { FormEvent, useCallback, useState, useRef } from "react";
import styled from "styled-components";
import { useUserContext } from "../../components/context/UserProvider";
import { useProductsContext } from "../../components/client/ProductsProvider";
import { FilteredCart } from "../../interfaces/Cart";
import Input from "../../components/Input";
import { AiFillPhone } from "react-icons/ai";
import { GrLocation } from "react-icons/gr";
import TextArea from "../../components/TextArea";
import Button from "../../components/Button";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

export default function Checkout({
  filteredCart,
  handleClose,
}: {
  filteredCart: FilteredCart;
  handleClose: () => void;
}) {
  const { user: client, addModal } = useUserContext();
  const { deleteFromCartByOwner } = useProductsContext();
  const [loading, setLoading] = useState<boolean>(false);
  const { owner, cart } = filteredCart;
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

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
        addModal({
          id: Date.now(),
          show: true,
          type: "success",
          msg: "Successfully!",
          ms: 4000,
        });
        deleteFromCartByOwner(owner);
      } catch (error) {
        const err = error as AxiosError;
        const { response } = err;
        const data = response?.data;
        if (data) {
          addModal({
            id: Date.now(),
            show: true,
            type: "error",
            msg: (data as { msg: string }).msg,
            ms: 4000,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [client, owner]
  );

  return (
    <Wrapper onClick={handleClose}>
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="title">Enter your information</h2>
          <Input label="Phone" type="text" ref={phoneRef} icon={AiFillPhone} />
          <Input
            label="Address"
            type="text"
            ref={addressRef}
            icon={GrLocation}
          />
          <TextArea label="Description" ref={descriptionRef} />
          <div>
            <Button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              {loading ? "Loading..." : "Payment in cash"}
            </Button>
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
      .title {
        color: var(--primaryColor);
      }
      .text-btn-container {
        display: flex;
        justify-content: flex-end;
        span {
          cursor: pointer;
        }
      }
    }
  }
`;
