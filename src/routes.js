import { buildRoutePath } from "./utils/build-route-path.js"
import { randomUUID } from 'node:crypto';
import { Database } from "./database.js";
import { ValidateTaskBodyFields } from "./utils/validations.js";


const database = new Database();

export const routes =[
    {
        method: 'GET',
        path:buildRoutePath('/tasks'),
        handler:(req,res) => {
            const { search } =  req.query
            let filter = null

            if(search) {
                filter = { name:search, email:search }
            }

            const tasks = database.select('tasks',filter)
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path:buildRoutePath('/tasks'),
        handler:(req,res) => {
            console.log(req.body)
            const errors = ValidateTaskBodyFields(req.body)

            if(errors.length > 0) {
                return res.writeHead(400).end(JSON.stringify(errors))
            }

            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title: title,
                description: description,
                completed_at:null,
                create_at: new Date(),
                updated_at: new Date()
            }
    
            database.insert('tasks',task)
    
            return res.writeHead(201).end()
        }
    },
    {
        method:'DELETE',
        path:buildRoutePath('/tasks/:id'),
        handler: (req,res) => {
            const { id } =  req.params
            database.delete('tasks', id)

            return res.writeHead(204).end()
        },
    },
    {
        method:'PUT',
        path:buildRoutePath('/tasks/:id'),
        handler: (req,res) => {
            const { id } =  req.params
            const task = database.select("tasks",{id:id})

            const errors = ValidateTaskBodyFields(req.body)

            if(errors.length > 0){
                return res.writeHead(400).end(JSON.stringify(errors))
            }
        
            if(task[0]) {
                const taskUpdated = { ...task[0] }

                taskUpdated.title = req.body.title
                taskUpdated.description = req.body.description
                taskUpdated.updated_at = new Date()
                database.update('tasks', id,taskUpdated)
                
            }
            else {
                return res.writeHead(404).end()
            }

            return res.writeHead(204).end()
        },
    },
    {
        method:'PATCH',
        path:buildRoutePath('/tasks/:id/complete'),
        handler: (req,res) => {
           const { id } =  req.params
           const task = database.select("tasks",{id:id})

           if(task[0]) {
            const taskUpdated = { ...task[0] }
            taskUpdated.completed_at = new Date()
            taskUpdated.updated_at = new Date()
            database.update('tasks', id,taskUpdated)
            
         }
         else {
            return res.writeHead(404).end()
         }

           return res.writeHead(204).end()
        },
    }
]