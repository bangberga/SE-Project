import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { IoAlertCircleOutline } from "react-icons/io5";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import OrderModal from "./OrderModal";
import ShowHideText from "../ShowHideText";
import { interval } from "../../utils/formatDate";
import { TransactionRes } from "../../interfaces/Transaction";
import { OrderRes } from "../../interfaces/Order";
import { UserRes } from "../../interfaces/User";
import { useUser } from "../context/UserProvider";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

export default function Transaction({
  transaction,
}: {
  transaction: TransactionRes;
}) {
  const { _id, orderId, status, address, phone, description, createdAt } =
    transaction;
  const { user: admin } = useUser();
  const [buyer, setBuyer] = useState<UserRes | null>(null);
  const [order, setOrder] = useState<OrderRes | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCancel = useCallback(async () => {
    if (!admin) return;
    setLoading(true);
    try {
      await axios.patch(
        `${baseUrl}/api/v1/transactions/${_id}`,
        {
          status: "fail",
        },
        {
          headers: {
            Authorization: `Bearer ${await admin.getIdToken()}`,
          },
        }
      );
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [admin]);

  const handleDelete = useCallback(async () => {
    if (!admin) return;
    try {
      await axios.delete(`${baseUrl}/api/v1/transactions/${_id}`, {
        headers: {
          Authorization: `Bearer ${await admin.getIdToken()}`,
        },
      });
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [admin, _id]);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${baseUrl}/api/v1/orders/${orderId}`, {
        signal: controller.signal,
      })
      .then((response) => {
        const {
          data: { order, buyer },
        }: { data: { order: OrderRes; buyer: UserRes } } = response;
        setBuyer(buyer);
        setOrder(order);
      })
      .catch((error) => {
        // handle error
      });
    return () => controller.abort();
  }, [orderId]);

  return (
    <Card>
      <SkeletonTheme
        baseColor="var(--mainGrey)"
        highlightColor="var(--mainWhite)"
      >
        <header>
          <div className="infor">
            {buyer ? (
              <>
                <img
                  className="avatar"
                  src={
                    buyer.photoURL
                      ? buyer.photoURL
                      : "/default profile picture.jpg"
                  }
                />
                <p>
                  <span className="highlight">{buyer.email} </span>
                  <span className="italic">
                    ordered your fruits at {interval(createdAt)}
                  </span>
                </p>
              </>
            ) : (
              <>
                <Skeleton
                  width={30}
                  height={30}
                  borderRadius="var(--mainBorderRadius)"
                />
                <Skeleton width={500} height={10} />
              </>
            )}
          </div>
          <aside>
            <button onClick={handleOpen}>
              <IoAlertCircleOutline />
            </button>
          </aside>
        </header>
        <footer>
          <hr />
          <p>Phone: {phone}</p>
          <p>Address: {address}</p>
          <ShowHideText
            children={
              description ? `Description: ${description}` : "No description"
            }
            max={50}
          />
          <hr />
          <div className="btn-container">
            <p className={`status ${status}`}>{status}</p>
            {status === "fail" ? (
              <button className="btn-warning" onClick={handleDelete}>
                delete
              </button>
            ) : (
              <button className="btn-warning" onClick={handleCancel}>
                {loading ? "loading..." : "cancel"}
              </button>
            )}
          </div>
        </footer>
        {isOpen ? <OrderModal handleClose={handleClose} order={order} /> : ""}
      </SkeletonTheme>
    </Card>
  );
}

const Card = styled.article`
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: var(--mainWhite);
  border-radius: var(--mainBorderRadius);
  p {
    margin: 0;
  }
  hr {
    margin: 10px 0;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .infor {
      display: flex;
      align-items: center;
      column-gap: 10px;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: var(--mainBorderRadius);
      }
      p {
        font-size: smaller;
      }
    }
    aside {
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--mainRed);
        font-weight: bolder;
        background: transparent;
        border: none;
        font-size: larger;
        cursor: pointer;
      }
    }
  }
  footer {
    p {
      font-size: smaller;
    }
    .btn-container {
      display: flex;
      justify-content: space-between;
      .status {
        text-align: end;
        text-transform: uppercase;
        &.pending {
          color: orange;
        }
        &.success {
          color: green;
        }
        &.fail {
          color: red;
        }
      }
    }
  }
`;
