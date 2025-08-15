import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types based on the JSON structure
export interface CareerMapData {
  meta: {
    version: string;
    generated_at: string;
    source: string;
    notes: string[];
  };
  site: {
    name: string;
    tagline: string;
    design: {
      theme: string;
      dark_mode: boolean;
      mobile_first: boolean;
      animation: string;
      map_colors_by_stage: boolean;
    };
    languages: string[];
    auth: {
      providers: string[];
      require_login_to_save: boolean;
      save_prompt_after_seconds: number;
    };
    monetization: {
      ads: {
        enabled: boolean;
        slots: string[];
      };
      premium_notes: {
        enabled: boolean;
        payment_method: string;
        deliverable: string;
      };
    };
    admin: {
      login: {
        username: string;
        password: string;
      };
      warnings: string[];
    };
    performance: any;
    seo: any;
    navigation: {
      items: string[];
    };
    ui_text: {
      [key: string]: {
        [lang: string]: string;
      };
    };
  };
  stages: Array<{
    id: string;
    label: string;
    color: string;
  }>;
  interests: Array<{
    id: string;
    category: string;
    name: string;
  }>;
  courses: Array<{
    id: string;
    level: string;
    name: string;
    requires_stage: string;
    entrance: string[];
  }>;
  exams: Array<{
    id: string;
    name: string;
    unlocks: string[];
  }>;
  careers: Array<{
    id: string;
    title: string;
    preferred_stream: string;
    primary_courses: string[];
  }>;
  rules: Array<{
    from_stage: string;
    goal: string;
    recommendation: string;
    next_stage: string;
    guard?: string;
    exams?: string[];
    courses?: string[];
  }>;
  business_ideas: Array<{
    id: string;
    category: string;
    name: string;
    min_capital_inr: number;
    documents: string[];
  }>;
  job_sources: Array<{
    id: string;
    type: string;
    strategy: string;
    url: string;
  }>;
  job_schema: {
    fields: string[];
    filters: string[];
  };
  ui_contracts: {
    map_layout: {
      type: string;
      spacing: string;
      draggable: boolean;
      pinch_zoom_mobile: boolean;
    };
    buttons: any;
    saved: {
      sections: string[];
      autosave: boolean;
    };
  };
  interest_to_stream: {
    [interestId: string]: string;
  };
}

export interface Job {
  id: string;
  source_id: string;
  title: string;
  org: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  salary_notes?: string;
  allowances?: string;
  start_date: string;
  end_date: string;
  fee_general?: string;
  fee_sc?: string;
  fee_st?: string;
  fee_obc?: string;
  fee_ews?: string;
  apply_url: string;
  howto_url?: string;
  pdf_url?: string;
  created_at: string;
  sector: string;
  education_required: string;
  experience: string;
}

export interface SavedItem {
  id: string;
  type: 'career_map' | 'interest' | 'business_idea' | 'job';
  data: any;
  saved_at: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  provider: 'google' | 'facebook' | 'phone';
  saved_items: SavedItem[];
  preferences: {
    language: string;
    dark_mode: boolean;
  };
}

interface DataStore {
  // Data
  careerMapData: CareerMapData | null;
  jobs: Job[];
  currentUser: User | null;
  
  // UI State
  currentLanguage: string;
  darkMode: boolean;
  isLoading: boolean;
  
  // Pagination
  businessIdeasPage: number;
  businessIdeasPerPage: number;
  
  // Actions
  loadData: () => Promise<void>;
  setLanguage: (lang: string) => void;
  toggleDarkMode: () => void;
  setUser: (user: User | null) => void;
  addSavedItem: (item: SavedItem) => void;
  removeSavedItem: (id: string) => void;
  loadMoreBusinessIdeas: () => void;
  
  // Career Path Generation
  generateCareerPath: (currentStage: string, goal: string) => Array<{
    stage: string;
    title: string;
    description: string;
    exams?: string[];
    courses?: string[];
  }>;
  
  // Interest Matching
  findCareersByInterests: (interests: string[]) => Array<{
    career: any;
    matchScore: number;
    recommendedStream: string;
  }>;
  
  // UI Text
  getText: (key: string, lang?: string) => string;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initial state
      careerMapData: null,
      jobs: [],
      currentUser: null,
      currentLanguage: 'en',
      darkMode: false,
      isLoading: false,
      businessIdeasPage: 1,
      businessIdeasPerPage: 6,

      // Load data from JSON
      loadData: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/CareerMap_unified_payload.json');
          const data: CareerMapData = await response.json();
          set({ 
            careerMapData: data,
            currentLanguage: data.site.languages[0] || 'en',
            darkMode: data.site.design.dark_mode,
            isLoading: false 
          });
          
          // Apply theme
          if (data.site.design.dark_mode) {
            document.documentElement.classList.add('dark');
          }
          
          console.log('CareerMap data loaded successfully');
        } catch (error) {
          console.error('Failed to load CareerMap data:', error);
          set({ isLoading: false });
        }
      },

      // UI Actions
      setLanguage: (lang: string) => {
        set({ currentLanguage: lang });
        // Update user preferences if logged in
        const { currentUser } = get();
        if (currentUser) {
          set({
            currentUser: {
              ...currentUser,
              preferences: {
                ...currentUser.preferences,
                language: lang
              }
            }
          });
        }
      },

      toggleDarkMode: () => {
        const { darkMode } = get();
        const newDarkMode = !darkMode;
        set({ darkMode: newDarkMode });
        
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Update user preferences if logged in
        const { currentUser } = get();
        if (currentUser) {
          set({
            currentUser: {
              ...currentUser,
              preferences: {
                ...currentUser.preferences,
                dark_mode: newDarkMode
              }
            }
          });
        }
      },

      // User management
      setUser: (user: User | null) => {
        set({ currentUser: user });
        if (user) {
          // Apply user preferences
          set({ 
            currentLanguage: user.preferences.language,
            darkMode: user.preferences.dark_mode 
          });
          
          if (user.preferences.dark_mode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      // Saved items
      addSavedItem: (item: SavedItem) => {
        const { currentUser } = get();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            saved_items: [...currentUser.saved_items, item]
          };
          set({ currentUser: updatedUser });
        }
      },

      removeSavedItem: (id: string) => {
        const { currentUser } = get();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            saved_items: currentUser.saved_items.filter(item => item.id !== id)
          };
          set({ currentUser: updatedUser });
        }
      },

      // Business ideas pagination
      loadMoreBusinessIdeas: () => {
        const { businessIdeasPage } = get();
        set({ businessIdeasPage: businessIdeasPage + 1 });
      },

      // Career path generation using rules
      generateCareerPath: (currentStage: string, goal: string) => {
        const { careerMapData } = get();
        if (!careerMapData) return [];

        const path: Array<{
          stage: string;
          title: string;
          description: string;
          exams?: string[];
          courses?: string[];
        }> = [];

        let currentStageId = currentStage;
        const visitedStages = new Set<string>();

        while (currentStageId && !visitedStages.has(currentStageId)) {
          visitedStages.add(currentStageId);
          
          // Find rule for current stage and goal
          const rule = careerMapData.rules.find(
            r => r.from_stage === currentStageId && r.goal === goal
          );

          if (!rule) break;

          // Get stage info
          const stageInfo = careerMapData.stages.find(s => s.id === currentStageId);
          
          path.push({
            stage: currentStageId,
            title: stageInfo?.label || currentStageId,
            description: rule.recommendation,
            exams: rule.exams,
            courses: rule.courses
          });

          currentStageId = rule.next_stage;
        }

        return path;
      },

      // Interest matching using interest_to_stream mapping
      findCareersByInterests: (interests: string[]) => {
        const { careerMapData } = get();
        if (!careerMapData) return [];

        const matches: Array<{
          career: any;
          matchScore: number;
          recommendedStream: string;
        }> = [];

        // Map interests to streams
        const recommendedStreams = interests
          .map(interest => careerMapData.interest_to_stream[interest])
          .filter(Boolean);

        // Find careers that match these streams
        careerMapData.careers.forEach(career => {
          const matchingStreams = recommendedStreams.filter(
            stream => career.preferred_stream === stream || career.preferred_stream === 'any'
          );
          
          if (matchingStreams.length > 0) {
            const matchScore = (matchingStreams.length / interests.length) * 100;
            matches.push({
              career,
              matchScore,
              recommendedStream: matchingStreams[0] || career.preferred_stream
            });
          }
        });

        // Sort by match score
        return matches.sort((a, b) => b.matchScore - a.matchScore);
      },

      // Get localized text
      getText: (key: string, lang?: string) => {
        const { careerMapData, currentLanguage } = get();
        const language = lang || currentLanguage;
        
        if (careerMapData?.site.ui_text[key]) {
          return careerMapData.site.ui_text[key][language] || careerMapData.site.ui_text[key]['en'] || key;
        }
        
        return key;
      }
    }),
    {
      name: 'careermap-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentLanguage: state.currentLanguage,
        darkMode: state.darkMode,
        businessIdeasPage: state.businessIdeasPage,
      }),
    }
  )
);

// Job fetching service (simulated for now, would integrate with actual APIs)
export class JobFetchService {
  private static instance: JobFetchService;
  
  static getInstance(): JobFetchService {
    if (!JobFetchService.instance) {
      JobFetchService.instance = new JobFetchService();
    }
    return JobFetchService.instance;
  }

  async fetchJobsFromSources(): Promise<Job[]> {
    const { careerMapData } = useDataStore.getState();
    if (!careerMapData) return [];

    const mockJobs: Job[] = [
      {
        id: 'job_1',
        source_id: 'ssc',
        title: 'Combined Graduate Level Examination',
        org: 'Staff Selection Commission',
        location: 'All India',
        salary_min: 25500,
        salary_max: 81100,
        salary_notes: 'Pay Level 4 to 8',
        allowances: 'HRA, TA, Medical',
        start_date: '2024-02-01',
        end_date: '2024-03-01',
        fee_general: '₹100',
        fee_sc: 'Nil',
        fee_st: 'Nil',
        fee_obc: '₹100',
        fee_ews: 'Nil',
        apply_url: 'https://ssc.nic.in',
        howto_url: 'https://youtube.com/watch?v=example',
        created_at: new Date().toISOString(),
        sector: 'Government',
        education_required: 'Graduation',
        experience: 'Fresher'
      },
      {
        id: 'job_2',
        source_id: 'railways_rrb',
        title: 'Junior Engineer',
        org: 'Railway Recruitment Board',
        location: 'Multiple Zones',
        salary_min: 35400,
        salary_max: 112400,
        salary_notes: 'Pay Level 6',
        allowances: 'HRA, TA, Medical',
        start_date: '2024-01-15',
        end_date: '2024-02-15',
        fee_general: '₹500',
        fee_sc: '₹250',
        fee_st: '₹250',
        fee_obc: '₹500',
        fee_ews: '₹250',
        apply_url: 'https://indianrailways.gov.in',
        howto_url: 'https://youtube.com/watch?v=example2',
        created_at: new Date().toISOString(),
        sector: 'Railway',
        education_required: 'Engineering Diploma/Degree',
        experience: 'Fresher'
      }
    ];

    return mockJobs;
  }

  async scheduleAutoFetch(): Promise<void> {
    // This would implement the actual scheduled fetching
    // For now, we'll just update the store with mock data
    const jobs = await this.fetchJobsFromSources();
    useDataStore.setState({ jobs });
  }
}

// Initialize data loading
export const initializeCareerMapData = async () => {
  const store = useDataStore.getState();
  await store.loadData();
  
  // Initialize job fetching
  const jobService = JobFetchService.getInstance();
  await jobService.scheduleAutoFetch();
};

// Helper functions
export const getStageColor = (stageId: string): string => {
  const { careerMapData } = useDataStore.getState();
  const stage = careerMapData?.stages.find(s => s.id === stageId);
  return stage?.color || '#000000';
};

export const getInterestsByCategory = () => {
  const { careerMapData } = useDataStore.getState();
  if (!careerMapData) return {};
  
  return careerMapData.interests.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<string, typeof careerMapData.interests>);
};

export const getBusinessIdeasByCategory = () => {
  const { careerMapData } = useDataStore.getState();
  if (!careerMapData) return {};
  
  return careerMapData.business_ideas.reduce((acc, idea) => {
    if (!acc[idea.category]) {
      acc[idea.category] = [];
    }
    acc[idea.category].push(idea);
    return acc;
  }, {} as Record<string, typeof careerMapData.business_ideas>);
};

export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  } else {
    return `₹${amount}`;
  }
};
