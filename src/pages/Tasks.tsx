import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useTeam } from "@/hooks/useTeam";
import { Plus, Calendar, User, FolderKanban, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type TaskStatus = Database["public"]["Enums"]["task_status"];

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "backlog", title: "Backlog", color: "border-t-muted-foreground" },
  { id: "in_progress", title: "In Progress", color: "border-t-primary" },
  { id: "in_review", title: "In Review", color: "border-t-yellow-500" },
  { id: "completed", title: "Completed", color: "border-t-accent" },
  { id: "closed", title: "Closed", color: "border-t-destructive" },
];

const Tasks = () => {
  const { tasks, loading, addTask, updateTaskStatus, deleteTask } = useTasks();
  const { projects } = useProjects();
  const { members } = useTeam();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    project_id: "",
    assignee_id: "",
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;

    updateTaskStatus(taskId, newStatus);
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    await addTask({
      title: newTask.title,
      description: newTask.description || null,
      deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : null,
      project_id: newTask.project_id || null,
      assignee_id: newTask.assignee_id || null,
      status: "backlog",
    });

    setNewTask({
      title: "",
      description: "",
      deadline: "",
      project_id: "",
      assignee_id: "",
    });
    setIsDialogOpen(false);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return null;
    return projects.find((p) => p.id === projectId)?.title;
  };

  const getAssigneeName = (assigneeId: string | null) => {
    if (!assigneeId) return null;
    return members.find((m) => m.id === assigneeId)?.full_name;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks with drag and drop
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="project">Project</Label>
                <Select
                  value={newTask.project_id}
                  onValueChange={(value) => setNewTask({ ...newTask, project_id: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={newTask.assignee_id}
                  onValueChange={(value) => setNewTask({ ...newTask, assignee_id: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-5 gap-4">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div
                className={`bg-card rounded-t-lg p-4 border border-border border-t-4 ${column.color}`}
              >
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {getTasksByStatus(column.id).length} tasks
                </p>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 bg-secondary/30 rounded-b-lg p-2 min-h-[400px] border border-t-0 border-border transition-colors ${
                      snapshot.isDraggingOver ? "bg-primary/10" : ""
                    }`}
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 bg-card border-border cursor-grab active:cursor-grabbing transition-shadow ${
                              snapshot.isDragging ? "shadow-lg shadow-primary/20" : ""
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-foreground text-sm">
                                  {task.title}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                  onClick={() => deleteTask(task.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              {task.description && (
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2 mt-3">
                                {task.deadline && (
                                  <span className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(task.deadline), "MMM d")}
                                  </span>
                                )}
                                {getProjectName(task.project_id) && (
                                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 px-2 py-1 rounded text-primary">
                                    <FolderKanban className="w-3 h-3" />
                                    {getProjectName(task.project_id)}
                                  </span>
                                )}
                                {getAssigneeName(task.assignee_id) && (
                                  <span className="inline-flex items-center gap-1 text-xs bg-accent/10 px-2 py-1 rounded text-accent">
                                    <User className="w-3 h-3" />
                                    {getAssigneeName(task.assignee_id)}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Tasks;
