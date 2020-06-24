import React from 'react'
import { Link } from 'react-router-dom'
import hamIcon from '../assets/media/open-menu.png'

function Navbar() {
  return (
    <div className="flex flex-row justify-between px-8 py-4">
      <h1 className="text-2xl"><Link to="/">Trip Wallet</Link></h1>
      <div className="ham-icon">
        <img className="h-8 w-9" src={hamIcon} alt="toggle menu" />
      </div>
    </div>
  )
}

export default Navbar
