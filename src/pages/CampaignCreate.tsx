import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CampaignCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    category: "",
    location: "",
    duration: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    // create campaign via API
    (async () => {
      try {
        const created = await api.createCampaign(formData);
        const name = created?.name || (created?.campaign?.name) || formData.name;
        console.log("createCampaign response:", created);
        toast({ title: "Campaign Created! 🚀", description: `"${name}" is live.` });
        // Reset form
        setFormData({ name: "", description: "", budget: "", category: "", location: "", duration: "" });
        // Redirect to dashboard
        navigate("/dashboard");
      } catch (err: any) {
        console.error("create campaign error:", err);
        const message = err?.message || String(err);
        toast({ title: "Failed to create campaign", description: message, variant: "destructive" });
      }
    })();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Create Campaign</h1>
            <p className="text-muted-foreground text-lg">
              Launch your influencer marketing campaign in minutes
            </p>
          </div>

          {/* Form */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>
                Fill in the information below to create your campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Summer Product Launch"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="transition-smooth"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your campaign goals, target audience, and key messages..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={5}
                    className="transition-smooth"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget *</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.budget}
                      onChange={(e) => handleChange("budget", e.target.value)}
                      className="transition-smooth"
                    />
                    <p className="text-xs text-muted-foreground">Amount in USD</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger id="category" className="transition-smooth">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="fitness">Health & Fitness</SelectItem>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Target Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Downtown, City Center"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="transition-smooth"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Campaign Duration</Label>
                    <Select onValueChange={(value) => handleChange("duration", value)}>
                      <SelectTrigger id="duration" className="transition-smooth">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1week">1 Week</SelectItem>
                        <SelectItem value="2weeks">2 Weeks</SelectItem>
                        <SelectItem value="1month">1 Month</SelectItem>
                        <SelectItem value="3months">3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full gradient-primary hover:opacity-90 transition-smooth text-lg py-6"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Launch Campaign
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CampaignCreate;
