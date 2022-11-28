import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Rating from '../components/Rating';

function HomeScreen(props) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const category = props.match.params.id ? props.match.params.id : '';
  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProducts(category));

    return () => {
      //
    };
    fecthData();
  },[]  );
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
}
