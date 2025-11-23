import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PlusCircle, Briefcase, Wallet, TrendingUp, DollarSign, Target } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTasks, setActiveTasks] = useState<number | null>(null);

  // dynamic stats will be computed after data loads

  const quickActions = [
    {
      title: "Create Campaign",
      description: "Launch a new influencer campaign for your brand",
      icon: PlusCircle,
      action: () => navigate("/campaign-create"),
      gradient: "gradient-primary",
    },
    {
      title: "View Tasks",
      description: "Browse and accept available tasks from brands",
      icon: Target,
      action: () => navigate("/tasks"),
      gradient: "gradient-secondary",
    },
    {
      title: "Manage Wallet",
      description: "View transactions and manage your earnings",
      icon: Wallet,
      action: () => navigate("/wallet"),
      gradient: "bg-accent",
    },
  ];

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any | null>(null);
  
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ts, cs, w] = await Promise.all([api.fetchTasks(), api.fetchCampaigns(), api.fetchWallet(1)]);
        if (!mounted) return;
        setActiveTasks(Array.isArray(ts) ? ts.length : 0);
        setCampaigns(cs || []);
        setWallet(w || null);
      } catch (e) {
        console.error("Dashboard load error", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const stats = [
    { label: "Active Tasks", value: activeTasks !== null ? String(activeTasks) : "Loading...", icon: Briefcase, color: "text-primary" },
    { label: "Total Earnings", value: wallet ? `₹${wallet.balance}` : "Loading...", icon: DollarSign, color: "text-secondary" },
    { label: "Completion Rate", value: campaigns ? `${Math.min(100, Math.round((campaigns.length || 0) * 10))}%` : "--%", icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Welcome back! Here's what's happening with your campaigns.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="shadow-card border-border hover:shadow-glow transition-smooth">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                      <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

            {/* Wallet + Campaigns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card border-border hover:shadow-glow transition-smooth">
                <CardHeader>
                  <CardTitle>Wallet</CardTitle>
                  <Wallet className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wallet ? `₹${wallet.balance}` : "Loading..."}</div>
                  <p className="text-sm text-muted-foreground mt-2">Available balance</p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Campaigns you created</CardDescription>
                </CardHeader>
                <CardContent>
                  {campaigns.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No campaigns yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {campaigns.map((c) => (
                        <li key={c.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.createdAt}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">{c.status}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card 
                    key={action.title}
                    className="shadow-card border-border hover:shadow-glow transition-smooth cursor-pointer group"
                    onClick={action.action}
                  >
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-xl ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">{action.title}</CardTitle>
                      <CardDescription className="text-base">
                        {action.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
