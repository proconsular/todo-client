import { TodoItem } from "@/types/TodoItem"
import { Checkbox } from "../../ui/checkbox"
import { UpdateTodoMessages } from "../ToastMessages"
import { toast } from "@/hooks/use-toast"

export const TodoItemCheckbox = ({ checked, updateCheck } : { checked: boolean, updateCheck: (valued: boolean) => Promise<TodoItem> }) => {
    const onCheck = async () => {
        try {
            await updateCheck(!checked)
        } catch(error) {
            toast(UpdateTodoMessages.Failure)
        }
    }

    return (
        <Checkbox checked={checked} onCheckedChange={onCheck} />
    )
}