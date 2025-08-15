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

  const businessIdeas = [
    {
      id: 1,
      title: "Cloud Kitchen",
      category: "food",
      description: "Start a delivery-only restaurant without dine-in space. Focus on 2-3 cuisines and optimize for delivery platforms.",
      investment: "₹2-8 Lakh",
      monthlyRevenue: "₹1.5-6 Lakh",
      roi: "25-45%",
      difficulty: "Medium",
      timeToStart: "2-3 months",
      popularityScore: 92,
      successRate: 78,
      trending: true,
      featured: false,
      permits: ["FSSAI License", "Fire Safety", "Local Municipal License"],
      skills: ["Cooking", "Marketing", "Operations"],
      marketSize: "₹4,000 Cr (Growing 15% annually)",
      targetAudience: "Urban working professionals aged 25-40",
      competition: "High but fragmented market",
      scalability: "High - can expand to multiple locations"
    },
    {
      id: 2,
      title: "Digital Marketing Agency",
      category: "tech",
      description: "Offer social media marketing, SEO, content creation, and paid advertising services to local businesses.",
      investment: "₹25K-1 Lakh",
      monthlyRevenue: "₹1-8 Lakh",
      roi: "40-60%",
      difficulty: "Medium",
      timeToStart: "1-2 months",
      popularityScore: 88,
      successRate: 82,
      trending: true,
      featured: true,
      permits: ["Business Registration", "GST Registration"],
      skills: ["Digital Marketing", "Content Creation", "Client Management"],
      marketSize: "₹16,000 Cr (Growing 25% annually)",
      targetAudience: "Small and medium businesses",
      competition: "Very High",
      scalability: "Very High - global reach possible"
    },
    {
      id: 3,
      title: "Organic Farming",
      category: "agriculture",
      description: "Cultivate organic vegetables, fruits, or herbs for direct sale to consumers, restaurants, and organic stores.",
      investment: "₹3-12 Lakh",
      monthlyRevenue: "₹80K-4 Lakh",
      roi: "20-35%",
      difficulty: "Hard",
      timeToStart: "6-12 months",
      popularityScore: 75,
      successRate: 65,
      trending: false,
      featured: false,
      permits: ["Organic Certification", "Land Records", "Water Rights"],
      skills: ["Agriculture Knowledge", "Marketing", "Supply Chain"],
      marketSize: "₹7,000 Cr (Growing 20% annually)",
      targetAudience: "Health-conscious urban consumers",
      competition: "Low to Medium",
      scalability: "Medium - limited by land availability"
    },
    {
      id: 4,
      title: "Online Tutoring Platform",
      category: "education",
      description: "Create an online platform connecting students with tutors for personalized learning sessions.",
      investment: "₹1.5-6 Lakh",
      monthlyRevenue: "₹1-5 Lakh",
      roi: "30-50%",
      difficulty: "Medium",
      timeToStart: "3-4 months",
      popularityScore: 85,
      successRate: 71,
      trending: true,
      featured: false,
      permits: ["Business Registration", "Educational License"],
      skills: ["Technology", "Education", "Platform Management"],
      marketSize: "₹3,500 Cr (Growing 30% annually)",
      targetAudience: "Students and parents",
      competition: "High",
      scalability: "Very High - can scale globally"
    },
    {
      id: 5,
      title: "Handmade Jewelry Business",
      category: "fashion",
      description: "Design and create unique handmade jewelry pieces for online and offline sales.",
      investment: "₹15K-80K",
      monthlyRevenue: "₹30K-2 Lakh",
      roi: "35-65%",
      difficulty: "Easy",
      timeToStart: "1 month",
      popularityScore: 70,
      successRate: 68,
      trending: false,
      featured: false,
      permits: ["GST Registration", "Hallmark Certification (for gold)"],
      skills: ["Jewelry Making", "Design", "Online Marketing"],
      marketSize: "₹2,500 Cr (Growing 12% annually)",
      targetAudience: "Fashion-conscious women aged 20-45",
      competition: "Medium",
      scalability: "High - can expand product lines"
    },
    {
      id: 6,
      title: "Fitness Coaching App",
      category: "health",
      description: "Develop a mobile app offering personalized fitness plans, nutrition guidance, and virtual coaching.",
      investment: "₹5-15 Lakh",
      monthlyRevenue: "₹2-10 Lakh",
      roi: "45-70%",
      difficulty: "Hard",
      timeToStart: "4-8 months",
      popularityScore: 89,
      successRate: 75,
      trending: true,
      featured: true,
      permits: ["App Store Registration", "Health Compliance"],
      skills: ["App Development", "Fitness Knowledge", "Marketing"],
      marketSize: "₹1,200 Cr (Growing 35% annually)",
      targetAudience: "Health-conscious individuals aged 25-45",
      competition: "Very High",
      scalability: "Very High - global market"
    }
  ];

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
              <h2 className="text-2xl font-bold">{sortedIdeas.length} Business Ideas Found</h2>
              <p className="text-muted-foreground">Curated opportunities with complete guidance</p>
            </div>
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Business Plan Templates
            </Button>
          </div>

          {/* Business Ideas Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {sortedIdeas.map((idea) => (
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
