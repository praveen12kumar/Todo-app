import asyncHandler from "express-async-handler";
import {Task} from "../models/taskModel.js";

//@desc create a new task
//route:GET /api/v1/tasks/new
//@access private

const newTask = asyncHandler(async(req, res)=>{
    const{title, description} = req.body;

    if(!title || !description){
        res.status(400).json({
            success: false,
            message: "Add and Description",
        })
    }

   const newTask =  await Task.create({
        title,
        description,
        user: req.user,
    });

    res.status(200).json({
        success: true,
        message: "Task created successfully",
        task: newTask,
    })
})

//@desc give all the tasks of the user
//route: GET  /api/v1/tasks/my
//@access private
const getMyTasks = asyncHandler(async(req, res)=>{
    const userId = req.user._id;

    const allTasks = await Task.find({user: userId});

    res.status(200).json({
        success: true,
        allTasks
    })
})

//@desc update the tasks of the user
//route: PUT /api/v1/tasks/:id
//@access private
const updateTask = asyncHandler(async(req, res, next)=>{
    const {id} = req.params;
    const task = await Task.findById(id);
    task.isCompleted = !task.isCompleted;
    await task.save();
    
    if(!task){
        return new Error('Invalid Task');
    }

    res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        task,
    })
})

const deleteTask = asyncHandler(async(req, res, next)=>{
    const {id} = req.params;
    const task = await Task.findById(id);
    
    if(!task){
       return next(new Error('Invalid task Id'));
    }
    await task.deleteOne();
    console.log("task", task);
    res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        task,
    })
})



export {
    newTask,
    getMyTasks,
    updateTask,
    deleteTask,
}