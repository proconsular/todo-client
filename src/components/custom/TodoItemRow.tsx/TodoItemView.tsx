import { TodoItem } from "@/types/TodoItem";
import { TableCell, TableRow } from "../../ui/table";
import { Checkbox } from "../../ui/checkbox";
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { UpdateTodoMessages } from "../ToastMessages";
import { isValidateTitle } from "@/lib/utils";
import { useTodoStore } from "@/stores/TodoStore";
import { TodoItemCheckbox } from "./TodoItemCheckbox";
import { TodoItemTitle } from "./TodoItemTitle";

export const TodoItemView = (
{ 
    todo, 
    selected,
    onSelected,
    onDelete,
} : { 
    todo: TodoItem, 
    selected: boolean,
    onSelected: (value: boolean) => void, 
    onDelete: (id: number) => void,
}) => {
    const { 
        updateTodoItem,
    } = useTodoStore()

    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(todo.title)
    const inputElementRef = useRef<HTMLInputElement>(null)

    const onTitleChange = async () => {
        if (title !== todo.title) {
            if (!isValidateTitle(title)) {
                toast(UpdateTodoMessages.ValidationError)
                setTitle(todo.title)
            } else {
                try {
                    let updatedItem = await updateTodoItem({...todo, title})
                    setTitle(updatedItem.title)
                    toast(UpdateTodoMessages.Success)
                } catch (error) {
                    setTitle(todo.title)
                    toast(UpdateTodoMessages.Failure)
                }
            }
        }
        setIsEditing(false)
    }

    const onCheck = (value: boolean) => {
        return updateTodoItem({...todo, isDone: value})
    }

    const onEdit = () => {
        if (isEditing) {
            onTitleChange()
        } else {
            setIsEditing(true)
            setTimeout(() => {
                inputElementRef.current?.focus()
            }, 0)
        }
    }

    return (
        <TableRow className={`${todo.isDone ? 'bg-blue-100' : ''}`}>
            <TableCell className="text-center !pr-4">
                <Checkbox className="todo-item_select" checked={selected} onCheckedChange={(value) => onSelected(value === true)} />    
            </TableCell>
            {isEditing ? (
                <TableCell>
                    <input 
                        type='text'
                        ref={inputElementRef}
                        value={title}
                        maxLength={40}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-full bg-blue-100 rounded-md p-2 px-4 -ml-4 outline-none'
                    />
                </TableCell>
            ) : (
                <TableCell>
                    <TodoItemTitle title={title} isDone={todo.isDone} />
                </TableCell>
            )}
            <TableCell className="text-center !pr-4">
                <TodoItemCheckbox checked={todo.isDone} updateCheck={onCheck} />
            </TableCell>
            <TableCell className='text-right'>
                <button className='bg-blue-500 text-white px-2 py-1 rounded' onClick={onEdit}>Edit</button>
                <button className='bg-red-500 text-white px-2 py-1 rounded ml-2' onClick={() => onDelete(todo.id)}>Delete</button>
            </TableCell>
        </TableRow>
    )
}