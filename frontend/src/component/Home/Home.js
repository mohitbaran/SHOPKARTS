import React, { Fragment, useEffect } from 'react'
import { CgMouse } from 'react-icons/all'
import MetaData from '../layout/MetaData';
import './Home.css';
import ProductCard from './ProductCard.js';
import {clearErrors, getProduct} from '../../actions/productActions';
import {useSelector, useDispatch} from 'react-redux';
import Loader from "../layout/Loader/Loader" ;
import { useAlert } from 'react-alert';

const Home = () => {
    const alert= useAlert()
    const dispatch = useDispatch();
    const {loading, error, products} = useSelector(state => state.products)
    
    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    },[dispatch, error,alert]);
    
  return (
    <Fragment>
        {loading ? <Loader />: 
              <Fragment>
                  <MetaData title='SHOPKARTS' />
                  <div className="banner">
                      <p>Welcome To ShopKarts</p>
                      <h1>Have A Look At The Products</h1>

                      <a href='#container'>
                          <button>
                              Browse <CgMouse />
                          </button>
                      </a>
                  </div>

                  <h2 className="homeHeading">Products at a Glance</h2>

                  <div className="container" id="container">

                      {products && products.map(product => (<ProductCard product={product} />))}

                  </div>
              </Fragment>}

    </Fragment>
  );
  
}

export default Home