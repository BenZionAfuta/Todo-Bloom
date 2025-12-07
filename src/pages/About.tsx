import { CheckCircle, Code2, Sparkles } from "lucide-react";

const About = () => {
  const features = [
    "Add and manage your daily tasks",
    "Mark tasks as completed",
    "Delete tasks you no longer need",
    "View completed tasks separately",
    "All data saved locally in your browser",
  ];

  const technologies = [
    "React - UI library",
    "TypeScript - Type safety",
    "React Router - Navigation",
    "Tailwind CSS - Styling",
    "Lucide React - Icons",
    "localStorage - Data persistence",
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            About This App
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Modern TODO Application
          </h1>
          
          <p className="text-lg text-muted-foreground">
            A beautiful, minimalistic task management app built with modern web technologies
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">What It Does</h2>
            </div>
            
            <p className="text-muted-foreground mb-4">
              This app helps you stay organized by managing your daily tasks efficiently. 
              With a clean, dark interface and intuitive controls, you can focus on what matters.
            </p>

            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Technologies Used</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            <p>Built with ❤️ using modern web technologies</p>
            <p className="mt-2">© 2025 My TODO App. All tasks stay private in your browser.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
