import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Alert } from "../ui/alert"
import { isValidateTitle } from "@/lib/utils"
import { ValidationMessages } from "./ToastMessages"

export type AddTodoDialogProps = { 
    isOpen: boolean, 
    onConfirm: (title: string) => void, 
    setOpen: (value: boolean) => void
}

export const AddTodoDialog = ({isOpen, onConfirm, setOpen} : AddTodoDialogProps) => {
    const [title, setTitle] = useState('')
    const [error, setError] = useState('')

    const onTitleChange = (value: string) => {
        if (value.length > 0 && !isValidateTitle(value)) {
            setError(ValidationMessages.TitleError)
        } else {
            setError('')
        }
        setTitle(value)
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Todo Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {error && <Alert className="text-sm" variant={'destructive'}>{error}</Alert>}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            maxLength={40}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="Type a title here..."
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={error.length > 0 || title.length === 0} onClick={() => onConfirm(title)}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}