import { useState } from "react";
import { useDataStore } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Award,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Star,
  Play,
  Download,
  CheckCircle,
  Circle
} from "lucide-react";

export default function CareerByGoal() {
  const [currentStage, setCurrentStage] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const educationStages = [
    { value: "class10", label: "Class 10th or less", icon: BookOpen },
    { value: "class11-12", label: "Class 11th or 12th", icon: GraduationCap },
    { value: "graduation", label: "Graduation", icon: Award },
    { value: "postgrad", label: "Post-Graduation or PhD", icon: Star },
    { value: "working", label: "Already Working", icon: Briefcase }
  ];

  const streams = {
    "class11-12": [
      { value: "pcm", label: "PCM (Physics, Chemistry, Math)" },
      { value: "pcb", label: "PCB (Physics, Chemistry, Biology)" },
      { value: "pcmb", label: "PCMB (Physics, Chemistry, Math, Biology)" },
      { value: "commerce", label: "Commerce" },
      { value: "arts", label: "Arts/Humanities" }
    ],
    "graduation": [
      { value: "engineering", label: "Engineering" },
      { value: "medicine", label: "Medicine" },
      { value: "science", label: "Science" },
      { value: "commerce", label: "Commerce/Business" },
      { value: "arts", label: "Arts/Humanities" },
      { value: "law", label: "Law" }
    ]
  };

  const popularJobs = [
    "Software Engineer", "Doctor", "IAS Officer", "Teacher", "Data Scientist",
    "Digital Marketer", "Chartered Accountant", "Lawyer", "Civil Engineer",
    "Business Analyst", "Content Creator", "Research Scientist"
  ];

  const sampleRoadmap = [
    {
      stage: "Current Stage",
      title: "Class 12th (PCM)",
      description: "Complete your 12th grade with good marks in Physics, Chemistry, and Mathematics",
      status: "completed",
      timeline: "Current",
      details: [
        "Focus on JEE preparation alongside board exams",
        "Maintain above 85% in board exams",
        "Strong foundation in calculus and physics"
      ]
    },
    {
      stage: "Entrance Exam",
      title: "JEE Main & Advanced",
      description: "Clear engineering entrance exams for admission to top engineering colleges",
      status: "in-progress",
      timeline: "Next 6 months",
      details: [
        "Target JEE Main score: 250+ (95+ percentile)",
        "Attempt JEE Advanced if qualified",
        "Consider state-level engineering entrance exams as backup",
        "Practice 3-4 hours daily with mock tests"
      ]
    },
    {
      stage: "Higher Education",
      title: "B.Tech Computer Science",
      description: "4-year engineering degree specializing in computer science and programming",
      status: "pending",
      timeline: "4 years",
      details: [
        "Choose reputed college (IIT/NIT preferred)",
        "Focus on programming languages: Python, Java, C++",
        "Build projects and contribute to open source",
        "Maintain CGPA above 8.0",
        "Complete internships every summer"
      ]
    },
    {
      stage: "Skill Development",
      title: "Technical Skills & Internships",
      description: "Develop industry-relevant skills and gain practical experience",
      status: "pending",
      timeline: "Throughout degree",
      details: [
        "Master data structures and algorithms",
        "Learn web development (React, Node.js)",
        "Understand database management (SQL, MongoDB)",
        "Complete 2-3 internships at tech companies",
        "Build a strong GitHub portfolio"
      ]
    },
    {
      stage: "Career Goal",
      title: "Software Engineer at Top Tech Company",
      description: "Land a software engineering role at companies like Google, Microsoft, or startups",
      status: "pending",
      timeline: "After graduation",
      details: [
        "Prepare for coding interviews (LeetCode, HackerRank)",
        "Target companies: FAANG, unicorn startups",
        "Expected starting salary: ₹15-25 LPA",
        "Growth path: Senior Engineer → Tech Lead → Engineering Manager"
      ]
    }
  ];

  const handleStartMapping = () => {
    if (currentStage && targetJob) {
      setShowRoadmap(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-career-secondary" />;
      case "in-progress":
        return <Target className="h-6 w-6 text-career-primary" />;
      default:
        return <Circle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-career-secondary bg-career-secondary/5";
      case "in-progress":
        return "border-career-primary bg-career-primary/5";
      default:
        return "border-muted bg-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-career-primary/10 to-career-secondary/10">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="h-10 w-10 text-career-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Career Map by Goal</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us your dream job and current education stage. We'll create a personalized, 
              step-by-step roadmap to help you achieve your career goals.
            </p>
            <Badge variant="secondary" className="px-4 py-2">
              <MapPin className="h-4 w-4 mr-2" />
              Interactive Roadmap Generator
            </Badge>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {!showRoadmap ? (
            /* Input Form */
            <Card className="max-w-2xl mx-auto border-0 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Let's Create Your Career Roadmap</CardTitle>
                <CardDescription className="text-base">
                  Answer a few questions to generate your personalized career path
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Current Stage */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">What's your current education stage?</Label>
                  <Select value={currentStage} onValueChange={setCurrentStage}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your current stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationStages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          <div className="flex items-center gap-2">
                            <stage.icon className="h-4 w-4" />
                            {stage.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Stream Selection (conditional) */}
                {currentStage && streams[currentStage as keyof typeof streams] && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      {currentStage === "class11-12" ? "Which stream are you in?" : "What's your major/specialization?"}
                    </Label>
                    <Select value={selectedStream} onValueChange={setSelectedStream}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your stream/major" />
                      </SelectTrigger>
                      <SelectContent>
                        {streams[currentStage as keyof typeof streams].map((stream) => (
                          <SelectItem key={stream.value} value={stream.value}>
                            {stream.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Target Job */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">What's your dream job or career goal?</Label>
                  <Input
                    placeholder="Type your dream job (e.g., Software Engineer, Doctor, IAS Officer)"
                    value={targetJob}
                    onChange={(e) => setTargetJob(e.target.value)}
                    className="h-12"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">Popular choices:</span>
                    {popularJobs.slice(0, 6).map((job) => (
                      <Badge
                        key={job}
                        variant="outline"
                        className="cursor-pointer hover:bg-career-primary hover:text-white text-xs"
                        onClick={() => setTargetJob(job)}
                      >
                        {job}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleStartMapping}
                  disabled={!currentStage || !targetJob}
                  className="w-full h-12 text-lg bg-gradient-to-r from-career-primary to-career-secondary"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Generate My Career Roadmap
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Generated Roadmap */
            <div className="space-y-8">
              {/* Roadmap Header */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-career-primary to-career-secondary text-white">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Your Career Roadmap</h2>
                      <p className="text-lg opacity-90">
                        From {educationStages.find(s => s.value === currentStage)?.label} to {targetJob}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">5</div>
                      <div className="text-sm opacity-80">Steps to Success</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-4">
                    <Progress value={20} className="flex-1 h-3 bg-white/20" />
                    <span className="text-sm">Step 1 of 5 Complete</span>
                  </div>
                </CardContent>
              </Card>

              {/* Roadmap Steps */}
              <div className="space-y-6">
                {sampleRoadmap.map((step, index) => (
                  <Card 
                    key={index} 
                    className={`border-2 transition-all duration-300 hover:shadow-lg ${getStatusColor(step.status)}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Step Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(step.status)}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <Badge variant="outline" className="mb-2 text-xs">
                                {step.stage}
                              </Badge>
                              <h3 className="text-xl font-semibold">{step.title}</h3>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {step.timeline}
                              </div>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4">{step.description}</p>

                          {/* Expandable Details */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                            className="text-career-primary hover:bg-career-primary/10 p-0 h-auto"
                          >
                            <span className="mr-2">
                              {expandedStep === index ? "Hide Details" : "View Details"}
                            </span>
                            {expandedStep === index ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>

                          {expandedStep === index && (
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                              <h4 className="font-medium mb-3">Detailed Action Plan:</h4>
                              <ul className="space-y-2">
                                {step.details.map((detail, detailIndex) => (
                                  <li key={detailIndex} className="flex items-start gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-career-primary mt-2 flex-shrink-0"></div>
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button size="lg" className="bg-gradient-to-r from-career-secondary to-green-600">
                  <Download className="h-5 w-5 mr-2" />
                  Download Roadmap PDF
                </Button>
                <Button size="lg" variant="outline">
                  <Users className="h-5 w-5 mr-2" />
                  Share with Mentor
                </Button>
                <Button size="lg" variant="outline">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Tutorial
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => setShowRoadmap(false)}
                >
                  Create New Roadmap
                </Button>
              </div>

              {/* Additional Resources */}
              <Card className="bg-muted/20 border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Recommended Resources</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-8 w-8 text-career-primary" />
                      <div>
                        <h4 className="font-medium">Study Materials</h4>
                        <p className="text-sm text-muted-foreground">Curated books and courses</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-career-secondary" />
                      <div>
                        <h4 className="font-medium">Mentorship</h4>
                        <p className="text-sm text-muted-foreground">Connect with industry experts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-career-accent" />
                      <div>
                        <h4 className="font-medium">Progress Tracking</h4>
                        <p className="text-sm text-muted-foreground">Monitor your advancement</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
