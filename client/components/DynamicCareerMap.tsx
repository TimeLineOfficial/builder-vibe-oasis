import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, BookOpen, Target, Award, Clock, Users, Star, CheckCircle } from 'lucide-react';

interface CareerMapProps {
  currentStage: string;
  goal: string;
  onPathGenerated?: (path: CareerStep[]) => void;
}

interface CareerStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  requirements: string[];
  options?: string[];
  exams?: string[];
  nextSteps?: string[];
  isCompleted?: boolean;
  isActive?: boolean;
}

export default function DynamicCareerMap({ currentStage, goal, onPathGenerated }: CareerMapProps) {
  const [careerPath, setCareerPath] = useState<CareerStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Comprehensive career mapping database
  const careerMappings = {
    // Class 10th to Doctor
    'class_10_below_doctor': [
      {
        id: 'step_1',
        title: 'Complete 10th Grade',
        description: 'Focus on Science subjects with good grades',
        duration: '1 year',
        requirements: ['Pass 10th with 60%+ marks', 'Strong foundation in Science and Math'],
        nextSteps: ['Choose PCB in 11th-12th']
      },
      {
        id: 'step_2',
        title: 'Choose PCB Stream (11th-12th)',
        description: 'Physics, Chemistry, Biology with optional Math/English',
        duration: '2 years',
        requirements: ['10th passed', 'Interest in biological sciences'],
        options: ['CBSE', 'State Board', 'ISC'],
        nextSteps: ['Prepare for NEET entrance exam']
      },
      {
        id: 'step_3',
        title: 'Clear NEET Entrance',
        description: 'National Eligibility cum Entrance Test for medical colleges',
        duration: '1 year preparation',
        requirements: ['12th with PCB', '50% marks (40% for SC/ST/OBC)'],
        exams: ['NEET-UG'],
        nextSteps: ['Get admission in MBBS college']
      },
      {
        id: 'step_4',
        title: 'MBBS Degree',
        description: 'Bachelor of Medicine and Bachelor of Surgery',
        duration: '5.5 years (4.5 years + 1 year internship)',
        requirements: ['NEET qualification', 'Medical college admission'],
        nextSteps: ['Complete internship', 'Register with Medical Council']
      },
      {
        id: 'step_5',
        title: 'Medical Internship',
        description: 'Compulsory rotating internship in various departments',
        duration: '1 year',
        requirements: ['Completed MBBS course'],
        nextSteps: ['Practice as doctor', 'Pursue specialization']
      },
      {
        id: 'step_6',
        title: 'Career Options',
        description: 'Multiple paths available after MBBS',
        duration: 'Ongoing',
        options: [
          'General Practice',
          'Government Medical Officer',
          'Private Practice',
          'MD/MS Specialization',
          'Fellowship Programs',
          'Research & Academia'
        ],
        requirements: ['Medical registration', 'License to practice']
      }
    ],

    // Class 11th-12th to Engineer
    'class_11_12_engineer': [
      {
        id: 'step_1',
        title: 'Complete 12th with PCM',
        description: 'Physics, Chemistry, Mathematics with good grades',
        duration: '2 years',
        requirements: ['10th passed', 'Choose PCM stream'],
        nextSteps: ['Prepare for JEE/CET entrance exams']
      },
      {
        id: 'step_2',
        title: 'Engineering Entrance Exams',
        description: 'Clear JEE Main/Advanced or state CET exams',
        duration: '1 year preparation',
        requirements: ['12th with PCM', '75% marks (65% for SC/ST)'],
        exams: ['JEE Main', 'JEE Advanced', 'State CET', 'BITSAT', 'VITEEE'],
        nextSteps: ['Choose engineering branch and college']
      },
      {
        id: 'step_3',
        title: 'BTech/BE Degree',
        description: 'Choose specialization based on interest and market demand',
        duration: '4 years',
        requirements: ['Entrance exam qualification'],
        options: [
          'Computer Science Engineering',
          'Electronics & Communication',
          'Mechanical Engineering',
          'Civil Engineering',
          'Electrical Engineering',
          'Chemical Engineering',
          'Aerospace Engineering'
        ],
        nextSteps: ['Internships', 'Skill development', 'Job preparation']
      },
      {
        id: 'step_4',
        title: 'Career Development',
        description: 'Build skills and gain experience',
        duration: '1-2 years',
        requirements: ['BTech degree'],
        options: [
          'Campus Placements',
          'Higher Studies (MTech/MS)',
          'Competitive Exams (GATE/UPSC)',
          'Startup/Entrepreneurship',
          'Certification Courses'
        ]
      }
    ],

    // Commerce to MBA/Finance
    'commerce_mba': [
      {
        id: 'step_1',
        title: 'Complete 12th Commerce',
        description: 'Focus on Accounts, Economics, Business Studies',
        duration: '2 years',
        requirements: ['10th passed', 'Interest in business/commerce'],
        nextSteps: ['Choose bachelor degree - BCom/BBA/CA']
      },
      {
        id: 'step_2',
        title: 'Bachelor Degree Options',
        description: 'Choose based on career goals',
        duration: '3 years',
        options: [
          'BCom (Bachelor of Commerce)',
          'BBA (Bachelor of Business Administration)',
          'CA Foundation + Intermediate',
          'CS Foundation + Executive',
          'CMA Foundation + Intermediate'
        ],
        requirements: ['12th Commerce passed'],
        nextSteps: ['Work experience or direct MBA preparation']
      },
      {
        id: 'step_3',
        title: 'MBA Preparation',
        description: 'Prepare for management entrance exams',
        duration: '1 year',
        requirements: ['Bachelor degree', 'Work experience (preferred)'],
        exams: ['CAT', 'XAT', 'GMAT', 'CMAT', 'MAT', 'SNAP'],
        nextSteps: ['MBA admission']
      },
      {
        id: 'step_4',
        title: 'MBA Specialization',
        description: 'Choose specialization based on career goals',
        duration: '2 years',
        options: [
          'Finance & Investment Banking',
          'Marketing & Sales',
          'Human Resources',
          'Operations & Supply Chain',
          'Data Analytics',
          'Entrepreneurship'
        ],
        nextSteps: ['Management roles', 'Consulting', 'Corporate jobs']
      }
    ],

    // Field switching: Commerce to Tech
    'commerce_tech': [
      {
        id: 'step_1',
        title: 'Assess Current Skills',
        description: 'Evaluate transferable skills from commerce background',
        duration: '1 month',
        requirements: ['Commerce background', 'Basic computer literacy'],
        nextSteps: ['Choose tech specialization']
      },
      {
        id: 'step_2',
        title: 'Foundation Courses',
        description: 'Build technical foundation',
        duration: '3-6 months',
        options: [
          'Programming Fundamentals (Python/Java)',
          'Web Development (HTML/CSS/JavaScript)',
          'Data Analytics',
          'Digital Marketing',
          'Business Analytics'
        ],
        requirements: ['Time commitment', 'Learning resources'],
        nextSteps: ['Specialization training']
      },
      {
        id: 'step_3',
        title: 'Skill Specialization',
        description: 'Deep dive into chosen tech area',
        duration: '6-12 months',
        options: [
          'Full Stack Development',
          'Data Science',
          'Digital Marketing',
          'FinTech',
          'E-commerce Management'
        ],
        requirements: ['Completed foundation courses', 'Portfolio projects'],
        nextSteps: ['Job applications', 'Freelancing', 'Internships']
      }
    ]
  };

  const generateCareerPath = (stage: string, goal: string): CareerStep[] => {
    const key = `${stage}_${goal}`.toLowerCase();
    
    // Try exact match first
    if (careerMappings[key as keyof typeof careerMappings]) {
      return careerMappings[key as keyof typeof careerMappings];
    }
    
    // Try partial matches or generate dynamic path
    if (goal.toLowerCase().includes('doctor') || goal.toLowerCase().includes('medical')) {
      if (stage === 'class_10_below') {
        return careerMappings.class_10_below_doctor;
      }
      // Adapt for other stages
      return careerMappings.class_10_below_doctor.slice(1); // Skip 10th completion if already done
    }
    
    if (goal.toLowerCase().includes('engineer') || goal.toLowerCase().includes('technology')) {
      if (stage === 'class_11_12') {
        return careerMappings.class_11_12_engineer;
      }
      if (stage === 'working_professional' || stage.includes('commerce')) {
        return careerMappings.commerce_tech;
      }
    }
    
    if (goal.toLowerCase().includes('business') || goal.toLowerCase().includes('mba')) {
      return careerMappings.commerce_mba;
    }
    
    // Default generic path
    return [
      {
        id: 'assess',
        title: 'Assess Current Position',
        description: `Evaluate your current education level: ${stage}`,
        duration: '1 week',
        requirements: ['Self assessment', 'Goal clarification'],
        nextSteps: ['Identify required qualifications']
      },
      {
        id: 'plan',
        title: 'Create Learning Plan',
        description: `Develop roadmap towards ${goal}`,
        duration: '2-4 weeks',
        requirements: ['Research', 'Mentor guidance'],
        nextSteps: ['Start skill development']
      },
      {
        id: 'execute',
        title: 'Execute Plan',
        description: 'Begin learning and skill development',
        duration: '6-24 months',
        requirements: ['Dedication', 'Resources', 'Practice'],
        nextSteps: ['Apply for opportunities']
      }
    ];
  };

  useEffect(() => {
    if (currentStage && goal) {
      setIsLoading(true);
      setTimeout(() => {
        const path = generateCareerPath(currentStage, goal);
        setCareerPath(path);
        setIsLoading(false);
        onPathGenerated?.(path);
      }, 500); // Simulate processing time
    }
  }, [currentStage, goal]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Generating your personalized career map...</span>
      </div>
    );
  }

  if (!careerPath.length) {
    return (
      <div className="text-center p-8">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Select your current stage and goal to generate a career map</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Your Personalized Career Map
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          From {currentStage.replace('_', ' ')} to {goal}
        </p>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-12 bottom-0 w-0.5 bg-gray-200"></div>
        
        {careerPath.map((step, index) => (
          <div key={step.id} className="relative flex items-start mb-8">
            {/* Step Number */}
            <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
              {index + 1}
            </div>
            
            {/* Step Content */}
            <Card className="ml-6 flex-1 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {step.duration}
                  </Badge>
                </div>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Requirements */}
                {step.requirements && step.requirements.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-200">Requirements:</h5>
                    <ul className="text-sm space-y-1">
                      {step.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Options */}
                {step.options && step.options.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-200">Available Options:</h5>
                    <div className="flex flex-wrap gap-2">
                      {step.options.map((option, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Exams */}
                {step.exams && step.exams.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-200">Key Exams:</h5>
                    <div className="flex flex-wrap gap-2">
                      {step.exams.map((exam, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {exam}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Next Steps Preview */}
                {step.nextSteps && step.nextSteps.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <h5 className="font-semibold text-sm mb-2 text-gray-700">Next Steps:</h5>
                    <div className="text-sm text-gray-600">
                      {step.nextSteps.slice(0, 2).map((next, i) => (
                        <span key={i} className="inline-flex items-center mr-4">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          {next}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-gray-200">
        <Button className="gap-2">
          <BookOpen className="w-4 h-4" />
          Get Detailed Guide
        </Button>
        <Button variant="outline" className="gap-2">
          <Users className="w-4 h-4" />
          Find Mentors
        </Button>
        <Button variant="outline" className="gap-2">
          <Star className="w-4 h-4" />
          Save Career Map
        </Button>
      </div>
    </div>
  );
}
