import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTodos } from "@/contexts/TodoContext";
import { toast } from "sonner";

const AddTask = () => {
  const navigate = useNavigate();
  const { addTodo } = useTodos();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("Task title cannot be empty");
      return;
    }

    addTodo(trimmedTitle, description.trim() || undefined);
    toast.success("Task added successfully!");
    navigate("/tasks");
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/tasks")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Button>

        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-8">
            Add New Task
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Task Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter task title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary border-border focus:border-primary focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Add more details about your task…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-secondary border-border focus:border-primary focus:ring-primary min-h-32 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Task
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/tasks")}
                className="border-border hover:bg-secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
