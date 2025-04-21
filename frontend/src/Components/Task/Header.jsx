import React from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from './../Auth/Login';



const Header = () => {
const islogin = localStorage.getItem('token');
const name = localStorage.getItem('name');

const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.clear();
      navigate('/login');
    }

  return (
   <>
   {islogin ?(
    <header className="bg-primary text-white py-3 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">

        <h4 className="mb-0">Hllo {name}</h4>
        <div>
          <Link to='/taskform' className="btn btn-light me-2">Create Task</Link>
          <Link to='/showtask' className="btn btn-light me-2">Tasks</Link>
          {islogin ?(
            <button type='button' className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          ):(
          <Link to='/' className="btn btn-outline-light">SignUp</Link>
          )}
        </div>
      </div>
    </header>

   ):(
    <Login/>
   )}
        </>
  )
}

export default Header
