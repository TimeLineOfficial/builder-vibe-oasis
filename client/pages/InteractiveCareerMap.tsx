import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin,
  Target,
  Search,
  Compass,
  Route,
  Star,
  Play,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Zap,
  Building,
  GraduationCap
} from "lucide-react";

export default function InteractiveCareerMap() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const careerFields = [
    { value: "technology", label: "Technology & Engineering", color: "from-blue-500 to-indigo-500" },
    { value: "healthcare", label: "Healthcare & Medicine", color: "from-red-500 to-pink-500" },
    { value: "business", label: "Business & Finance", color: "from-yellow-500 to-orange-500" },
    { value: "creative", label: "Creative & Design", color: "from-purple-500 to-pink-500" },
    { value: "education", label: "Education & Research", color: "from-green-500 to-emerald-500" },
    { value: "government", label: "Government & Public Service", color: "from-career-primary to-purple-600" }
  ];

  const educationLevels = [
    { value: "school", label: "School Level (10th-12th)" },
    { value: "undergraduate", label: "Undergraduate" },
    { value: "postgraduate", label: "Postgraduate" },
    { value: "professional", label: "Professional Level" }
  ];

  const careerNodes = [
    {
      id: "center",
      title: "You",
      subtitle: "Start Your Journey",
      x: 50,
      y: 50,
      type: "center",
      color: "bg-gradient-to-r from-career-primary to-career-secondary",
      description: "Your starting point for career exploration"
    },
    {
      id: "tech1",
      title: "Software Engineer",
      subtitle: "Build Applications",
      x: 75,
      y: 25,
      type: "career",
      field: "technology",
      level: "undergraduate",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      salary: "₹8-25 LPA",
      growth: "High",
      demand: "Very High",
      description: "Design, develop, and maintain software applications and systems"
    },
    {
      id: "tech2",
      title: "Data Scientist",
      subtitle: "Analyze Data",
      x: 85,
      y: 40,
      type: "career",
      field: "technology",
      level: "postgraduate",
      color: "bg-gradient-to-r from-blue-600 to-purple-600",
      salary: "₹12-35 LPA",
      growth: "Very High",
      demand: "High",
      description: "Extract insights from complex data using statistical and ML techniques"
    },
    {
      id: "health1",
      title: "Doctor",
      subtitle: "Heal People",
      x: 25,
      y: 20,
      type: "career",
      field: "healthcare",
      level: "professional",
      color: "bg-gradient-to-r from-red-500 to-pink-500",
      salary: "₹10-50 LPA",
      growth: "High",
      demand: "High",
      description: "Diagnose, treat, and prevent illness in patients"
    },
    {
      id: "health2",
      title: "Nurse",
      subtitle: "Care for Patients",
      x: 15,
      y: 35,
      type: "career",
      field: "healthcare",
      level: "undergraduate",
      color: "bg-gradient-to-r from-pink-500 to-rose-500",
      salary: "₹3-8 LPA",
      growth: "Medium",
      demand: "High",
      description: "Provide patient care and support in healthcare settings"
    },
    {
      id: "business1",
      title: "Business Analyst",
      subtitle: "Solve Business Problems",
      x: 75,
      y: 70,
      type: "career",
      field: "business",
      level: "undergraduate",
      color: "bg-gradient-to-r from-yellow-500 to-orange-500",
      salary: "₹6-18 LPA",
      growth: "High",
      demand: "High",
      description: "Analyze business processes and recommend improvements"
    },
    {
      id: "gov1",
      title: "IAS Officer",
      subtitle: "Serve the Nation",
      x: 25,
      y: 75,
      type: "career",
      field: "government",
      level: "undergraduate",
      color: "bg-gradient-to-r from-career-primary to-purple-600",
      salary: "₹56K-2L PM",
      growth: "High",
      demand: "Medium",
      description: "Lead administrative functions and policy implementation"
    },
    {
      id: "creative1",
      title: "UX Designer",
      subtitle: "Design Experiences",
      x: 60,
      y: 15,
      type: "career",
      field: "creative",
      level: "undergraduate",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      salary: "₹4-15 LPA",
      growth: "Very High",
      demand: "High",
      description: "Create user-friendly digital experiences and interfaces"
    },
    {
      id: "edu1",
      title: "Professor",
      subtitle: "Teach & Research",
      x: 40,
      y: 80,
      type: "career",
      field: "education",
      level: "postgraduate",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      salary: "₹6-20 LPA",
      growth: "Medium",
      demand: "Medium",
      description: "Conduct research and educate students in higher education"
    }
  ];

  const pathways = [
    { from: "center", to: "tech1", color: "stroke-blue-500" },
    { from: "center", to: "tech2", color: "stroke-purple-500" },
    { from: "center", to: "health1", color: "stroke-red-500" },
    { from: "center", to: "health2", color: "stroke-pink-500" },
    { from: "center", to: "business1", color: "stroke-yellow-500" },
    { from: "center", to: "gov1", color: "stroke-career-primary" },
    { from: "center", to: "creative1", color: "stroke-purple-500" },
    { from: "center", to: "edu1", color: "stroke-green-500" }
  ];

  const filteredNodes = careerNodes.filter(node => {
    if (node.type === "center") return true;
    if (selectedField !== "all" && node.field !== selectedField) return false;
    if (selectedLevel !== "all" && node.level !== selectedLevel) return false;
    if (searchTerm && !node.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "Very High": return "text-green-600 bg-green-50";
      case "High": return "text-blue-600 bg-blue-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-career-primary/10 to-purple-500/10">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="h-10 w-10 text-career-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Interactive Career Map</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore career paths visually with our interactive map. Discover connections between 
              different roles, required skills, and progression pathways in various fields.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2">
                <Compass className="h-4 w-4 mr-2" />
                Visual Exploration
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Route className="h-4 w-4 mr-2" />
                Career Pathways
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                Goal Planning
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Controls Panel */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Explore Careers
                  </CardTitle>
                  <CardDescription>
                    Filter and search to find your ideal career path
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Careers</label>
                    <Input
                      placeholder="e.g., Software Engineer, Doctor"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Career Field</label>
                    <Select value={selectedField} onValueChange={setSelectedField}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Fields" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Fields</SelectItem>
                        {careerFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Education Level</label>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        {educationLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Target className="h-4 w-4 mr-2" />
                        Set Career Goal
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Route className="h-4 w-4 mr-2" />
                        View Pathway
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Get Guidance
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Field Legend */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Career Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerFields.map((field) => (
                      <div key={field.value} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${field.color}`}></div>
                        <span className="text-sm">{field.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Map */}
            <div className="lg:col-span-3">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Career Universe
                  </CardTitle>
                  <CardDescription>
                    Click on any career to explore details and pathways
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Map Container */}
                  <div className="relative h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                    {/* SVG for connection lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {pathways.map((path, index) => {
                        const fromNode = filteredNodes.find(n => n.id === path.from);
                        const toNode = filteredNodes.find(n => n.id === path.to);
                        if (!fromNode || !toNode) return null;
                        
                        const x1 = (fromNode.x / 100) * 100;
                        const y1 = (fromNode.y / 100) * 100;
                        const x2 = (toNode.x / 100) * 100;
                        const y2 = (toNode.y / 100) * 100;
                        
                        return (
                          <line
                            key={index}
                            x1={`${x1}%`}
                            y1={`${y1}%`}
                            x2={`${x2}%`}
                            y2={`${y2}%`}
                            className={`${path.color} stroke-2 opacity-30`}
                            strokeDasharray="5,5"
                          />
                        );
                      })}
                    </svg>

                    {/* Career Nodes */}
                    {filteredNodes.map((node) => (
                      <div
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className={`relative ${node.color} text-white rounded-xl p-4 shadow-lg min-w-[180px] text-center ${
                          node.type === "center" ? "w-24 h-24 flex items-center justify-center" : ""
                        }`}>
                          {node.type === "center" ? (
                            <div>
                              <div className="text-2xl font-bold">You</div>
                              <div className="text-xs opacity-80">Start Here</div>
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-bold text-sm">{node.title}</h3>
                              <p className="text-xs opacity-80">{node.subtitle}</p>
                              {node.salary && (
                                <div className="text-xs mt-1 bg-white/20 rounded px-2 py-1">
                                  {node.salary}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Pulse animation for center node */}
                          {node.type === "center" && (
                            <div className="absolute inset-0 rounded-xl animate-ping bg-white/20"></div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Hover Details */}
                    {hoveredNode && hoveredNode !== "center" && (
                      <div className="absolute bottom-4 left-4 right-4">
                        {(() => {
                          const node = filteredNodes.find(n => n.id === hoveredNode);
                          if (!node) return null;
                          return (
                            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg">{node.title}</h3>
                                    <p className="text-sm text-muted-foreground">{node.description}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    {node.demand && (
                                      <Badge className={getDemandColor(node.demand)}>
                                        {node.demand} Demand
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Salary:</span>
                                    <div className="font-medium">{node.salary}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Growth:</span>
                                    <div className="font-medium">{node.growth}</div>
                                  </div>
                                  <div>
                                    <Button size="sm" className="w-full">
                                      <Target className="h-3 w-3 mr-1" />
                                      Explore
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Map Actions */}
              <div className="flex flex-wrap gap-4 mt-6">
                <Button className="bg-gradient-to-r from-career-primary to-purple-600">
                  <Route className="h-4 w-4 mr-2" />
                  Create Roadmap
                </Button>
                <Button variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Take Tour
                </Button>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Join Community
                </Button>
                <Button variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Skill Assessment
                </Button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-career-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Visual Exploration</h3>
                <p className="text-muted-foreground">
                  Discover career connections and pathways through interactive visualization
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-career-secondary to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Growth Insights</h3>
                <p className="text-muted-foreground">
                  Understand salary ranges, growth potential, and market demand for each career
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Recommendations</h3>
                <p className="text-muted-foreground">
                  Get personalized career suggestions based on your interests and background
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
