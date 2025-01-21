import { TodoItem } from "@/types/TodoItem";
import { ITodoService } from "./ITodoService";

export class RESTTodoService implements ITodoService {
    baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    async getTodoItems(): Promise<TodoItem[]> {
        try {
            let response = await fetch(`${this.baseURL}/api/todoitems`)
            if (response.ok) {
                return await response.json()
            } else {
                throw new Error("Failed to fetch todo items.")
            }
        } catch (error) {
            throw error
        }
    }

    async createTodoItem(title: string): Promise<TodoItem> {
        try {
            let response = await fetch(`${this.baseURL}/api/todoitems`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Title: title })
            })
            if (response.ok) {
                return await response.json()
            } else {
                throw new Error("Failed to create todo item.")
            }
        } catch (error) {
            throw error
        }
    }

    async updateTodoItem(item: TodoItem): Promise<TodoItem> {
        try {
            let response = await fetch(`${this.baseURL}/api/todoitems/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })
            if (response.ok) {
                return await response.json()
            } else {
                throw new Error("Failed to update todo item.")
            }
        } catch (error) {
            throw error
        }
    }

    async deleteTodoItem(id: number): Promise<boolean> {
        try {
            let response = await fetch(`${this.baseURL}/api/todoitems/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                return true
            } else if (response.status == 404) {
                return false
            } else {
                throw new Error(`Failed to delete todo item with id ${id}.`)
            }
        } catch (error) {
            throw error
        }
    }

    async deleteTodoItems(ids: number[]): Promise<number[]> {
        try {
            let response = await fetch(`${this.baseURL}/api/todoitems`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ids)
            })
            return await response.json()
        } catch (error) {
            throw error
        }
    }
}