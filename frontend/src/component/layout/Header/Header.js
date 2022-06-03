import React from 'react'
import {ReactNavbar} from "overlay-navbar";
import logo from "../../../images/logo.png";

const options={
  burgerColorHover: '#f0451a',
  logo,
  logoWidth: "18vmax",
  navColor1: "#d1fffa",
  logoHoverSize: "10px",
  logoHoverColor: "#e6660b",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Padding: '0',
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.2vmax",
  link1Color: "rgba(35, 35, 35,0.8)",
  nav1justifyContent: "space-evenly",
  nav3justifyContent: "space-evenly",
  nav4justifyContent: "space-evenly",
  nav2justifyContent: "space-evenly",
  link1ColorHover: "#eb4034",
  link1Margin: "1vmax",
  profileIconUrl: "/login",
  profileIconColor: "rgba(35, 35, 35,0.8)",
  searchIconColor: "rgba(35, 35, 35,0.8)",
  cartIconColor: "rgba(35, 35, 35,0.8)",
  profileIconColorHover: "#eb4034",
  searchIconColorHover: "#eb4034",
  cartIconColorHover: "#eb4034",
  cartIconMargin: "1vmax",
}

const Header = () => {
  return (
    <ReactNavbar {...options}/>
  )
}

export default Header