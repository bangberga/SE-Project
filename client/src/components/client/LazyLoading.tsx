import { Dna } from "react-loader-spinner";
import styles from "../../css/loading.module.css";

function LazyLoading() {
  return (
    <div className={styles["lazing-loading-container"]}>
      <Dna
        visible={true}
        height={120}
        width={120}
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );
}

export default LazyLoading;
