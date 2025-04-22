import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Header from './Header';
import axios from 'axios';
import Swal from 'sweetalert2'


const TaskForm = () => {
    const navigate = useNavigate();
    const [sheetLink, setSheetLink] = useState('');
    const [user,setUser]= useState([])
  const [taskData, setTaskData] = useState({
    taskName: '',
    description: '',
    assignTo: '',
    submitDate: ''
  });

  const handleSheetChange = (e) => setSheetLink(e.target.value);

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const getAllUsers = async()=>{
    const allUser = await axios.get('http://localhost:3000/API/getUser')
    console.log(allUser.data.users);
    setUser(allUser.data.users)
    

  };

  useEffect(()=>{
    getAllUsers();
  },[])


  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/API/createTask', {...taskData},{
          headers: {
            'authorization': `Bearer ${token}`
          }
        });
         Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Task Add",
            showConfirmButton: false,
            timer: 1500
          });
          navigate('/showtask');

      
    } catch (error) {
       Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message,

        });
    }
 
    // Add API call or logic here
  };

  const handleGoogleSheetUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/API/uploadFromSheet', {
        sheetUrl: sheetLink
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Task Add",
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/showtask');
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,

      });
    }
  };

 
  return (
    <>
    <Header/>
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Create Task By Link</h3>

      {/* Google Sheet Selection */}
      <form className="mb-4 p-3 border rounded shadow-sm bg-light">
        <div className="mb-3">
          <label htmlFor="sheetLink" className="form-label">Select Google Sheet Link</label>
          <input type="text" name="" id=""  className='form-control' onChange={(e) => setSheetLink(e.target.value)}value={sheetLink}/>
         
        </div>
        <button type="button" className="btn btn-primary w-100" onClick={handleGoogleSheetUpload}>Submit Task</button>

      </form> 

      {/* Task Details */}
      <h3 className="mb-4 text-center">Create Task Manually</h3>

      <form className="p-4 border rounded shadow bg-white" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="taskName" className="form-label">Task Name</label>
          <input type="text" className="form-control" id="taskName" name="taskName" value={taskData.taskName} onChange={handleTaskChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea className="form-control" id="description" name="description" rows="3" value={taskData.description} onChange={handleTaskChange} required></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="assignTo" className="form-label">Assign To</label>
          <select  className='form-control' name="assignTo" value={taskData.assignTo} onChange={handleTaskChange} required>
            <option value="">Select User</option>
            {user.map((item)=>(
            <option value={item._id}>{item.email}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="submitDate" className="form-label">Submit Date</label>
          <input type="date" className="form-control" id="submitDate" name="submitDate" value={taskData.submitDate} onChange={handleTaskChange} required />
        </div>

        <button type="submit" className="btn btn-primary w-100">Submit Task</button>

       
      </form>
    </div>

    </>
  )
}

export default TaskForm