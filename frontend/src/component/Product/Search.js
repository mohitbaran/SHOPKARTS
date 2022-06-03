import React, { Fragment, useState } from 'react'
import MetaData from '../layout/MetaData';
import './Search.css';

const Search = ({history}) => {
    const [keyword, setKeyword] = useState("");

    const searchSubmitHandler = (e)=>{
        e.preventDefault();

        if(keyword.trim()){
            history.push(`/products/${keyword}`);
        }
        else{
            history.push('/products');
    }
}
  return (
    <Fragment>
      <MetaData title={`SEARCH -- SHOPKARTS`} />
        <form className="searchBox" onSubmit={searchSubmitHandler}>
            <input type='text' placeholder='Search For Your Product.....'
            onChange={(e)=> setKeyword(e.target.value)}  />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="submit" value='Search' />
        </form>
    </Fragment>
  )
}

export default Search