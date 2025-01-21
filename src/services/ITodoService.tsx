import { TodoItem } from "@/types/TodoItem";

export interface ITodoService {
    getTodoItems(): Promise<TodoItem[]>
    createTodoItem(title: string): Promise<TodoItem>
    updateTodoItem(item: TodoItem): Promise<TodoItem>
    deleteTodoItem(id: number): Promise<boolean>
    deleteTodoItems(ids: number[]): Promise<number[]>
}