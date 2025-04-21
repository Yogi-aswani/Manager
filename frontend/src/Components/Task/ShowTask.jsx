import React, { useState, useEffect } from 'react';
import { FaTrash, FaCheckCircle ,FaEdit} from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2'
import Header from './Header';
const ShowTask = () => {
   const islogin = localStorage.getItem('token');

  const [myTask, setmyTask] = useState([]);
  const [myAssignTask, setmyAssignTask] = useState([]);



  const getMyTask = async()=>{
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:3000/API/getMyTask', {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        setmyTask(response.data.tasks);
    } catch (error) {
        console.error("Error fetching cart:", error);
    }
  }



    const handleComplete = async (id, value) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(
          'http://localhost:3000/API/updateTaskStatus',
          { taskId : id, status: value === 'Pending' ? 'Completed' : 'Pending' },
          {
            headers: {
              'authorization': `Bearer ${token}`
            }
          }
        );
        console.log(response.data);
        if (response.data) {
          Swal.fire('Success', 'Task status updated successfully', 'success');
          getMyTask();
          getMyAssignTask();

        } else {
          Swal.fire('Error', 'Failed to update task status', 'error');
        }
      } catch (error) {
        console.error("Error updating task status:", error);
        Swal.fire('Error', 'An error occurred while updating task status', 'error');
      }
    };


    const handleDelete = async (id) => {
      const token = localStorage.getItem('token');
      try {
      const response = await axios.get(`http://localhost:3000/API/deleteTask/${id}`, {
        headers: {
        'authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        Swal.fire('Deleted!', 'Task has been deleted successfully.', 'success');
        getMyTask(); 
        getMyAssignTask();
      } else {
        Swal.fire('Error', 'Failed to delete task', 'error');
      }
      } catch (error) {
      console.error("Error deleting task:", error);
      Swal.fire('Error', 'An error occurred while deleting the task', 'error');
      }
    };
  
    const getMyAssignTask = async()=>{
      const token = localStorage.getItem('token');
      try {
          const response = await axios.get('http://localhost:3000/API/getMyAssignTask', {
              headers: {
                  'authorization': `Bearer ${token}`
              }
          });
          setmyAssignTask(response.data.Assigntasks);
      } catch (error) {
          console.error("Error fetching cart:", error);
      }
    }


    useEffect(() => {
      getMyTask();
      getMyAssignTask();
    }, []);

  return (
   <>
   <Header/>
  <div className="container mt-5">
        <h3 className="mb-4 text-center">My Task</h3>
        <div className="table-responsive">
          <table className="table table-bordered table-striped shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Assigned By</th>
                <th>Submit Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myTask.length > 0 ? (
                myTask.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.taskName}</td>
                    <td>{task.description}</td>
                    <td>{task.assignBy.email}</td>
                    <td>{new Date(task.submitDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                    {task.status === 'Pending' ? (
                      <button className="btn btn-success text-light btn-sm me-2" onClick={() => handleComplete(task._id, 'Pending')}>
                        <FaCheckCircle className="me-1" /> Complete
                      </button>
                    ) : (
                      <button className="btn btn-warning text-light btn-sm me-2" onClick={() => handleComplete(task._id, 'Completed')}>
                        Pending
                      </button>
                    )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No tasks found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  </div>
  <div className="container mt-5">
        <h3 className="mb-4 text-center">Assigned Task By Me</h3>
        <div className="table-responsive">
          <table className="table table-bordered table-striped shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Assigned To</th>
                <th>Submit Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myAssignTask.length > 0 ? (
                myAssignTask.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.taskName}</td>
                    <td>{task.description}</td>
                    <td>{task.assignTo.email}</td>
                    <td>{new Date(task.submitDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-danger text-light btn-sm me-2" onClick={() => handleDelete(task._id)}>
                        <FaTrash className="me-1" />
                      </button>
                      <button className="btn btn-info text-light btn-sm me-2" onClick={() => handleDelete(task._id)}>
                        <FaEdit className="me-1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No tasks found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  </div>
   </>
  )
}

export default ShowTask
