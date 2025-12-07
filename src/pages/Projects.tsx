import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useTeam } from "@/hooks/useTeam";
import { Plus, Calendar, Tag, Users, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Projects = () => {
  const { projects, loading, addProject, deleteProject } = useProjects();
  const { members } = useTeam();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    deadline: "",
    categories: "",
  });

  const handleAddProject = async () => {
    if (!newProject.title.trim()) return;

    const categoriesArray = newProject.categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    await addProject({
      title: newProject.title,
      description: newProject.description || null,
      deadline: newProject.deadline ? new Date(newProject.deadline).toISOString() : null,
      categories: categoriesArray.length > 0 ? categoriesArray : null,
    });

    setNewProject({
      title: "",
      description: "",
      deadline: "",
      categories: "",
    });
    setIsDialogOpen(false);
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
            Projects
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all your organization's projects
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Project title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Project description"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="categories">Categories (comma separated)</Label>
                <Input
                  id="categories"
                  value={newProject.categories}
                  onChange={(e) => setNewProject({ ...newProject, categories: e.target.value })}
                  placeholder="Design, Development, Marketing"
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddProject} className="w-full">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="bg-card border-border p-12 text-center">
          <p className="text-muted-foreground text-lg">
            No projects yet. Create your first project!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="bg-card border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-foreground">{project.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}

                {project.deadline && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Due {format(new Date(project.deadline), "MMM d, yyyy")}</span>
                  </div>
                )}

                {project.categories && project.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.categories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 text-primary border-0"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {members.slice(0, 3).map((member) => (
                      <Avatar key={member.id} className="h-7 w-7 border-2 border-card">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                          {member.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {members.length > 3 && (
                      <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs text-secondary-foreground border-2 border-card">
                        +{members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
