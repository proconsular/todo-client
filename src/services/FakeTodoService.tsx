import { TodoItem } from "@/types/TodoItem";
import { ITodoService } from "./ITodoService";

export class FakeTodoService implements ITodoService {
    tasks: TodoItem[]
    idCounter: number

    constructor() {
        this.idCounter = 6
        this.tasks = [
            {
              "id": 1,
              "title": "Design homepage layout",
              "isDone": false,
              "createdAt": "2023-10-01T10:00:00Z",
              "updatedAt": "2023-10-01T10:00:00Z"
            },
            {
              "id": 2,
              "title": "Implement user authentication",
              "isDone": true,
              "createdAt": "2023-10-02T11:30:00Z",
              "updatedAt": "2023-10-05T14:00:00Z"
            },
            {
              "id": 3,
              "title": "Set up database schema",
              "isDone": false,
              "createdAt": "2023-10-03T09:15:00Z",
              "updatedAt": "2023-10-04T12:45:00Z"
            },
            {
              "id": 4,
              "title": "Create API endpoints",
              "isDone": false,
              "createdAt": "2023-10-04T08:00:00Z",
              "updatedAt": "2023-10-04T08:30:00Z"
            },
            {
              "id": 5,
              "title": "Write unit tests for authentication",
              "isDone": true,
              "createdAt": "2023-10-05T13:00:00Z",
              "updatedAt": "2023-10-06T10:00:00Z"
            }
          ]
    }

    getTodoItems(): Promise<TodoItem[]> {
        return Promise.resolve([...this.tasks])
    }

    createTodoItem(title: string): Promise<TodoItem> {
        return new Promise((resolve) => {
            const newTask: TodoItem = {
                id: this.idCounter,
                title: title,
                isDone: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            this.idCounter++
            this.tasks.push(newTask)
            resolve(newTask)
        })
    }

    updateTodoItem(item: TodoItem): Promise<TodoItem> {
        return new Promise((resolve) => {
            const index = this.tasks.findIndex((task) => task.id === item.id)
            if (index != -1) {
                item.updatedAt = new Date().toISOString()
                this.tasks[index] = item
                resolve(item)
            }
        })
    }

    deleteTodoItem(id: number): Promise<boolean> {
        return new Promise((resolve) => {
            this.tasks = this.tasks.filter((task) => task.id !== id)
            resolve(true)
        })
    }

    deleteTodoItems(ids: number[]): Promise<number[]> {
        return new Promise((resolve) => {
            this.tasks = this.tasks.filter((task) => !ids.includes(task.id))
            resolve(ids)
        })
    }

}