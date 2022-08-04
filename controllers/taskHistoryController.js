const { getAllTasksHistoryRepo } = require('../repository/taskHistory')  

const getAllTaskHistory = async (req, res) => {
    try { 
        const { query: filters } = req; 
               
        const sortColumn = filters.sort || 'created_at'; 
        const sortDirection = filters.direction || 'desc';
        const page = filters.page || 1;
        const limit = filters.limit || 10;
 
        let task = await findTaskRepo(req.body.id);
        if (!task) return res.status(400).json({ "message": `Task ID ${req.body.id} not found` });
        
        const task_history = await getAllTasksHistoryRepo(task.id, sortColumn, sortDirection, page, limit)
            
        res.json(task_history); 
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }       
}
 

module.exports = {
    getAllTaskHistory 
}
