const bcrypt = require('bcrypt');
const User = require('../Model/UserSchema'); 
const jwt = require('jsonwebtoken');
const Task = require('../Model/TaskSchema'); // Assuming you have a Task schema
const secretkey = '32wrdc34ferc5tfvc4erfd3e4r';
const axios = require('axios')
const csv = require('csvtojson')



exports.signup = async(req,res)=>{
    try {
        const { name, email, password,phone } = req.body;

        // Validate input
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone:phone
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.login = async(req,res)=>{
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        const name = user.name
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({_id: user._id},secretkey,{expiresIn: '1d'});
        return res.status(200).json({message:'User login Succesful',token,name});

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
exports.getUser = async(req,res)=>{
    try {
        const users = await User.find();
        res.status(200).json({ message: 'Users retrieved successfully', users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.createTask = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }
        const { taskName, description, assignTo, submitDate } = req.body;
        if (!taskName || !description || !assignTo  || !submitDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new task
        const newTask = new Task({
            taskName,
            description,
            assignTo,
            assignBy:userId,
            submitDate
        });

        await newTask.save();

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getMyTask = async(req,res)=>{
    try {
        const userId = req.user ? req.user._id : null;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }
        const tasks = await Task.find({assignTo: req.user._id}).populate('assignBy');
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.updateTaskStatus = async(req,res)=>{
    try {
        const { taskId, status } = req.body;
        if (!taskId || !status) {
            return res.status(400).json({ message: 'Task ID and status are required' });
        }

        const task = await Task.findOne({ _id: taskId, assignTo: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or not assigned to this user' });
        }

        task.status = status;
        await task.save();

        res.status(200).json({ message: 'Task status updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.deleteTask = async(req,res)=>{
    try {
        const taskId = req.params.id;
        if (!taskId) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const task = await Task.findOneAndDelete({ _id: taskId, assignBy: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or not assigned to this user' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
 exports.getMyAssignTask = async(req,res)=>{
    try {
        const Assigntasks = await Task.find({assignBy: req.user._id}).populate('assignTo');
        if (!Assigntasks || Assigntasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        res.status(200).json({ message: 'Tasks retrieved successfully', Assigntasks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

 }

//  exports.uploadFromSheet = async (req, res) => {
//     try {
//         const { sheetUrl } = req.body;
//         if (!sheetUrl) {
//             return res.status(400).json({ message: 'Sheet URL is required' });
//         }

//         // Logic to fetch data from Google Sheets and create tasks
//         // This is a placeholder; you need to implement the actual logic to fetch data from Google Sheets
//         const tasksData = await fetchTasksFromGoogleSheet(sheetUrl); // Implement this function

//         // Create tasks in the database
//         for (const taskData of tasksData) {
//             const newTask = new Task(taskData);
//             await newTask.save();
//         }

//         res.status(201).json({ message: 'Tasks created successfully from Google Sheet' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// }


const getCsvExportUrl = async (sheetLink) => {
    const regex = /\/d\/([^/]+)\/.*(?:gid=([0-9]+))?/;
    const match = sheetLink.match(regex);
          
    if (!match) {
        throw new Error("Invalid Google Sheets URL");
    }
    const spreadsheetId = match[1];
    const gid = match[2] || '0'; 
          
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    // https://docs.google.com/spreadsheets/d/1PmCje4J5Ra-CZqAwNB7HoYIbltR5nlaeCKKbjgj6FHw/edit?usp=sharing
}

exports.uploadSheet = async (req, res) => {
    console.log(req.body);
   try {
    const {sheetUrl} = req.body;
    if(!sheetUrl) {
        return res.status(400).json({message: 'Sheet url is required'});
    }


 
    const csvUrl = await getCsvExportUrl(sheetUrl);
    console.log("csvUrl",csvUrl);

const fetchAndSaveTasks = async () => {
        try {
            const response = await axios.get(csvUrl);
            const tasks = await csv().fromString(response.data);
        
            // Optional: parse date if you have dueDate column
            const formattedTasks = tasks.map(task => {
            // Split the dueDate string (assumes format MM/DD/YYYY)
            const [month, day, year] = task.submitDate.split('/');
            const validDate = new Date(year, month - 1, day); // JavaScript me month 0-indexed hota hai
            return { ...task, submitDate: validDate };
            });
            
            console.log(('task>>',formattedTasks))

            for (const task of formattedTasks) {

         const assingtoData = await User.findOne({email: task.assignTo});
            console.log("assingtoData",assingtoData);
            if(!assingtoData) {
                return res.status(400).json({message: 'Assign to email not found'});
            }
            
            const duplicate = await Task.findOne({
                taskName: task.taskName,
                assignTo: assingtoData._id
            });
        
            if (duplicate) {
                console.log(`Task "${task.taskName}" already assigned to ${task.assignTo}. Skipping insertion.`);
                continue; // Skip to next task
            }
        
            // If not duplicate, then save the task
            try {
                const newTask = new Task({
                taskName: task.taskName,
                submitDate: task.submitDate,
                assignTo: assingtoData._id,
                description: task.description,
                assignBy: req.user._id
                });
                await newTask.save();
                console.log(`Task "${task.taskName}" for ${task.assignTo} saved successfully!`);

            } catch (error) {
                console.error(`Error saving task "${task.taskName}":`, error);
            }
            }
        
        
            console.log('✅ Tasks saved to MongoDB!');

        } catch (error) {
            console.error('❌ Error importing tasks:', error.message);
        }
        }

await fetchAndSaveTasks();
return res.status(200).json({message: 'saved successfully!'});


} catch (error) {
return res.status(500).json({message: 'Internal server error'});
}

}
