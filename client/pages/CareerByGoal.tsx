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
  const { careerMapData, generateCareerPath } = useDataStore();
  const [currentStage, setCurrentStage] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [generatedPath, setGeneratedPath] = useState<any[]>([]);

  // Get education stages from data store
  const educationStages = careerMapData?.stages
    .filter(stage =>
      stage.id.includes('school') ||
      stage.id.includes('ug_') ||
      stage.id.includes('pg') ||
      stage.id.includes('doctorate')
    )
    .map(stage => ({
      value: stage.id,
      label: stage.label,
      icon: getStageIcon(stage.id)
    })) || [];

  function getStageIcon(stageId: string) {
    if (stageId.includes('school_10')) return BookOpen;
    if (stageId.includes('school_11_12')) return GraduationCap;
    if (stageId.includes('ug_')) return Award;
    if (stageId.includes('pg') || stageId.includes('doctorate')) return Star;
    return Briefcase;
  }

  // Get streams based on stages from data store
  const getStreamsForStage = (stageId: string) => {
    if (!careerMapData) return [];

    return careerMapData.stages
      .filter(stage => {
        if (stageId === "school_10") {
          return stage.id.includes('school_11_12');
        }
        if (stageId.includes('school_11_12')) {
          return stage.id.includes('ug_');
        }
        return false;
      })
      .map(stage => ({
        value: stage.id,
        label: stage.label
      }));
  };

  const streams = currentStage ? { [currentStage]: getStreamsForStage(currentStage) } : {};

  // Get popular careers from data store
  const popularJobs = careerMapData?.careers.map(career => career.title) || [
    "Software Engineer", "Doctor", "IAS Officer", "Teacher", "Data Scientist"
  ];

  // Convert generated path to display format
  const getRoadmapData = () => {
    if (generatedPath.length === 0) return [];

    return generatedPath.map((step, index) => ({
      stage: step.stage,
      title: step.title,
      description: step.description,
      status: index === 0 ? "completed" : index === 1 ? "in-progress" : "pending",
      timeline: getTimeline(index, generatedPath.length),
      details: getStepDetails(step),
      exams: step.exams,
      courses: step.courses
    }));
  };

  const getTimeline = (index: number, total: number) => {
    if (index === 0) return "Current";
    if (index === 1) return "Next 6-12 months";
    if (index === total - 1) return "Final Goal";
    return `${index * 2}-${(index + 1) * 2} years`;
  };

  const getStepDetails = (step: any) => {
    const details = [];

    if (step.exams && step.exams.length > 0) {
      step.exams.forEach((examId: string) => {
        const exam = careerMapData?.exams.find(e => e.id === examId);
        if (exam) {
          details.push(`Prepare for and attempt ${exam.name}`);
        }
      });
    }

    if (step.courses && step.courses.length > 0) {
      step.courses.forEach((courseId: string) => {
        const course = careerMapData?.courses.find(c => c.id === courseId);
        if (course) {
          details.push(`Enroll in ${course.name} program`);
        }
      });
    }

    if (details.length === 0) {
      details.push("Follow the recommended path for this stage");
      details.push("Seek guidance from mentors and counselors");
    }

    return details;
  };

  const handleStartMapping = () => {
    if (currentStage && targetJob) {
      // Find the career goal ID based on the job title
      const careerGoal = careerMapData?.careers.find(
        career => career.title.toLowerCase() === targetJob.toLowerCase()
      );

      if (careerGoal) {
        // Generate real career path using the rules
        const path = generateCareerPath(currentStage, careerGoal.id);
        setGeneratedPath(path);
      } else {
        // Fallback: generate a simple path
        setGeneratedPath([
          {
            stage: currentStage,
            title: "Current Stage",
            description: `You are currently at ${educationStages.find(s => s.value === currentStage)?.label}`,
          },
          {
            stage: "future",
            title: targetJob,
            description: `Your goal is to become a ${targetJob}. This requires dedicated preparation and the right educational path.`,
          }
        ]);
      }
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
                {getRoadmapData().map((step, index) => (
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
