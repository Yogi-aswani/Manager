import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import axios from 'axios';
const Signup = () => {
  const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
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
        axios.post('http://localhost:3000/API/signup', { ...formData })
        .then((res) => {
          console.log('Data saved', res);
          // alert(res.data.message)
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "User SignUp Success",
            showConfirmButton: false,
            timer: 1500
          });
  
          navigate('/login');
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
            <h2 className="mb-4 text-center">Signup Form</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
            </div>

            <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input type="tel" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" required />
            </div>

            <button type="submit" className="btn btn-primary w-100">Sign Up</button>

            <div className="text-center mt-3">
                <p className="mb-0">Already have an account? <Link to="/login" className="text-primary">Login</Link></p>
            </div>
            </form>
        </div>
        </div>


    </>
  )
}

export default Signup