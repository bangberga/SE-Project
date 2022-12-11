import styled from "styled-components";
import { RotatingLines } from "react-loader-spinner";
import { useTransactions } from "../../components/admin/TransactionProvider";
import Transaction from "../../components/admin/Transaction";

export default function Transactions() {
  const { transactions, loading } = useTransactions();

  return (
    <Wrapper>
      <h2 className="title">Transactions</h2>
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
      ) : transactions.length === 0 ? (
        <h1 className="msg">No transaction found</h1>
      ) : (
        <div className="transactions-container">
          {transactions.map((transaction) => (
            <Transaction key={transaction._id} transaction={transaction} />
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
`;
