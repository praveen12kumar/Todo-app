import express from 'express';
import { 
    newTask,
    getMyTasks,
    updateTask,
    deleteTask,

} from '../controllers/taskController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const taskRouter = express.Router();

taskRouter.post('/new', isAuthenticated, newTask);

taskRouter.get('/my', isAuthenticated, getMyTasks); 

taskRouter.route('/:id').put(isAuthenticated, updateTask).delete(isAuthenticated, deleteTask);

export default taskRouter;