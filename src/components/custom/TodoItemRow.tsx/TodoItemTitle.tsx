
export const TodoItemTitle = ({ title, isDone } : { title: string, isDone: boolean }) => (
    <div className={`p-2 px-4 -ml-4 ${isDone ? 'line-through' : ''}`}>{title}</div>
)