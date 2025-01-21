import { sanitizeInput } from '@/lib/utils'
import { ServiceRegistry } from '@/services/ServiceLocator'
import { TodoItem } from '@/types/TodoItem'
import { create } from 'zustand'

export type TodoStoreType = {
    todoItems: TodoItem[],
    setTodoItems: (todoItems: TodoItem[]) => void,

    fetchTodoItems: () => Promise<void>,
    createTodoItem: (title: string) => Promise<void>,
    updateTodoItem: (todoItem: TodoItem) => Promise<TodoItem>,
    deleteTodoItem: (id: number) => Promise<void>,
    deleteTodoItems: (ids: number[]) => Promise<void>
}

export const useTodoStore = create<TodoStoreType>((set) => ({
    todoItems: [],
    setTodoItems: (todoItems: TodoItem[]) => set({ todoItems }),

    fetchTodoItems: async () => {
        let todoItems = await ServiceRegistry.TodoService.getTodoItems()
        set({ todoItems })
    },

    createTodoItem: async (title: string) => {
        let createdTodoItem = await ServiceRegistry.TodoService.createTodoItem(sanitizeInput(title))
        set((state: any) => ({
            todoItems: [...state.todoItems, createdTodoItem]
        }))
    },

    updateTodoItem: async (todoItem: TodoItem) => {
        todoItem.title = sanitizeInput(todoItem.title)
        let updatedItem = await ServiceRegistry.TodoService.updateTodoItem(todoItem)
        set((state: any) => ({
            todoItems: state.todoItems.map((item: TodoItem) => {
                if (item.id === updatedItem.id) {
                    return updatedItem
                }
                return item
            })
        }))
        return updatedItem
    },

    deleteTodoItem: async (id: number) => {
        let didDelete = await ServiceRegistry.TodoService.deleteTodoItem(id)
        if (didDelete) {
            set((state: any) => ({
                todoItems: state.todoItems.filter((item: TodoItem) => item.id !== id)
            }))
        } else {
            throw new Error(`Failed to delete todo item with id ${id}.`)
        }
    },

    deleteTodoItems: async (ids: number[]) => {
        let deletedIds = await ServiceRegistry.TodoService.deleteTodoItems(ids)
        set((state: any) => ({
            todoItems: state.todoItems.filter((item: TodoItem) => !deletedIds.includes(item.id))
        }))
        if (deletedIds.length !== ids.length) {
            throw new Error(`Failed to delete all todo items.`)
        }
    }
}))