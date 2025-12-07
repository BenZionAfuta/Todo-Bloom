import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TodoItem } from "@/components/TodoItem";
import { useTodos } from "@/contexts/TodoContext";

const TasksList = () => {
  const navigate = useNavigate();
  const { todos, toggleTodo, deleteTodo, activeTodoCount } = useTodos();
  
  const activeTodos = todos.filter((todo) => !todo.completed);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                My Tasks
              </h1>
              <p className="text-muted-foreground mt-2">
                {activeTodoCount} active {activeTodoCount === 1 ? "task" : "tasks"}
              </p>
            </div>
            
            <Button
              onClick={() => navigate("/add-task")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {activeTodos.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-2xl p-12 border border-border text-center">
            <p className="text-muted-foreground text-lg">
              No active tasks. Start by adding a new one! 🚀
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksList;
