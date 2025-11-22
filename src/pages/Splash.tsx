import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Zap, Users } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10 animate-pulse" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Logo and branding */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-glow mb-4 animate-bounce">
          <Zap className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Klix
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Connect brands with hyperlocal micro-influencers. Create campaigns, discover tasks, and grow your influence.
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 mb-8">
          <div className="p-6 rounded-2xl bg-card shadow-card border border-border hover:shadow-glow transition-smooth">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Task-Based Collaboration</h3>
            <p className="text-sm text-muted-foreground">Accept and complete tasks from brands you love</p>
          </div>

          <div className="p-6 rounded-2xl bg-card shadow-card border border-border hover:shadow-glow transition-smooth">
            <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Payouts</h3>
            <p className="text-sm text-muted-foreground">Get paid immediately for completed work</p>
          </div>

          <div className="p-6 rounded-2xl bg-card shadow-card border border-border hover:shadow-glow transition-smooth">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Hyperlocal Discovery</h3>
            <p className="text-sm text-muted-foreground">Connect with brands in your community</p>
          </div>
        </div>

        <Button
          size="lg"
          className="text-lg px-8 py-6 gradient-primary hover:opacity-90 shadow-glow transition-smooth"
          onClick={() => navigate("/dashboard")}
        >
          Get Started
          <Zap className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Splash;
