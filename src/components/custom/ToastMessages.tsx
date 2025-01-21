
type ToastProps = {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
}

export const ValidationMessages : {[key: string]: string} = {
    TitleError: 'Title can only contain alphanumeric characters and puncutation.'
}

export const FetchTodoMessages: {[key: string]: ToastProps} = {
    Failure: {
        title: 'Error',
        description: 'An error occurred while fetching your todo items.',
        variant: 'destructive'
    }
}

export const CreateTodoMessages: {[key: string]: ToastProps} = {
    Success: {
        title: 'Todo item created',
        description: 'Your todo item has been created successfully.'
    },
    Failure: {
        title: 'Error',
        description: 'An error occurred while creating your todo item.',
        variant: 'destructive'
    }
}

export const UpdateTodoMessages: {[key: string]: ToastProps} = {
    Success: {
        title: 'Todo item updated',
        description: 'Your todo item has been updated successfully.'
    },
    Failure: {
        title: 'Error',
        description: 'An error occurred while updating your todo item.',
        variant: 'destructive'
    },
    ValidationError: {
        title: 'Error',
        description: ValidationMessages.TitleError,
        variant: 'destructive'
    }
}

export const DeleteTodoMessages: {[key: string]: ToastProps} = {
    Success: {
        title: 'Todo item deleted',
        description: 'Your todo item has been deleted successfully.'
    },
    Failure: {
        title: 'Error',
        description: 'An error occurred while deleting your todo item.',
        variant: 'destructive'
    }
}

export const DeleteBulkTodoMessages: {[key: string]: ToastProps} = {
    Success: {
        title: 'Todo item(s) deleted',
        description: 'Your todo items(s) have been deleted successfully.'
    },
    Failure: {
        title: 'Error',
        description: 'An error occurred while deleting your todo items.',
        variant: 'destructive'
    }
}