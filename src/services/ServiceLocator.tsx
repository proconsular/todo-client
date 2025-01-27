import { FakeTodoService } from "./FakeTodoService";
import { ITodoService } from "./ITodoService";
import { RESTTodoService } from "./RESTTodoService";

type ServiceRegistryType = {
    TodoService: ITodoService
}

export const ServiceRegistry: ServiceRegistryType = {
    TodoService: new FakeTodoService()
}