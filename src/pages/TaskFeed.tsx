import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, MapPin, DollarSign, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  description: string;
  brand: string;
  reward: string;
  location: string;
  deadline: string;
  category: string;
}

const TaskFeed = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    import("@/lib/api").then(async (mod) => {
      try {
        const data = await mod.fetchTasks();
        if (mounted) setTasks(data);
      } catch (e) {
        console.error(e);
        toast({ title: "Failed to load tasks", description: String(e) });
      } finally {
        if (mounted) setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [toast]);

  const handleAcceptTask = async (taskId: number, taskTitle: string) => {
    try {
      const api = await import("@/lib/api");
      const result = await api.acceptTask(taskId, { id: 1, name: "Demo Influencer" });
      console.log("acceptTask result:", result);
      toast({
        title: "Task Accepted! 🎉",
        description: `You've successfully accepted "${taskTitle}". Credited: ₹${result.credited}.`,
      });
      // Optionally update UI
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      // Redirect to dashboard so user can see wallet/campaigns
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      toast({ title: "Accept failed", description: e?.message || String(e) });
    }
  };

  const categoryColors: Record<string, string> = {
    "Food & Beverage": "bg-secondary/10 text-secondary border-secondary/20",
    "Fashion": "bg-accent/10 text-accent border-accent/20",
    "Technology": "bg-primary/10 text-primary border-primary/20",
    "Health & Fitness": "bg-green-500/10 text-green-600 border-green-500/20",
    "Education": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Available Tasks</h1>
            <p className="text-muted-foreground text-lg">
              Discover and accept tasks from brands in your area
            </p>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full">Loading tasks...</div>
            ) : (
              tasks.map((task) => (
              <Card 
                key={task.id}
                className="shadow-card border-border hover:shadow-glow transition-smooth"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={categoryColors[task.category] || "bg-muted"}>
                      {task.category}
                    </Badge>
                    <span className="text-2xl font-bold text-primary">{task.reward}</span>
                  </div>
                  <CardTitle className="text-xl">{task.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground font-medium">
                    {task.brand}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground/90">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{task.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{task.deadline} left</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full gradient-primary hover:opacity-90 transition-smooth"
                    onClick={() => handleAcceptTask(task.id, task.title)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Task
                  </Button>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TaskFeed;
