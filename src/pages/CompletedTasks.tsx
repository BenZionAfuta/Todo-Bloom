import { RotateCcw, Trash2 } from "lucide-react";
import { useTodos } from "@/contexts/TodoContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CompletedTasks = () => {
  const { completedTodos, toggleTodo, deleteTodo } = useTodos();

  const handleRestore = (id: string, title: string) => {
    toggleTodo(id);
    toast.success(`"${title}" restored to active tasks`);
  };

  const handleDelete = (id: string, title: string) => {
    deleteTodo(id);
    toast.success(`"${title}" deleted permanently`);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Completed Tasks
          </h1>
          <p className="text-muted-foreground mt-2">
            {completedTodos.length} completed {completedTodos.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        {completedTodos.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-2xl p-12 border border-border text-center">
            <p className="text-muted-foreground text-lg">
              No completed tasks yet. Keep working! 💪
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-start gap-3 p-4 rounded-lg bg-secondary/30 border border-border/50"
              >
                <div className="flex-1 space-y-1">
                  <div className="text-foreground/60 line-through">
                    {todo.title}
                  </div>
                  {todo.description && (
                    <div className="text-sm text-muted-foreground/60">
                      {todo.description}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(todo.id, todo.title)}
                    className={cn(
                      "flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center",
                      "text-muted-foreground hover:text-accent hover:bg-accent/10",
                      "transition-all duration-200 hover:scale-110"
                    )}
                    aria-label="Restore task"
                    title="Restore task"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(todo.id, todo.title)}
                    className={cn(
                      "flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center",
                      "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                      "transition-all duration-200 hover:scale-110"
                    )}
                    aria-label="Delete task forever"
                    title="Delete forever"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;
