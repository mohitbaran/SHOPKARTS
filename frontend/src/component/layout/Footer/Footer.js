import React from 'react'
import playstore from '../../../images/playstore.png';
import appstore from '../../../images/Appstore.png';
import logo from '../../../images/logo.png'
import './Footer.css'

const Footer = () => {
  return (
    <footer id='footer'>
        <div className='leftFooter'>
            <h4>LINKS FOR OUR APP</h4>
            <p>Download the App From Appstore and PlayStore</p>
            <img src={playstore} alt ='playstore' />
            <img src={appstore} alt='appstore' />
        </div>

        <div className='midFooter'>
            {/* <h1>SHOPKART.</h1> */}
            <img src={logo} alt='logo' />
            <h2>Pure Desh Ka Bazaar</h2>

            <p>Copyrights 2022 &copy; MohitBaran&trade;</p>
        </div>

        <div className="rightFooter">
            <h4>Follow Us</h4>
              <a href='https://facebook.com/'>Facebook</a>
              <a href='https://instagram.com/'>Instagram</a>
              <a href='https://twitter.com/'>Twitter</a>
        </div>
    </footer>
  )
}

export default Footer