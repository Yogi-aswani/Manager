import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Components/Auth/Signup';
import Login from './Components/Auth/Login';
import Header from './Components/Task/Header';
import TaskForm from './Components/Task/TaskForm';
import ShowTask from './Components/Task/ShowTask';


function App() {
  // Removed unused state variable
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/header" element={<Header />} />
        <Route path="/taskform" element={<TaskForm />} />
        <Route path="/showtask" element={<ShowTask />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
