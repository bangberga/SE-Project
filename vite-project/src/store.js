import { createStore, compose,  applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import data from './data';

const initialState = {};
const reduce = (state, action) => {
  return { product: data.products };
};
const composeEnhancer = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;
const store = createStore (reducer, initialState, composeEnhancer(applyMiddleware(thunk)));
export default store;