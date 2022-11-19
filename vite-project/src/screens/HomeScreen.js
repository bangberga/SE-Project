import React, {useState} from "react";
import Product from '../components/Product';
import data from '../data';

export default function HomeScreen(){
  const [product, setProducts]= useState([]);
  const [loading, setLoanding] = useState(false);
  useEffect(() =>{
    const fecthData = async () => {
      try{
setLoading(true);
const { data  } = await axios.get('/api/products');
setLoading(false);
setProducts(data);
      }catch(err){
        setError(err.message);
        setLoading(false);
      }
    };
    fecthData();
  },[]  );
  return (
    <div>
      {loading ?(
        <LoadingBox></LoadingBox>
      ): error ? (
        <MessageBox>{error}</MessageBox>
      ): <div className="row center">
      {data.products.map((product) =>(
        <Product key={product._id} product={product}></Product>
      ) )}
    </div>
      }
      </div>

  );
}
