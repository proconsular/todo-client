import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { ActionMenu } from '@/components/custom/ActionMenu';

interface ActionMenuProps {
    select: () => void;
    deselect: () => void;
    addTodo: () => void;
    deleteMany: () => void;
    clearCompleted: () => void;
    anyCompleted: boolean;
    selectCount: number;
}

describe('ActionMenu', () => {
    let user: UserEvent;

    const defaultProps: ActionMenuProps = {
        select: vi.fn(),
        deselect: vi.fn(),
        addTodo: vi.fn(),
        deleteMany: vi.fn(),
        clearCompleted: vi.fn(),
        anyCompleted: false,
        selectCount: 0
    };

    beforeEach(() => {
        vi.clearAllMocks();
        user = userEvent.setup();
    });

    describe('Desktop View (lg screens)', () => {
        beforeEach(() => {
            // Mock window.matchMedia for desktop view
            window.matchMedia = vi.fn().mockImplementation(query => ({
                matches: true,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            }));
        });

        it('renders all buttons in desktop view', () => {
            render(<ActionMenu {...defaultProps} />);
            
            expect(screen.getByRole('button', { name: /deselect all/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /select visible/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /delete \(0\)/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /clear completed/i })).toBeInTheDocument();
        });

        it('calls addTodo when Add Todo button is clicked', async () => {
            render(<ActionMenu {...defaultProps} />);
            
            const addButton = screen.getByRole('button', { name: /add todo/i });
            await user.click(addButton);
            
            expect(defaultProps.addTodo).toHaveBeenCalled();
        });

        it('calls select when Select Visible button is clicked', async () => {
            render(<ActionMenu {...defaultProps} />);
            
            const selectButton = screen.getByRole('button', { name: /select visible/i });
            await user.click(selectButton);
            
            expect(defaultProps.select).toHaveBeenCalled();
        });

        it('calls deselect when Deselect All button is clicked', async () => {
            render(<ActionMenu {...defaultProps} />);
            
            const deselectButton = screen.getByRole('button', { name: /deselect all/i });
            await user.click(deselectButton);
            
            expect(defaultProps.deselect).toHaveBeenCalled();
        });

        it('enables delete button when items are selected', () => {
            render(<ActionMenu {...defaultProps} selectCount={5} />);
            
            const deleteButton = screen.getByRole('button', { name: /delete \(5\)/i });
            expect(deleteButton).not.toBeDisabled();
        });

        it('disables delete button when no items are selected', () => {
            render(<ActionMenu {...defaultProps} selectCount={0} />);
            
            const deleteButton = screen.getByRole('button', { name: /delete \(0\)/i });
            expect(deleteButton).toBeDisabled();
        });

        it('Clear Completed is disabled when anyCompleted is false', () => {
            render(<ActionMenu {...defaultProps}  />);
            
            const clearButton = screen.getByRole('button', { name: /clear completed/i });
            expect(clearButton).toBeDisabled();
        });

        it('Clear Completed is enabled when anyCompleted is true', () => {
            render(<ActionMenu {...defaultProps} anyCompleted={true} />);
            
            const clearButton = screen.getByRole('button', { name: /clear completed/i });
            expect(clearButton).not.toBeDisabled();
        });

        it('clear completed to be called when Clear Completed button is clicked', async () => {
            render(<ActionMenu {...defaultProps} anyCompleted={true} />);
            
            const clearButton = screen.getByRole('button', { name: /clear completed/i });
            await user.click(clearButton);
            expect(defaultProps.clearCompleted).toHaveBeenCalled();
        });
    });

    describe('Mobile View', () => {
        beforeEach(() => {
            // Mock window.matchMedia for mobile view
            window.matchMedia = vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            }));
        });

        it('renders dropdown trigger in mobile view', () => {
            render(<ActionMenu {...defaultProps} />);
            
            expect(screen.getByRole('button', { name: /actions/i })).toBeInTheDocument();
        });

        it('shows dropdown menu items when clicked', async () => {
            render(<ActionMenu {...defaultProps} />);
            
            const trigger = screen.getByRole('button', { name: /actions/i });
            await user.click(trigger);
            
            expect(screen.getByRole('menuitem', { name: /add todo/i })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: /select visible/i })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: /deselect all/i })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: /clear completed/i })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: /delete \(0\)/i })).toBeInTheDocument();
        });

        it('calls appropriate functions when dropdown items are clicked', async () => {
            render(<ActionMenu {...defaultProps} />);
            
            // Open dropdown
            const trigger = screen.getByRole('button', { name: /actions/i });
            await user.click(trigger);
            
            // Click Add Todo
            const addMenuItem = screen.getByRole('menuitem', { name: /add todo/i });
            await user.click(addMenuItem);
            expect(defaultProps.addTodo).toHaveBeenCalled();
            
            // Click Select Visible
            await user.click(trigger); // Reopen dropdown
            const selectMenuItem = screen.getByRole('menuitem', { name: /select visible/i });
            await user.click(selectMenuItem);
            expect(defaultProps.select).toHaveBeenCalled();
        });

        it('disables delete menu item when no items selected', async () => {
            render(<ActionMenu {...defaultProps} />);
            
            const trigger = screen.getByRole('button', { name: /actions/i });
            await user.click(trigger);
            
            const deleteMenuItem = screen.getByRole('menuitem', { name: /delete \(0\)/i });
            expect(deleteMenuItem).toHaveAttribute('aria-disabled', 'true');
        });
    });
});