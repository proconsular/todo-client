import { TodoTable } from './components/custom/TodoTable'
import { Toaster } from "@/components/ui/toaster"
import { ServiceRegistry } from './services/ServiceLocator'
import { RESTTodoService } from './services/RESTTodoService'

function App() {
  ServiceRegistry.TodoService = new RESTTodoService(process.env.BACKEND_HOST ?? '')
  
  return (
    <>
      <div className='container mx-auto p-6'>
        <TodoTable />
        <Toaster />
      </div>
    </>
  )
}

export default App
