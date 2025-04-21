import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/API/login', { ...formData })
        .then((res) => {
          console.log('Data saved', res);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('name', res.data.name);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          // alert(res.data.message)
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "User Login Success",
            showConfirmButton: false,
            timer: 1500
          });

  
          navigate('/taskform');
          setFormData([]);
        })
        .catch((err) => {
          console.log('Error saving data', err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.message,
  
          });
        });
      console.log('Form Data Submitted: ', formData);
      };
     
  return (
   <>
   <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 rounded shadow border bg-white" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>

          <div className="text-center mt-3">
              <p className="mb-0">Don,t have an account?<Link to="/" className="text-primary">SignUp</Link></p>
          </div>
        </form>
      </div>
    </div>

   </>
  )
}

export default Login
