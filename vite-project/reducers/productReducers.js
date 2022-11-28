import { PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCESS } from "../src/constants/productConstants";
import {
    FETCH_PRODUCTS,
    FILTER_PRODUCTS_BY_SIZE,
    ORDER_PRODUCTS_BY_PRICE,
  } from "../types";
  
  export const productsReducer = (state = {}, action) => {
    switch (action.type) {
      case FILTER_PRODUCTS_BY_SIZE:
        return {
          ...state,
          size: action.payload.size,
          filteredItems: action.payload.items,
        };
      case ORDER_PRODUCTS_BY_PRICE:
        return {
          ...state,
          sort: action.payload.sort,
          filteredItems: action.payload.items,
        };
      case FETCH_PRODUCTS:
        return { items: action.payload, filteredItems: action.payload };
      default:
        return state;
    }
  };
  
  export const productDetailsReducer = (
    state = { product : {}, loading: true},
    action
    ) => {
        switch (action.type){
            case PRODUCT_DETAILS_REQUEST:
                return { loading: true };
            case PRODUCT_DETAILS_SUCESS:
                return { loading:false, product: action.payload};
            case PRODUCT_DETAILS_FAIL:
                return { loading: false, error: action.payload };   
            default:
                return state; 
        }
    }