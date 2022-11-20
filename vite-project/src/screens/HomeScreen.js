import React, {useState} from "react";
import Product from '../components/Product';
import Product from '../components/MessageBox';
import Product from '../components/LoadingBox';
import data from '../data';

export default function HomeScreen(){
  const [product, setProducts]= useState([]);
  const [loading, setLoanding] = useState(false);
  cont [error, setError] = useState(false);
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
  },[]  )};
  return (
    <div>
      {loading ?(
        <LoadingBox></LoadingBox>
      ): error ? (
        <MessageBox variant = 'danger'>{error}</MessageBox>
      ): <div className="row center">
      {data.products.map((product) =>(
        <Product key={product._id} product={product}></Product>
      ) )}
    </div>
      }
      </div>

   );
