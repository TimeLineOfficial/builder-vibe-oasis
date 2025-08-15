import { useState, useEffect } from "react";
import { useDataStore, getInterestsByCategory } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Heart,
  Filter,
  ArrowRight,
  Lightbulb,
  Palette,
  Calculator,
  Atom,
  Globe,
  Music,
  Camera,
  Code,
  Stethoscope,
  Gavel,
  TrendingUp,
  Users,
  BookOpen,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Building,
  Target
} from "lucide-react";

export default function CareerByInterest() {
  const { careerMapData, findCareersByInterests, getText } = useDataStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [currentStage, setCurrentStage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [careerMatches, setCareerMatches] = useState<any[]>([]);

  // Get interests organized by category from the data store
  const interestsByCategory = getInterestsByCategory();

  // Map categories to display properties
  const getCategoryDisplayProps = (categoryName: string) => {
    const categoryMap: Record<string, { icon: any, color: string }> = {
      "Science": { icon: Atom, color: "from-green-500 to-emerald-500" },
      "Technology": { icon: Code, color: "from-blue-500 to-indigo-500" },
      "Engineering": { icon: Building, color: "from-indigo-500 to-purple-500" },
      "Commerce": { icon: TrendingUp, color: "from-yellow-500 to-orange-500" },
      "Humanities": { icon: Users, color: "from-purple-500 to-violet-500" },
      "Arts": { icon: Palette, color: "from-pink-500 to-rose-500" },
      "Physical Education": { icon: Target, color: "from-red-500 to-pink-500" },
      "Applied Sciences": { icon: Lightbulb, color: "from-emerald-500 to-teal-500" },
      "Healthcare": { icon: Stethoscope, color: "from-red-500 to-pink-500" },
      "Government": { icon: Building, color: "from-career-primary to-purple-600" },
      "Social Science": { icon: Users, color: "from-purple-500 to-violet-500" },
      "Design": { icon: Palette, color: "from-pink-500 to-rose-500" }
    };

    return categoryMap[categoryName] || { icon: Lightbulb, color: "from-gray-500 to-gray-600" };
  };

  // Convert to the expected format for rendering
  const interestCategories = Object.entries(interestsByCategory).map(([categoryName, interests]) => {
    const displayProps = getCategoryDisplayProps(categoryName);
    return {
      id: categoryName.toLowerCase().replace(/\s+/g, '_'),
      name: categoryName,
      icon: displayProps.icon,
      color: displayProps.color,
      interests: interests.map(interest => ({
        id: interest.id,
        name: interest.name,
        popularity: Math.floor(Math.random() * 30) + 70 // Random popularity for now
      }))
    };
  });

  const educationStages = [
    { value: "class10", label: "Class 10th or less" },
    { value: "class11-12", label: "Class 11th or 12th" },
    { value: "graduation", label: "Graduation" },
    { value: "postgrad", label: "Post-Graduation" },
    { value: "working", label: "Already Working" }
  ];

  const filteredCategories = interestCategories.filter(category => {
    if (selectedCategory !== "all" && category.id !== selectedCategory) return false;
    if (searchTerm) {
      return category.interests.some(interest => 
        interest.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const generateCareerSuggestions = () => {
    if (selectedInterests.length > 0 && currentStage) {
      // Use the data store's function to find career matches
      const matches = findCareersByInterests(selectedInterests);
      setCareerMatches(matches);
      setShowResults(true);
    }
  };

  // Generate career suggestions based on real data
  const getCareerSuggestions = () => {
    if (careerMatches.length === 0) {
      return [];
    }

    return careerMatches.slice(0, 3).map(match => ({
      title: match.career.title,
      match: Math.round(match.matchScore),
      salary: getSalaryRange(match.career.id),
      growth: getGrowthRate(match.career.id),
      skills: getRequiredSkills(match.career.id),
      education: getEducationRequirement(match.career),
      companies: getTopCompanies(match.career.id),
      description: getCareerDescription(match.career.id),
      recommendedStream: match.recommendedStream
    }));
  };

  // Helper functions to get additional career data (mock for now, would be in the dataset)
  const getSalaryRange = (careerId: string) => {
    const ranges: Record<string, string> = {
      "doctor": "₹10-50 LPA",
      "software_engineer": "₹8-25 LPA",
      "civil_services": "₹56K-2L PM",
      "chartered_accountant": "₹6-20 LPA",
      "data_scientist": "₹10-30 LPA",
      "nurse": "₹3-8 LPA",
      "lawyer": "₹5-25 LPA",
      "journalist": "₹4-15 LPA",
      "pharmacist": "₹3-12 LPA",
      "police_officer": "₹35K-1L PM"
    };
    return ranges[careerId] || "₹5-15 LPA";
  };

  const getGrowthRate = (careerId: string) => {
    const rates: Record<string, string> = {
      "doctor": "15%",
      "software_engineer": "25%",
      "civil_services": "8%",
      "chartered_accountant": "18%",
      "data_scientist": "30%",
      "nurse": "12%",
      "lawyer": "20%",
      "journalist": "10%",
      "pharmacist": "15%",
      "police_officer": "8%"
    };
    return rates[careerId] || "15%";
  };

  const getRequiredSkills = (careerId: string) => {
    const skills: Record<string, string[]> = {
      "doctor": ["Medical Knowledge", "Patient Care", "Diagnosis"],
      "software_engineer": ["Programming", "Problem Solving", "Algorithms"],
      "civil_services": ["Public Administration", "Leadership", "Policy Making"],
      "chartered_accountant": ["Accounting", "Taxation", "Financial Analysis"],
      "data_scientist": ["Statistics", "Machine Learning", "Python"],
      "nurse": ["Patient Care", "Medical Procedures", "Compassion"],
      "lawyer": ["Legal Research", "Advocacy", "Critical Thinking"],
      "journalist": ["Writing", "Research", "Communication"],
      "pharmacist": ["Drug Knowledge", "Patient Counseling", "Accuracy"],
      "police_officer": ["Law Enforcement", "Physical Fitness", "Investigation"]
    };
    return skills[careerId] || ["Professional Skills", "Communication", "Problem Solving"];
  };

  const getEducationRequirement = (career: any) => {
    if (career.primary_courses && career.primary_courses.length > 0) {
      const courseMap: Record<string, string> = {
        "mbbs": "MBBS",
        "bds": "BDS",
        "bhms": "BHMS",
        "bams": "BAMS",
        "bsc_nursing": "B.Sc Nursing",
        "bpharm": "B.Pharm",
        "btech_cs": "B.Tech Computer Science",
        "btech_me": "B.Tech Mechanical",
        "bca": "BCA",
        "ca_program": "Chartered Accountancy",
        "ba_llb": "BA LLB",
        "ba_journalism": "BA Journalism"
      };
      return courseMap[career.primary_courses[0]] || "Relevant Degree";
    }
    return "Graduation in relevant field";
  };

  const getTopCompanies = (careerId: string) => {
    const companies: Record<string, string[]> = {
      "doctor": ["AIIMS", "Apollo", "Fortis", "Max Healthcare"],
      "software_engineer": ["Google", "Microsoft", "Amazon", "Flipkart"],
      "civil_services": ["IAS", "IPS", "IFS", "Government of India"],
      "chartered_accountant": ["Big 4", "Deloitte", "EY", "KPMG"],
      "data_scientist": ["Netflix", "Uber", "Swiggy", "PhonePe"],
      "nurse": ["AIIMS", "Apollo", "Fortis", "Government Hospitals"],
      "lawyer": ["Supreme Court", "High Courts", "Law Firms", "Corporate Legal"],
      "journalist": ["Times Group", "India Today", "NDTV", "CNN"],
      "pharmacist": ["Sun Pharma", "Dr. Reddy's", "Cipla", "Apollo Pharmacy"],
      "police_officer": ["State Police", "Central Forces", "IPS", "CBI"]
    };
    return companies[careerId] || ["Top Organizations", "Government", "Private Sector", "MNCs"];
  };

  const getCareerDescription = (careerId: string) => {
    const descriptions: Record<string, string> = {
      "doctor": "Diagnose, treat, and prevent illness in patients across various medical specializations.",
      "software_engineer": "Design, develop, and maintain software applications and systems.",
      "civil_services": "Serve the nation through administrative roles in government and public policy.",
      "chartered_accountant": "Provide accounting, taxation, and financial advisory services.",
      "data_scientist": "Analyze complex data to extract insights and drive business decisions.",
      "nurse": "Provide patient care and support in healthcare settings.",
      "lawyer": "Represent clients in legal matters and provide legal advice.",
      "journalist": "Research, write, and report news and stories for various media outlets.",
      "pharmacist": "Dispense medications and provide pharmaceutical care to patients.",
      "police_officer": "Maintain law and order, investigate crimes, and ensure public safety."
    };
    return descriptions[careerId] || "Professional role in this field with growth opportunities.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-10 w-10 text-pink-500" />
              <h1 className="text-4xl md:text-5xl font-bold">Career by Interest</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover career paths that align with your passions and interests. 
              Select subjects and topics you love, and we'll show you perfect career matches.
            </p>
            <Badge variant="secondary" className="px-4 py-2">
              <Lightbulb className="h-4 w-4 mr-2" />
              Passion-Driven Career Discovery
            </Badge>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {!showResults ? (
            <div className="space-y-8">
              {/* Search and Filters */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Search interests (e.g., Programming, Photography, Medicine...)"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 h-12"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48 h-12">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {interestCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={currentStage} onValueChange={setCurrentStage}>
                        <SelectTrigger className="w-48 h-12">
                          <SelectValue placeholder="Your Education Stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {educationStages.map((stage) => (
                            <SelectItem key={stage.value} value={stage.value}>
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interest Categories */}
              <div className="space-y-8">
                {filteredCategories.map((category) => (
                  <Card key={category.id} className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className={`bg-gradient-to-r ${category.color} text-white p-6`}>
                      <div className="flex items-center gap-3">
                        <category.icon className="h-8 w-8" />
                        <div>
                          <CardTitle className="text-2xl">{category.name}</CardTitle>
                          <CardDescription className="text-white/80">
                            {category.interests.length} interests available
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {category.interests
                          .filter(interest => 
                            !searchTerm || interest.name.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((interest) => (
                          <div key={interest.id} className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={interest.id}
                                checked={selectedInterests.includes(interest.id)}
                                onCheckedChange={() => handleInterestToggle(interest.id)}
                              />
                              <label
                                htmlFor={interest.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {interest.name}
                              </label>
                            </div>
                            <div className="ml-6">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Popularity</span>
                                <span>{interest.popularity}%</span>
                              </div>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-500`}
                                  style={{ width: `${interest.popularity}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Interests Summary */}
              {selectedInterests.length > 0 && (
                <Card className="border-2 border-career-primary/20 bg-career-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Selected Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedInterests.slice(0, 6).map((interestId) => {
                            const interest = interestCategories
                              .flatMap(c => c.interests)
                              .find(i => i.id === interestId);
                            return (
                              <Badge key={interestId} variant="secondary">
                                {interest?.name}
                              </Badge>
                            );
                          })}
                          {selectedInterests.length > 6 && (
                            <Badge variant="outline">+{selectedInterests.length - 6} more</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={generateCareerSuggestions}
                        disabled={!currentStage}
                        className="bg-gradient-to-r from-career-primary to-purple-600"
                        size="lg"
                      >
                        <MapPin className="h-5 w-5 mr-2" />
                        {getText('btn_find_matches')}
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                    {!currentStage && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Please select your education stage to continue
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Career Suggestions Results */
            <div className="space-y-8">
              {/* Results Header */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-career-primary to-purple-600 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Your Career Matches</h2>
                      <p className="text-lg opacity-90">
                        Based on {selectedInterests.length} interests and your education stage
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{getCareerSuggestions().length}</div>
                      <div className="text-sm opacity-80">Perfect Matches</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Cards */}
              <div className="space-y-6">
                {getCareerSuggestions().map((career, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-2xl font-bold">{career.title}</h3>
                            <div className="flex items-center gap-2">
                              <Star className="h-5 w-5 text-yellow-500 fill-current" />
                              <span className="text-lg font-semibold text-career-primary">
                                {career.match}% Match
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-6">{career.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Required Skills
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {career.skills.map((skill) => (
                                  <Badge key={skill} variant="outline">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Top Companies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {career.companies.map((company) => (
                                  <Badge key={company} variant="secondary">
                                    {company}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="lg:w-80 space-y-4">
                          <Card className="bg-muted/50">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm font-medium">
                                  <DollarSign className="h-4 w-4" />
                                  Salary Range
                                </span>
                                <span className="font-semibold">{career.salary}</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm font-medium">
                                  <TrendingUp className="h-4 w-4" />
                                  Growth Rate
                                </span>
                                <span className="font-semibold text-career-secondary">{career.growth}</span>
                              </div>
                              
                              <div className="pt-2 border-t">
                                <span className="text-sm font-medium">Education Required:</span>
                                <p className="text-sm text-muted-foreground mt-1">{career.education}</p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <div className="space-y-2">
                            <Button className="w-full" size="lg">
                              <MapPin className="h-4 w-4 mr-2" />
                              View Career Roadmap
                            </Button>
                            <Button variant="outline" className="w-full">
                              <Clock className="h-4 w-4 mr-2" />
                              Save for Later
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="text-center space-y-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowResults(false)}
                >
                  Explore More Interests
                </Button>
                <p className="text-sm text-muted-foreground">
                  Want to refine your results? Go back and adjust your interest selections.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
