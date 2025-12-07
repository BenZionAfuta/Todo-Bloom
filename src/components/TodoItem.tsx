import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border",
        "transition-all duration-200 hover:bg-secondary",
        todo.completed && "opacity-60"
      )}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center",
          "transition-all duration-200 hover:scale-110",
          todo.completed
            ? "bg-accent border-accent"
            : "border-muted-foreground/40 hover:border-accent"
        )}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed && <Check className="w-4 h-4 text-accent-foreground" />}
      </button>

      <span
        className={cn(
          "flex-1 text-foreground transition-all duration-200",
          todo.completed && "line-through text-muted-foreground"
        )}
      >
        {todo.title}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center
                   text-muted-foreground hover:text-destructive hover:bg-destructive/10
                   transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
