import { useTeam } from "@/hooks/useTeam";
import { Plus, Mail, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const roleColors: Record<string, string> = {
  admin: "bg-destructive/10 text-destructive",
  moderator: "bg-primary/10 text-primary",
  user: "bg-accent/10 text-accent",
  designer: "bg-purple-500/10 text-purple-500",
  pm: "bg-yellow-500/10 text-yellow-500",
  engineer: "bg-blue-500/10 text-blue-500",
};

const Team = () => {
  const { members, loading } = useTeam();

  const handleAddMember = () => {
    toast.info("To add team members, invite them to sign up for the application.");
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
            Team
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members
          </p>
        </div>

        <Button className="bg-primary hover:bg-primary/90" onClick={handleAddMember}>
          <Plus className="w-5 h-5 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Team Grid */}
      {members.length === 0 ? (
        <Card className="bg-card border-border p-12 text-center">
          <p className="text-muted-foreground text-lg">
            No team members yet. Invite people to join!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <Card
              key={member.id}
              className="bg-card border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardContent className="p-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={member.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold">
                    {member.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h3 className="font-semibold text-lg text-foreground mb-1">
                  {member.full_name}
                </h3>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">{member.email}</span>
                </div>

                <Badge
                  className={`${
                    roleColors[member.role || "user"] || roleColors.user
                  } border-0`}
                >
                  <Briefcase className="w-3 h-3 mr-1" />
                  <span className="capitalize">{member.role || "User"}</span>
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
