import { useState } from "react";
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
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      title: "Instagram Story Feature",
      description: "Create an engaging Instagram story featuring our new coffee blend. Include product shots and your genuine review.",
      brand: "Local Coffee Co.",
      reward: "$75",
      location: "Downtown",
      deadline: "3 days",
      category: "Food & Beverage",
    },
    {
      id: 2,
      title: "TikTok Video Challenge",
      description: "Participate in our trending dance challenge and tag our boutique. Show off your style with our summer collection!",
      brand: "Urban Style Boutique",
      reward: "$120",
      location: "City Center",
      deadline: "5 days",
      category: "Fashion",
    },
    {
      id: 3,
      title: "Product Unboxing Reel",
      description: "Create a 30-second unboxing video of our latest tech gadget. Focus on features and first impressions.",
      brand: "TechHub Store",
      reward: "$200",
      location: "Tech District",
      deadline: "7 days",
      category: "Technology",
    },
    {
      id: 4,
      title: "Restaurant Review Post",
      description: "Visit our new location and share your dining experience. Include photos of signature dishes and ambiance.",
      brand: "Fusion Kitchen",
      reward: "$90",
      location: "Waterfront",
      deadline: "4 days",
      category: "Food & Beverage",
    },
    {
      id: 5,
      title: "Fitness Class Promotion",
      description: "Attend a complimentary yoga class and post about your experience. Highlight the community atmosphere.",
      brand: "ZenFit Studio",
      reward: "$65",
      location: "Riverside",
      deadline: "6 days",
      category: "Health & Fitness",
    },
  ]);

  const handleAcceptTask = (taskId: number, taskTitle: string) => {
    toast({
      title: "Task Accepted! 🎉",
      description: `You've successfully accepted "${taskTitle}". Check your dashboard for details.`,
    });
  };

  const categoryColors: Record<string, string> = {
    "Food & Beverage": "bg-secondary/10 text-secondary border-secondary/20",
    "Fashion": "bg-accent/10 text-accent border-accent/20",
    "Technology": "bg-primary/10 text-primary border-primary/20",
    "Health & Fitness": "bg-green-500/10 text-green-600 border-green-500/20",
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
            {tasks.map((task) => (
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
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TaskFeed;
