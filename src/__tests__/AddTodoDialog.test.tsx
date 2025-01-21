import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { ValidationMessages } from '@/components/custom/ToastMessages';
import { AddTodoDialog, AddTodoDialogProps } from '@/components/custom/AddTodoDialog';

// Mock the validation function
vi.mock('@/lib/utils', () => ({
    cn: vi.fn(),
    isValidateTitle: (title: string) => !title.includes('invalid')
}));

describe('AddTodoDialog', () => {
    let user: UserEvent;

    const defaultProps: AddTodoDialogProps = {
        isOpen: true,
        onConfirm: vi.fn(),
        setOpen: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        user = userEvent.setup();
    });

    it('renders dialog when isOpen is true', () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Add Todo Item')).toBeInTheDocument();
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    });

    it('does not render dialog when isOpen is false', () => {
        render(<AddTodoDialog {...defaultProps} isOpen={false} />);
        
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls setOpen when dialog is closed', async () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        await user.keyboard('{Escape}');
        
        expect(defaultProps.setOpen).toHaveBeenCalledWith(false);
    });

    it('updates title input value when typing', async () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        const input = screen.getByLabelText('Title');
        await user.type(input, 'New Todo');
        
        expect(input).toHaveValue('New Todo');
    });

    it('shows error message for invalid title', async () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        const input = screen.getByLabelText('Title');
        await user.type(input, 'invalid title');
        
        expect(screen.getByText(ValidationMessages.TitleError)).toBeInTheDocument();
    });

    it('disables Create button when title is empty', () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        const createButton = screen.getByRole('button', { name: /create/i });
        expect(createButton).toBeDisabled();
    });

    it('disables Create button when title is invalid', async () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        const input = screen.getByLabelText('Title');
        await user.type(input, 'invalid title');
        
        const createButton = screen.getByRole('button', { name: /create/i });
        expect(createButton).toBeDisabled();
    });

    it('enables Create button when title is valid', async () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        const input = screen.getByLabelText('Title');
        await user.type(input, 'Valid Todo Title');
        
        const createButton = screen.getByRole('button', { name: /create/i });
        expect(createButton).not.toBeDisabled();
    });

    it('calls onConfirm with title when Create button is clicked', async () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        const input = screen.getByLabelText('Title');
        await user.type(input, 'New Todo Item');
        
        const createButton = screen.getByRole('button', { name: /create/i });
        await user.click(createButton);
        
        expect(defaultProps.onConfirm).toHaveBeenCalledWith('New Todo Item');
    });

    it('respects maxLength constraint on title input', async () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        const input = screen.getByLabelText('Title');
        const longTitle = 'a'.repeat(50);
        await user.type(input, longTitle);
        
        expect(input).toHaveValue(longTitle.slice(0, 40));
    });

    it('clears error message when title becomes valid', async () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        const input = screen.getByLabelText('Title');
        
        // First type invalid title
        await user.type(input, 'invalid title');
        expect(screen.getByText(ValidationMessages.TitleError)).toBeInTheDocument();
        
        // Clear and type valid title
        await user.clear(input);
        await user.type(input, 'Valid Title');
        expect(screen.queryByText(ValidationMessages.TitleError)).not.toBeInTheDocument();
    });

    it('shows placeholder text in input field', () => {
        render(<AddTodoDialog {...defaultProps} />);
        
        const input = screen.getByPlaceholderText('Type a title here...');
        expect(input).toBeInTheDocument();
    });
});