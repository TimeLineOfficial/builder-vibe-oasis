import React, { useState, useEffect } from "react";
import { useDataStore } from "../lib/data-service";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  Target,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";
import AdvancedCareerMapping from "../components/AdvancedCareerMapping";
import DynamicCareerMap from "../components/DynamicCareerMap";

type Step = "stage" | "stream" | "course" | "results";

interface SelectedOptions {
  stage: string;
  stream: string;
  course: string;
}

export default function CareerByGoal() {
  const {
    careerMapData,
    currentLanguage,
    getText,
    generateCareerPath,
    getEducationStages,
    getStreamsByStage,
    getCoursesByStream,
    getCareerSwitchPaths,
    getCareerNotes,
    getYouTubeLectures,
  } = useDataStore();

  const [currentStep, setCurrentStep] = useState<Step>("stage");
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    stage: "",
    stream: "",
    course: "",
  });
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [careerSwitchPaths, setCareerSwitchPaths] = useState<any[]>([]);
  const [showAdvancedMapping, setShowAdvancedMapping] = useState(false);
  const [showAdvancedCareerModal, setShowAdvancedCareerModal] = useState(false);

  const educationStages = getEducationStages();

  const handleStageSelect = (stageId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      stage: stageId,
      stream: "",
      course: "",
    }));
    setCurrentStep("stream");
  };

  const handleStreamSelect = (stream: string) => {
    setSelectedOptions((prev) => ({ ...prev, stream, course: "" }));

    // For working professionals, skip course selection and go to results
    if (selectedOptions.stage === "working_professional") {
      setCurrentStep("results");
      generateResults(selectedOptions.stage, stream, "");
    } else {
      setCurrentStep("course");
    }
  };

  const handleCourseSelect = (course: string) => {
    setSelectedOptions((prev) => ({ ...prev, course }));
    setCurrentStep("results");
    generateResults(selectedOptions.stage, selectedOptions.stream, course);
  };

  const generateResults = (stage: string, stream: string, course: string) => {
    // Generate career paths based on selection
    const goal = course || stream;
    const paths = generateCareerPath(stage, goal);
    setCareerPaths(paths);

    // For working professionals, show career switch paths
    if (stage === "working_professional") {
      const switchPaths = getCareerSwitchPaths(stream, "Data Science"); // Example target
      setCareerSwitchPaths(switchPaths);
    }
  };

  const resetFlow = () => {
    setCurrentStep("stage");
    setSelectedOptions({ stage: "", stream: "", course: "" });
    setCareerPaths([]);
    setCareerSwitchPaths([]);
    setShowAdvancedMapping(false);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-4">
      {(["stage", "stream", "course", "results"] as Step[]).map(
        (step, index) => {
          const isActive = currentStep === step;
          const isCompleted =
            ["stage", "stream", "course", "results"].indexOf(currentStep) >
            index;

          // Skip course step for working professionals
          if (
            step === "course" &&
            selectedOptions.stage === "working_professional"
          ) {
            return null;
          }

          return (
            <React.Fragment key={step}>
              <div
                className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isCompleted
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
              }
            `}
              >
                {index + 1}
              </div>
              {(index < 3 && step !== "course") ||
              (step === "course" &&
                selectedOptions.stage !== "working_professional") ? (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              ) : null}
            </React.Fragment>
          );
        },
      )}
    </div>
  );

  const renderStageSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          What's your current education level?
        </h2>
        <p className="text-gray-600">
          Select your current stage to get personalized career guidance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {educationStages.map((stage) => (
          <Card
            key={stage.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-500 group"
            onClick={() => handleStageSelect(stage.id)}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <BookOpen className="w-12 h-12 mx-auto text-blue-600 group-hover:text-blue-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{stage.label}</h3>
              <p className="text-sm text-gray-600">
                {stage.id === "class_10_below" &&
                  "Foundation level guidance for future planning"}
                {stage.id === "class_11_12" &&
                  "Stream selection for higher education"}
                {stage.id === "undergraduate" &&
                  "Course and specialization guidance"}
                {stage.id === "postgraduate" &&
                  "Advanced degree and research options"}
                {stage.id === "phd" && "Research and academic career paths"}
                {stage.id === "working_professional" &&
                  "Career switch and upskilling options"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStreamSelection = () => {
    const streams = getStreamsByStage(selectedOptions.stage);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {selectedOptions.stage === "working_professional"
              ? "What's your current industry/domain?"
              : "Choose your stream/field"}
          </h2>
          <p className="text-gray-600">
            {selectedOptions.stage === "working_professional"
              ? "This helps us suggest relevant career transitions"
              : "Select the area you want to pursue or are interested in"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {streams.map((stream) => (
            <Card
              key={stream}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-500 group"
              onClick={() => handleStreamSelect(stream)}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Target className="w-12 h-12 mx-auto text-green-600 group-hover:text-green-700" />
                </div>
                <h3 className="font-semibold text-lg">{stream}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={resetFlow}>
            Back to Education Level
          </Button>
        </div>
      </div>
    );
  };

  const renderCourseSelection = () => {
    const courses = getCoursesByStream(selectedOptions.stream);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            Select your specific course/specialization
          </h2>
          <p className="text-gray-600">
            Choose the specific area within {selectedOptions.stream}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card
              key={course}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-500 group"
              onClick={() => handleCourseSelect(course)}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Users className="w-12 h-12 mx-auto text-purple-600 group-hover:text-purple-700" />
                </div>
                <h3 className="font-semibold text-lg">{course}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generate Career Map Button */}
        {selectedOptions.course && (
          <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-700">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Ready to See Your Career Path?
            </h3>
            <p className="text-blue-700 dark:text-blue-200 mb-4">
              Generate a personalized roadmap based on your selections: {selectedOptions.stage} → {selectedOptions.stream} → {selectedOptions.course}
            </p>
            <Button
              onClick={() => setCurrentStep('results')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🗺️ Generate My Career Map
            </Button>
          </div>
        )}

        <div className="text-center">
          <Button variant="outline" onClick={() => setCurrentStep("stream")}>
            Back to Stream Selection
          </Button>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Your Personalized Career Roadmap
        </h2>
        <p className="text-gray-600">
          Based on your selection: {selectedOptions.stage} →{" "}
          {selectedOptions.stream}
          {selectedOptions.course && ` → ${selectedOptions.course}`}
        </p>
      </div>

      {/* Dynamic Career Map */}
      <DynamicCareerMap
        currentStage={selectedOptions.stage}
        goal={selectedOptions.course || selectedOptions.stream}
        onPathGenerated={(path) => {
          console.log('Career path generated:', path);
        }}
      />

      {/* Career Path Steps */}
      {careerPaths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recommended Career Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {careerPaths.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{step.title}</h4>
                    <p className="text-gray-600 mb-2">{step.description}</p>

                    {step.exams && step.exams.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Key Exams: </span>
                        {step.exams.map((exam: string, i: number) => (
                          <Badge key={i} variant="outline" className="mr-1">
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {step.courses && step.courses.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">
                          Recommended Courses:{" "}
                        </span>
                        {step.courses.map((course: string, i: number) => (
                          <Badge key={i} variant="secondary" className="mr-1">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Career Switch Paths for Working Professionals */}
      {careerSwitchPaths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Career Transition Guide
            </CardTitle>
            <CardDescription>
              Step-by-step guide to switch from {selectedOptions.stream} to
              trending fields
            </CardDescription>
          </CardHeader>
          <CardContent>
            {careerSwitchPaths.map((switchPath, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg">{switchPath.path}</h4>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      {switchPath.duration}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <DollarSign className="w-3 h-3" />
                      {switchPath.estimated_cost}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-2">
                  {switchPath.steps.map((step: string, stepIndex: number) => (
                    <div
                      key={stepIndex}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {stepIndex + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 text-sm">
                  <span>
                    <strong>Success Rate:</strong> {switchPath.success_rate}
                  </span>
                  <span>
                    <strong>Difficulty:</strong> {switchPath.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Advanced Career Mapping Toggle */}
      <div className="text-center">
        <Button
          onClick={() => setShowAdvancedMapping(!showAdvancedMapping)}
          variant="outline"
          className="mr-4"
        >
          {showAdvancedMapping ? "Hide" : "Show"} Advanced Career Resources
        </Button>
        <Button
          onClick={() => setShowAdvancedCareerModal(true)}
          className="mr-4"
        >
          Get Complete Career Roadmap
        </Button>
        <Button onClick={resetFlow} variant="outline">
          Start Over
        </Button>
      </div>

      {/* Advanced Career Resources */}
      {showAdvancedMapping && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Career Notes & Guide</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const notes = getCareerNotes(
                  selectedOptions.course || selectedOptions.stream,
                );
                return (
                  <div className="space-y-4">
                    <p className="text-gray-600">{notes.summary}</p>

                    <div>
                      <h5 className="font-semibold mb-2">Key Topics:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {notes.topics.map((topic: string, i: number) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">Learning Timeline:</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <strong>Beginner:</strong> {notes.timeline.beginner}
                        </div>
                        <div>
                          <strong>Intermediate:</strong>{" "}
                          {notes.timeline.intermediate}
                        </div>
                        <div>
                          <strong>Advanced:</strong> {notes.timeline.advanced}
                        </div>
                        <div>
                          <strong>Expert:</strong> {notes.timeline.expert}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>YouTube Lectures</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const lectures = getYouTubeLectures(
                  selectedOptions.course || selectedOptions.stream,
                );
                return (
                  <div className="space-y-3">
                    {lectures.map((lecture: any, i: number) => (
                      <div key={i} className="border rounded-lg p-3">
                        <h6 className="font-semibold text-sm">
                          {lecture.title}
                        </h6>
                        <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
                          <span>{lecture.channel}</span>
                          <span>{lecture.duration}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {lecture.views} views
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              ★ {lecture.rating}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="link"
                            className="text-xs p-0"
                          >
                            Watch Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {getText("career_by_goal_title", currentLanguage) ||
              "Career by Goal"}
          </h1>
          <p className="text-xl text-gray-600">
            {getText("career_by_goal_subtitle", currentLanguage) ||
              "Get personalized career guidance based on your current education level and goals"}
          </p>
        </div>

        <StepIndicator />

        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === "stage" && renderStageSelection()}
          {currentStep === "stream" && renderStreamSelection()}
          {currentStep === "course" && renderCourseSelection()}
          {currentStep === "results" && renderResults()}
        </div>

        {/* Advanced Career Mapping Modal */}
        {showAdvancedCareerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    Complete Career Roadmap
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedCareerModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <AdvancedCareerMapping
                  selectedField={
                    selectedOptions.course || selectedOptions.stream
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
