import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useTeam } from "@/hooks/useTeam";
import { CheckSquare, FolderKanban, Users, TrendingUp, Award, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for productivity chart
const productivityData = [
  { day: "Sun", tasks: 4 },
  { day: "Mon", tasks: 8 },
  { day: "Tue", tasks: 6 },
  { day: "Wed", tasks: 12 },
  { day: "Thu", tasks: 9 },
  { day: "Fri", tasks: 11 },
  { day: "Sat", tasks: 5 },
];

const Dashboard = () => {
  const { tasks, loading: tasksLoading } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();
  const { members, loading: membersLoading } = useTeam();

  const isLoading = tasksLoading || projectsLoading || membersLoading;

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const activeTasks = tasks.filter((t) => t.status !== "completed" && t.status !== "closed").length;

  // Get top team members (simplified - in real app, calculate based on completed tasks)
  const topMembers = members.slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card border-border hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Tasks</p>
                <p className="text-4xl font-bold text-foreground mt-1">{tasks.length}</p>
                <p className="text-xs text-accent mt-2">
                  {completedTasks} completed • {activeTasks} active
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CheckSquare className="w-7 h-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Projects</p>
                <p className="text-4xl font-bold text-foreground mt-1">{projects.length}</p>
                <p className="text-xs text-accent mt-2">Active projects</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                <FolderKanban className="w-7 h-7 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Team Members</p>
                <p className="text-4xl font-bold text-foreground mt-1">{members.length}</p>
                <p className="text-xs text-accent mt-2">Active members</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Large Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="w-5 h-5 text-primary" />
              Weekly Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityData}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorTasks)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Team Members */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Award className="w-5 h-5 text-accent" />
              Top Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Member</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground text-right">Tasks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No team members yet
                    </TableCell>
                  </TableRow>
                ) : (
                  topMembers.map((member, index) => (
                    <TableRow key={member.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {member.full_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{member.full_name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground capitalize">
                          {member.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {Math.floor(Math.random() * 20) + 5}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
