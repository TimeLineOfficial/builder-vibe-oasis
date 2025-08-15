import React, { useState, useEffect } from 'react';
import { useDataStore } from '../lib/data-service';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  BookOpen, 
  DollarSign, 
  Users, 
  Star,
  Filter,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';
import { ExtendedInterest } from '../lib/extended-interests';
import AdvancedCareerMapping from '../components/AdvancedCareerMapping';

export default function CareerByInterest() {
  const { 
    getExtendedInterests,
    searchExtendedInterests,
    getTrendingInterests,
    findAdvancedCareersByInterests,
    getText,
    currentLanguage 
  } = useDataStore();

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInterests, setFilteredInterests] = useState<ExtendedInterest[]>([]);
  const [careerMatches, setCareerMatches] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showResults, setShowResults] = useState(false);
  const [showAdvancedMapping, setShowAdvancedMapping] = useState(false);
  const [selectedCareerForMapping, setSelectedCareerForMapping] = useState<string>('');

  const allInterests = getExtendedInterests();
  const trendingInterests = getTrendingInterests();
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(allInterests.map(interest => interest.category)))];

  useEffect(() => {
    let interests = allInterests;
    
    // Filter by search query
    if (searchQuery.trim()) {
      interests = searchExtendedInterests(searchQuery);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      interests = interests.filter(interest => interest.category === selectedCategory);
    }
    
    setFilteredInterests(interests);
  }, [searchQuery, selectedCategory, allInterests]);

  const handleInterestToggle = (interestName: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestName)) {
        return prev.filter(name => name !== interestName);
      } else {
        return [...prev, interestName];
      }
    });
  };

  const findCareerMatches = () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }
    
    const matches = findAdvancedCareersByInterests(selectedInterests);
    setCareerMatches(matches);
    setShowResults(true);
  };

  const clearSelection = () => {
    setSelectedInterests([]);
    setCareerMatches([]);
    setShowResults(false);
  };

  const InterestCard = ({ interest, isSelected, onClick }: { 
    interest: ExtendedInterest; 
    isSelected: boolean; 
    onClick: () => void; 
  }) => (
    <Card 
      className={`
        cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 group
        ${isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300' 
          : 'hover:border-blue-300 hover:bg-blue-50/50'
        }
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm leading-tight mb-1">{interest.name}</h3>
            <p className="text-xs text-gray-600">{interest.category}</p>
          </div>
          {interest.trending && (
            <Badge variant="destructive" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <DollarSign className="w-3 h-3 text-green-600" />
            <span className="text-gray-700">{interest.salary_range}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <Target className="w-3 h-3 text-blue-600" />
            <span className={`px-2 py-1 rounded-full text-xs ${
              interest.growth_potential === 'high' ? 'bg-green-100 text-green-800' :
              interest.growth_potential === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {interest.growth_potential} growth
            </span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {interest.keywords.slice(0, 3).map((keyword, i) => (
              <Badge key={i} variant="outline" className="text-xs px-2 py-0">
                {keyword}
              </Badge>
            ))}
            {interest.keywords.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                +{interest.keywords.length - 3}
              </Badge>
            )}
          </div>
        </div>
        
        {isSelected && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-xs text-blue-700">
              <span className="font-medium">Career paths:</span> {interest.career_paths.join(', ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const CareerMatchCard = ({ match, index }: { match: any; index: number }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-blue-900">{match.path}</h3>
            <p className="text-sm text-gray-600">Based on: {match.interest}</p>
          </div>
          <Badge variant="outline" className="font-semibold">
            #{index + 1}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm">{match.salary}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className={`text-sm px-2 py-1 rounded-full ${
              match.growth === 'high' ? 'bg-green-100 text-green-800' :
              match.growth === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {match.growth} growth
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Education Requirements:</h4>
          <div className="flex flex-wrap gap-1">
            {match.education.map((edu: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {edu}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Category:</h4>
          <Badge variant="outline">{match.category}</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <BookOpen className="w-4 h-4 mr-1" />
            Learn More
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedCareerForMapping(match.path);
              setShowAdvancedMapping(true);
            }}
          >
            <ArrowRight className="w-4 h-4 mr-1" />
            Get Roadmap
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Career Matches</h1>
            <p className="text-xl text-gray-600">
              Based on your selected interests: {selectedInterests.join(', ')}
            </p>
            <div className="mt-4">
              <Button onClick={() => setShowResults(false)} variant="outline" className="mr-2">
                Back to Selection
              </Button>
              <Button onClick={clearSelection} variant="outline">
                Start Over
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerMatches.map((match, index) => (
              <CareerMatchCard key={index} match={match} index={index} />
            ))}
          </div>

          {careerMatches.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-4">
                Try selecting different interests or broadening your selection
              </p>
              <Button onClick={() => setShowResults(false)}>
                Try Different Interests
              </Button>
            </div>
          )}

          {/* Advanced Career Mapping Modal */}
          {showAdvancedMapping && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Advanced Career Mapping</h2>
                    <Button variant="outline" onClick={() => setShowAdvancedMapping(false)}>
                      Close
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <AdvancedCareerMapping selectedCareer={selectedCareerForMapping} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {getText('career_by_interest_title', currentLanguage) || 'Find Your Career by Interest'}
          </h1>
          <p className="text-xl text-gray-600">
            {getText('career_by_interest_subtitle', currentLanguage) || 'Select your interests and discover career paths that match your passion'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search interests, skills, or career fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-gray-600 flex-shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category === 'all' ? 'All Categories' : category}
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Interests */}
          {selectedInterests.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900">
                  Selected Interests ({selectedInterests.length})
                </h3>
                <Button onClick={clearSelection} variant="outline" size="sm">
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedInterests.map((interest) => (
                  <Badge 
                    key={interest} 
                    variant="default" 
                    className="cursor-pointer hover:bg-blue-700"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest} ×
                  </Badge>
                ))}
              </div>
              <Button 
                onClick={findCareerMatches}
                className="w-full"
                disabled={selectedInterests.length === 0}
              >
                <Target className="w-4 h-4 mr-2" />
                Find Career Matches ({selectedInterests.length} interests selected)
              </Button>
            </div>
          )}

          {/* Interest Categories */}
          <Tabs value={selectedCategory === 'all' ? 'trending' : selectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trending">
                <Zap className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="Technology">
                Technology
              </TabsTrigger>
              <TabsTrigger value="Healthcare">
                Healthcare
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="mt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🔥 Trending Interests</h3>
                <p className="text-sm text-gray-600">High-demand fields with excellent growth prospects</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {trendingInterests.slice(0, 12).map((interest) => (
                  <InterestCard
                    key={interest.id}
                    interest={interest}
                    isSelected={selectedInterests.includes(interest.name)}
                    onClick={() => handleInterestToggle(interest.name)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="Technology" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredInterests
                  .filter(interest => interest.category === 'Technology')
                  .slice(0, 20)
                  .map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      isSelected={selectedInterests.includes(interest.name)}
                      onClick={() => handleInterestToggle(interest.name)}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="Healthcare" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredInterests
                  .filter(interest => interest.category === 'Healthcare')
                  .slice(0, 20)
                  .map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      isSelected={selectedInterests.includes(interest.name)}
                      onClick={() => handleInterestToggle(interest.name)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* All Interests Grid */}
          {selectedCategory !== 'trending' && (
            <div className="mt-8">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedCategory === 'all' 
                    ? `All Interests (${filteredInterests.length})` 
                    : `${selectedCategory} (${filteredInterests.length})`
                  }
                </h3>
                <p className="text-sm text-gray-600">
                  Click on interests that match your passion and skills
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredInterests.slice(0, 40).map((interest) => (
                  <InterestCard
                    key={interest.id}
                    interest={interest}
                    isSelected={selectedInterests.includes(interest.name)}
                    onClick={() => handleInterestToggle(interest.name)}
                  />
                ))}
              </div>
              
              {filteredInterests.length > 40 && (
                <div className="text-center mt-6">
                  <p className="text-gray-600 mb-4">
                    Showing 40 of {filteredInterests.length} interests
                  </p>
                  <Button variant="outline">
                    Load More Interests
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Call to Action */}
        {selectedInterests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Star className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Exploring Your Interests</h3>
            <p className="text-gray-600 mb-4">
              Select interests that excite you to discover matching career paths
            </p>
            <p className="text-sm text-gray-500">
              You can select multiple interests for better career recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
