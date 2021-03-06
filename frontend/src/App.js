import './App.css';
import Header from "./component/layout/Header/Header.js";
import {BrowserRouter as Router, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import WebFont from 'webfontloader';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products.js';
import Search from './component/Product/Search.js'
import LoginSignUp from './component/User/LoginSignUp';
import store from './store';
import {loadUser} from './actions/userAction';
import UserOptions from './component/layout/Header/UserOptions.js' 
import { useSelector } from 'react-redux';
import Profile from './component/User/Profile.js'
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile.js';

function App() {

  const {isAuthenticated, user}= useSelector(state => state.user);
  
  useEffect(()=>{
WebFont.load({
  google:{
    families:['Roboto','Droid Sans', 'Chilanka'],
  }
});
  store.dispatch(loadUser());
  },[]);

  return (
    <Router>
      
      <Header />

      {isAuthenticated && <UserOptions user={user}  />}
      
      <Route exact path='/' component={Home} />
      <Route exact path='/product/:id' component={ProductDetails} />
      <Route exact path='/products' component={Products} />
      <Route exact path='/search' component={Search} />
      <Route path='/products/:keyword' component={Products} />
      <Route exact path='/login' component={LoginSignUp} />

      <ProtectedRoute exact path='/account' component={Profile} />

      <ProtectedRoute exact path='/me/update' component={UpdateProfile}  />
      
      <Footer />
    </Router>
  );
}

export default App;
