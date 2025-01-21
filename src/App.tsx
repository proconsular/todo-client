import { TodoTable } from './components/custom/TodoTable'
import { Toaster } from "@/components/ui/toaster"

function App() {
  
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
