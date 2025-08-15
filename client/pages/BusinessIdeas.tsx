import { useState, useEffect } from "react";
import { useDataStore, getBusinessIdeasByCategory, formatCurrency } from "@/lib/data-service";
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
  Search, 
  Filter,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  ExternalLink,
  ArrowRight,
  Building,
  Zap,
  Target,
  Award,
  Rocket,
  PieChart
} from "lucide-react";

export default function BusinessIdeas() {
  const {
    careerMapData,
    businessIdeasPage,
    businessIdeasPerPage,
    loadMoreBusinessIdeas,
    getText
  } = useDataStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [investmentRange, setInvestmentRange] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const categories = [
    { value: "ecommerce", label: "E-commerce & Retail", icon: "🛒" },
    { value: "food", label: "Food & Beverage", icon: "🍕" },
    { value: "tech", label: "Technology & Apps", icon: "💻" },
    { value: "services", label: "Service Business", icon: "🔧" },
    { value: "health", label: "Health & Wellness", icon: "💪" },
    { value: "education", label: "Education & Training", icon: "📚" },
    { value: "manufacturing", label: "Manufacturing", icon: "🏭" },
    { value: "agriculture", label: "Agriculture & Farming", icon: "🌾" },
    { value: "fashion", label: "Fashion & Beauty", icon: "👗" },
    { value: "travel", label: "Travel & Tourism", icon: "✈️" }
  ];

  const investmentRanges = [
    { value: "0-50k", label: "₹0 - ₹50K" },
    { value: "50k-2l", label: "₹50K - ₹2L" },
    { value: "2l-5l", label: "₹2L - ₹5L" },
    { value: "5l-10l", label: "₹5L - ₹10L" },
    { value: "10l+", label: "₹10L+" }
  ];

  // Get business ideas from the data store
  const businessIdeasByCategory = getBusinessIdeasByCategory();

  // Convert to the expected format and add additional properties
  const businessIdeas = Object.values(businessIdeasByCategory)
    .flat()
    .map((idea, index) => ({
      id: index + 1,
      title: idea.name,
      category: idea.category.toLowerCase(),
      description: getBusinessDescription(idea.id),
      investment: formatCurrency(idea.min_capital_inr),
      monthlyRevenue: getEstimatedRevenue(idea.min_capital_inr),
      roi: getEstimatedROI(idea.category),
      difficulty: getDifficulty(idea.min_capital_inr),
      timeToStart: getTimeToStart(idea.category),
      popularityScore: Math.floor(Math.random() * 30) + 70,
      successRate: Math.floor(Math.random() * 20) + 60,
      trending: Math.random() > 0.7,
      featured: Math.random() > 0.8,
      permits: idea.documents,
      skills: getRequiredSkills(idea.category),
      marketSize: getMarketSize(idea.category),
      targetAudience: getTargetAudience(idea.category),
      competition: getCompetitionLevel(idea.category),
      scalability: getScalability(idea.category)
    }));

  // Helper functions for additional business data
  const getBusinessDescription = (ideaId: string) => {
    const descriptions: Record<string, string> = {
      "diag_centre": "Start a diagnostic center offering medical tests, imaging, and health checkup services.",
      "pharmacy_store": "Open a retail pharmacy selling medicines, healthcare products, and wellness items.",
      "coaching_center": "Establish a coaching institute for competitive exams and academic subjects.",
      "ecom_private_label": "Create your own brand and sell products through e-commerce platforms.",
      "uiux_agency": "Provide UI/UX design services for websites, apps, and digital products.",
      "cloud_kitchen": "Start a delivery-only restaurant without dine-in space."
    };
    return descriptions[ideaId] || "A promising business opportunity with good growth potential.";
  };

  const getEstimatedRevenue = (investment: number) => {
    const monthlyMultiplier = 0.3; // Assuming 30% of investment as monthly revenue
    const monthly = investment * monthlyMultiplier;
    return `${formatCurrency(Math.floor(monthly * 0.5))}-${formatCurrency(Math.floor(monthly * 1.5))}`;
  };

  const getEstimatedROI = (category: string) => {
    const roiRanges: Record<string, string> = {
      "Healthcare": "20-35%",
      "Education": "25-40%",
      "E-commerce": "30-50%",
      "Services": "35-60%",
      "Food": "25-45%"
    };
    return roiRanges[category] || "20-40%";
  };

  const getDifficulty = (investment: number) => {
    if (investment < 300000) return "Easy";
    if (investment < 1000000) return "Medium";
    return "Hard";
  };

  const getTimeToStart = (category: string) => {
    const timeRanges: Record<string, string> = {
      "Healthcare": "3-6 months",
      "Education": "2-4 months",
      "E-commerce": "1-3 months",
      "Services": "1-2 months",
      "Food": "2-4 months"
    };
    return timeRanges[category] || "2-4 months";
  };

  const getRequiredSkills = (category: string) => {
    const skills: Record<string, string[]> = {
      "Healthcare": ["Medical Knowledge", "Patient Care", "Business Management"],
      "Education": ["Teaching", "Curriculum Design", "Student Management"],
      "E-commerce": ["Digital Marketing", "Inventory Management", "Customer Service"],
      "Services": ["Technical Skills", "Client Management", "Project Management"],
      "Food": ["Cooking", "Food Safety", "Supply Chain Management"]
    };
    return skills[category] || ["Business Management", "Marketing", "Operations"];
  };

  const getMarketSize = (category: string) => {
    const sizes: Record<string, string> = {
      "Healthcare": "₹8,000 Cr (Growing 18% annually)",
      "Education": "₹4,500 Cr (Growing 25% annually)",
      "E-commerce": "₹12,000 Cr (Growing 30% annually)",
      "Services": "₹6,000 Cr (Growing 22% annually)",
      "Food": "₹5,500 Cr (Growing 20% annually)"
    };
    return sizes[category] || "₹3,000 Cr (Growing 15% annually)";
  };

  const getTargetAudience = (category: string) => {
    const audiences: Record<string, string> = {
      "Healthcare": "Health-conscious individuals and families",
      "Education": "Students and parents",
      "E-commerce": "Online shoppers across age groups",
      "Services": "Businesses and professionals",
      "Food": "Urban working professionals and families"
    };
    return audiences[category] || "General consumers";
  };

  const getCompetitionLevel = (category: string) => {
    const levels: Record<string, string> = {
      "Healthcare": "Medium",
      "Education": "High",
      "E-commerce": "Very High",
      "Services": "High",
      "Food": "High"
    };
    return levels[category] || "Medium";
  };

  const getScalability = (category: string) => {
    const scalabilities: Record<string, string> = {
      "Healthcare": "Medium - location dependent",
      "Education": "High - can expand online",
      "E-commerce": "Very High - global reach",
      "Services": "High - can scale virtually",
      "Food": "Medium - location and logistics dependent"
    };
    return scalabilities[category] || "Medium - depends on execution";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPopularityStars = (score: number) => {
    const stars = Math.floor(score / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
    ));
  };

  const filteredIdeas = businessIdeas.filter(idea => {
    if (searchTerm && !idea.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !idea.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedCategory !== "all" && idea.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && idea.difficulty.toLowerCase() !== selectedDifficulty) return false;
    return true;
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.popularityScore - a.popularityScore;
      case "investment":
        return a.investment.localeCompare(b.investment);
      case "roi":
        return parseInt(b.roi) - parseInt(a.roi);
      case "success":
        return b.successRate - a.successRate;
      default:
        return 0;
    }
  });

  // Apply pagination
  const totalIdeas = sortedIdeas.length;
  const displayedIdeas = sortedIdeas.slice(0, businessIdeasPage * businessIdeasPerPage);
  const hasMoreIdeas = displayedIdeas.length < totalIdeas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lightbulb className="h-10 w-10 text-yellow-600" />
              <h1 className="text-4xl md:text-5xl font-bold">Business Ideas</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover profitable business opportunities with complete guidance, investment analysis, 
              and step-by-step implementation strategies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2">
                <Rocket className="h-4 w-4 mr-2" />
                500+ Curated Ideas
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                ROI Calculator
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                Success Stories
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search business ideas by name, category, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={investmentRange} onValueChange={setInvestmentRange}>
                    <SelectTrigger>
                      <DollarSign className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Investment Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Investment Ranges</SelectItem>
                      {investmentRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulty Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="investment">Investment (Low to High)</SelectItem>
                      <SelectItem value="roi">ROI (High to Low)</SelectItem>
                      <SelectItem value="success">Success Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">{totalIdeas} Business Ideas Found</h2>
              <p className="text-muted-foreground">
                Showing {displayedIdeas.length} of {totalIdeas} curated opportunities
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Business Plan Templates
            </Button>
          </div>

          {/* Business Ideas Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {displayedIdeas.map((idea) => (
              <Card 
                key={idea.id} 
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  idea.featured ? 'ring-2 ring-yellow-500/20' : ''
                }`}
              >
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold">{idea.title}</h3>
                          {idea.trending && (
                            <Badge className="bg-gradient-to-r from-career-primary to-purple-600 text-white">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                          {idea.featured && (
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4">{idea.description}</p>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            {getPopularityStars(idea.popularityScore)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {idea.popularityScore}% popularity
                          </span>
                        </div>
                      </div>
                      
                      <Badge className={getDifficultyColor(idea.difficulty)}>
                        {idea.difficulty}
                      </Badge>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <DollarSign className="h-4 w-4" />
                            Investment Required
                          </div>
                          <div className="font-bold text-lg">{idea.investment}</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <TrendingUp className="h-4 w-4" />
                            Expected ROI
                          </div>
                          <div className="font-bold text-lg text-career-secondary">{idea.roi}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Target className="h-4 w-4" />
                            Monthly Revenue
                          </div>
                          <div className="font-bold text-lg">{idea.monthlyRevenue}</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Clock className="h-4 w-4" />
                            Time to Start
                          </div>
                          <div className="font-bold text-lg">{idea.timeToStart}</div>
                        </div>
                      </div>
                    </div>

                    {/* Success Rate */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Success Rate</span>
                        <span className="text-sm font-bold">{idea.successRate}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-career-secondary to-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${idea.successRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Required Skills */}
                    <div>
                      <h4 className="font-medium mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {idea.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Complete Guide
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <PieChart className="h-4 w-4 mr-2" />
                        Calculate ROI
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Ideas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {sortedIdeas.length} of 500+ business opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
