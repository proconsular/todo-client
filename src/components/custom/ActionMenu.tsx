import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

export const ActionMenu = (
{ 
    select, 
    deselect, 
    addTodo, 
    deleteMany,
    clearCompleted,
    anyCompleted,
    selectCount 
} : 
{ 
    select: () => void, 
    deselect: () => void, 
    addTodo: () => void, 
    deleteMany: () => void, 
    clearCompleted: () => void,
    anyCompleted: boolean,
    selectCount: number 
}) => {

    return (
        <>
            <div className="hidden lg:flex gap-3 ">
                <Button variant='outline' onClick={deselect}>Deselect All</Button>
                <Button variant='secondary' onClick={select}>Select Visible</Button>
                <Button variant={'destructive'} onClick={clearCompleted} disabled={!anyCompleted}>Clear Completed</Button>
                <Button variant='destructive' disabled={selectCount == 0} onClick={deleteMany}>Delete ({selectCount})</Button>
                <Button className="bg-blue-500 text-white" onClick={addTodo}>Add Todo</Button>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger className="lg:hidden flex" asChild>
                    <Button variant='outline'>Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={addTodo}>Add Todo</DropdownMenuItem>
                    <DropdownMenuItem onClick={select}>Select Visible</DropdownMenuItem>
                    <DropdownMenuItem onClick={deselect}>Deselect All</DropdownMenuItem>
                    <DropdownMenuItem onClick={clearCompleted} disabled={!anyCompleted}>Clear Completed</DropdownMenuItem>
                    <DropdownMenuItem disabled={selectCount == 0} onClick={deleteMany}>Delete ({selectCount})</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}