import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { TodoItemView } from "./TodoItemRow.tsx/TodoItemView"
import { Card } from "../ui/card"
import { useTodoStore } from "@/stores/TodoStore"
import { FilterTabs } from "./FilterTabs"
import { AddTodoDialog } from "./AddTodoDialog"
import { toast } from "@/hooks/use-toast"
import { CreateTodoMessages, DeleteBulkTodoMessages, DeleteTodoMessages, FetchTodoMessages } from "./ToastMessages"
import { ActionMenu } from "./ActionMenu"
import { filterTodos, getTodoFilterTabs, sortTodosByDate } from "@/lib/utils"
import { useDialog } from "./useDialog"

export const TodoTable = () => {
    const { 
        todoItems,
        fetchTodoItems,
        createTodoItem,
        deleteTodoItem,
        deleteTodoItems,
    } = useTodoStore()
    
    const [filter, setFilter] = useState<string>('all')
    const [selected, setSelected] = useState<number[]>([])
    const [openDeleteDialog, DeleteDialog] = useDialog()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const sortedItems = filterTodos(todoItems, filter).sort(sortTodosByDate)

    useEffect(() => {
        fetchTodoItems()
            .catch(() => {
                toast(FetchTodoMessages.Failure)
            })
    }, [])

    const onNewTodo = async (title: string) => {
        try {
            await createTodoItem(title)
            toast(CreateTodoMessages.Success)
        } catch (error) {
            toast(CreateTodoMessages.Failure)
        }
        setIsCreateDialogOpen(false)
    }

    const onSelected = (id: number, value: boolean) => {
        if (value) {
            setSelected([...selected, id])
        } else {
            setSelected([...selected].filter(x => x !== id))
        }
    }

    const onDelete = (id: number) => {
        openDeleteDialog(() => {
            deleteTodoItem(id)
                .then(() => {
                    toast(DeleteTodoMessages.Success)
                    setSelected([...selected].filter(x => x !== id))
                })
                .catch(() => {
                    toast(DeleteTodoMessages.Failure)
                })
        })
    }

    const onDeleteMultiple = (ids: number[]) => {
        openDeleteDialog(() => {
            deleteTodoItems(ids)
                .then(() => {
                    toast(DeleteBulkTodoMessages.Success)
                    setSelected([...selected].filter(x => !todoItems.map(x => x.id).includes(x)))
                })
                .catch(() => {
                    toast(DeleteBulkTodoMessages.Failure)
                })
        })
    }

    const selectVisible = () => {
        setSelected([...selected, ...sortedItems.map(x => x.id)])
    }

    const onAddNewTodo = () => {
        setIsCreateDialogOpen(true)
    }
    
    const deselectAll = () => {
        setSelected([])
    }

    const bulkDelete = () => {
        onDeleteMultiple([...selected])
    }

    const clearCompleted = async () => {
        onDeleteMultiple(todoItems.filter(x => x.isDone).map(x => x.id))
    }

    return (
        <Card className="p-4 shadow-md">
            {isCreateDialogOpen && <AddTodoDialog isOpen={isCreateDialogOpen} onConfirm={onNewTodo} setOpen={setIsCreateDialogOpen} />}
            <DeleteDialog title='Are you sure?' description='This will delete the item(s) permanently.' />
            <div className="flex justify-between mb-6">
                <FilterTabs filter={filter} setFilter={setFilter} tabs={getTodoFilterTabs(todoItems)} />
                <ActionMenu 
                    anyCompleted={todoItems.some(x => x.isDone)}
                    clearCompleted={clearCompleted}
                    select={selectVisible} 
                    deselect={deselectAll}
                    deleteMany={bulkDelete}
                    addTodo={onAddNewTodo}
                    selectCount={selected.length}
                />
            </div>
            <Table className="border-2">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px] sm:w-[120px] text-center">Select</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-center w-[50px] sm:w-[100px]">Complete</TableHead>
                        <TableHead className='text-center w-[50px] sm:w-[150px]'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedItems.length > 0 ? 
                        (
                            sortedItems.map((task) => (
                                <TodoItemView
                                    key={task.id}
                                    todo={task} 
                                    selected={selected.includes(task.id)}
                                    onSelected={(value) => onSelected(task.id, value)}
                                    onDelete={onDelete}
                                />))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No tasks found.</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </Card>
    )
}