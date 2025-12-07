import { useNavigate } from "react-router-dom";
import { ListTodo, PlusCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/contexts/TodoContext";

const Home = () => {
  const navigate = useNavigate();
  const { activeTodoCount, completedTodos } = useTodos();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Modern Task Management
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            Welcome to My TODO App
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
            Stay organized and productive with a clean, modern interface designed for effortless task management.
          </p>
        </div>

        {(activeTodoCount > 0 || completedTodos.length > 0) && (
          <div className="flex gap-4 justify-center">
            <div className="px-6 py-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-primary">{activeTodoCount}</div>
              <div className="text-sm text-muted-foreground">Active Tasks</div>
            </div>
            <div className="px-6 py-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-accent">{completedTodos.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/tasks")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
          >
            <ListTodo className="w-5 h-5 mr-2" />
            View Tasks
          </Button>
          
          <Button
            onClick={() => navigate("/add-task")}
            size="lg"
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent/50"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
