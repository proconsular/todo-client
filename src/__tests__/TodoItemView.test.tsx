import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { TodoItem } from '@/types/TodoItem';
import { TodoStoreType } from '@/stores/TodoStore';
import { TodoItemView } from '@/components/custom/TodoItemRow.tsx/TodoItemView';
import { UpdateTodoMessages } from '@/components/custom/ToastMessages';
import { toast } from '@/hooks/use-toast';


// Create mock types
vi.mock('@/hooks/use-toast', () => ({
    toast: vi.fn()
}));

const mockUpdateTodoItem = vi.fn<[TodoItem], Promise<TodoItem>>();
const mockUseTodoStore = vi.fn<[], TodoStoreType>(() => ({
    updateTodoItem: mockUpdateTodoItem
}));

vi.mock('@/stores/TodoStore', () => ({
    useTodoStore: () => mockUseTodoStore()
}));

describe('TodoItemView', () => {
    let user: UserEvent;

    const mockTodo: TodoItem = {
        id: 1,
        title: 'Test Todo',
        isDone: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const defaultProps = {
        todo: mockTodo,
        selected: false,
        onSelected: vi.fn(),
        onDelete: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        user = userEvent.setup();
    });

    it('renders todo item correctly', () => {
        render(<TodoItemView {...defaultProps} />);
        
        expect(screen.getByText('Test Todo')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('handles selection change', async () => {
        render(<TodoItemView {...defaultProps} />);
        
        const checkbox = screen.getAllByRole('checkbox')[0];
        await user.click(checkbox);
        
        expect(defaultProps.onSelected).toHaveBeenCalledWith(true);
    });

    it('enters edit mode when edit button is clicked', async () => {
        render(<TodoItemView {...defaultProps} />);
        
        const editButton = screen.getByRole('button', { name: /edit/i });
        await user.click(editButton);
        
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.value).toBe('Test Todo');
    });

    it('updates todo when valid title is entered', async () => {
        const updatedTodo: TodoItem = {
            ...mockTodo,
            title: 'Updated Todo'
        };

        mockUpdateTodoItem.mockResolvedValueOnce(updatedTodo);

        render(<TodoItemView {...defaultProps} />);
        
        // Enter edit mode
        const editButton = screen.getByRole('button', { name: /edit/i });
        await user.click(editButton);
        
        // Update title
        const input = screen.getByRole('textbox');
        await user.clear(input);
        await user.type(input, 'Updated Todo');
        
        // Save changes
        await user.click(editButton);
        
        expect(mockUpdateTodoItem).toHaveBeenCalledWith({
            ...mockTodo,
            title: 'Updated Todo'
        });
        expect(toast).toHaveBeenCalledWith(UpdateTodoMessages.Success);
    });

    it('shows error toast when update fails', async () => {
        mockUpdateTodoItem.mockRejectedValueOnce(new Error('Update failed'));

        render(<TodoItemView {...defaultProps} />);
        
        // Enter edit mode
        const editButton = screen.getByRole('button', { name: /edit/i });
        await user.click(editButton);
        
        // Update title
        const input = screen.getByRole('textbox');
        await user.clear(input);
        await user.type(input, 'Updated Todo');
        
        // Try to save changes
        await user.click(editButton);
        
        expect(toast).toHaveBeenCalledWith(UpdateTodoMessages.Failure);
    });

    it('handles delete button click', async () => {
        render(<TodoItemView {...defaultProps} />);
        
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        await user.click(deleteButton);
        
        expect(defaultProps.onDelete).toHaveBeenCalledWith(mockTodo.id);
    });

    it('updates checkbox state', async () => {
        const updatedTodo: TodoItem = {
            ...mockTodo,
            isDone: true
        };

        mockUpdateTodoItem.mockResolvedValueOnce(updatedTodo);

        render(<TodoItemView {...defaultProps} />);
        
        const todoCheckbox = screen.getAllByRole('checkbox')[1]; // Second checkbox is the todo status checkbox
        await user.click(todoCheckbox);
        
        expect(mockUpdateTodoItem).toHaveBeenCalledWith(updatedTodo);
    });
});