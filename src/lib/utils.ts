import { TodoItem } from "@/types/TodoItem";
import { clsx, type ClassValue } from "clsx"
import moment from "moment";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sanitizeInput = (input: string) => {
  // Remove any non-alphanumeric characters except common punctuation
  return input.replace(/[^a-zA-Z0-9\s.,!?-]/g, '');
};

export const isValidateTitle = (value: string) => {
  return value.match(/^[a-zA-Z0-9\.\'\"\?\-\+\! ]+$/)
}

export const filterTodos = (todos: TodoItem[], filter: string) => {
  return todos.filter(item => {
    if (filter === 'active') {
        return !item.isDone
    } else if (filter === 'completed') {
        return item.isDone
    }
    return true
  })
}

export const sortTodosByDate = (a: TodoItem, b: TodoItem) => {
  const dateA = moment.utc(a.createdAt)
  const dateB = moment.utc(b.createdAt)
  return dateB.unix() - dateA.unix()
}

export const getTodoFilterTabs = (todoItems: TodoItem[]) => {
  const activeTodosCount = todoItems.filter(x => !x.isDone).length
  const completedTodosCount = todoItems.filter(x => x.isDone).length

  return {
      'all': `All (${todoItems.length})`,
      'active': `Active (${activeTodosCount})`,
      'completed': `Completed (${completedTodosCount})`
  }
}