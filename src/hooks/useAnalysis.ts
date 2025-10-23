import { useState, useCallback, useEffect } from 'react';
import { MockAnalysisResult } from '@/utils/mockDataGenerator';
import { generateMockAnalysis } from '@/utils/mockDataGenerator';
import { extractProductInfo } from '@/utils/urlValidation';

export interface AnalysisState {
  url: string;
  isAnalyzing: boolean;
  currentStage: LoadingStage | null;
  analysisResult: MockAnalysisResult | null;
  suggestions: Suggestion[];
  showPaywall: boolean;
  expandedSuggestions: Set<string>;
  analysisCount: number;
  timeRemaining: number;
}

export interface LoadingStage {
  message: string;
  progress: number;
  duration: number;
}

export interface Suggestion {
  id: string;
  type: 'title' | 'price' | 'image' | 'description';
  impact: 'high' | 'medium' | 'low';
  text: string;
  improvement: string;
  applied: boolean;
}

const LOADING_STAGES: LoadingStage[] = [
  { message: "fetchingProductData", progress: 15, duration: 500 },
  { message: "analyzingImages", progress: 35, duration: 600 },
  { message: "processingTitleDescription", progress: 55, duration: 700 },
  { message: "generatingAiSuggestions", progress: 75, duration: 800 },
  { message: "finalizingAnalysis", progress: 90, duration: 500 },
  { message: "analysisComplete", progress: 100, duration: 300 }
];

export const useAnalysis = () => {
  const [state, setState] = useState<AnalysisState>({
    url: '',
    isAnalyzing: false,
    currentStage: null,
    analysisResult: null,
    suggestions: [],
    showPaywall: false,
    expandedSuggestions: new Set(),
    analysisCount: 0,
    timeRemaining: 300 // 5 minutes in seconds
  });

  // Countdown timer for free analysis
  useEffect(() => {
    if (state.analysisResult && state.timeRemaining > 0) {
      const timer = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1)
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.analysisResult, state.timeRemaining]);

  const generateSuggestions = useCallback((analysis: MockAnalysisResult): Suggestion[] => {
    const allSuggestions: Suggestion[] = [];
    
    // Title suggestions
    analysis.analysis.titleSuggestions.forEach((suggestion, index) => {
      allSuggestions.push({
        id: `title-${index}`,
        type: 'title',
        impact: index === 0 ? 'high' : 'medium',
        text: suggestion,
        improvement: `Expected ${15 + index * 5}% increase in click-through rate`,
        applied: false
      });
    });

    // Pricing suggestions
    analysis.analysis.pricingSuggestions.forEach((suggestion, index) => {
      allSuggestions.push({
        id: `price-${index}`,
        type: 'price',
        impact: 'high',
        text: suggestion,
        improvement: `Potential ${20 + index * 8}% revenue increase`,
        applied: false
      });
    });

    // Image suggestions
    analysis.analysis.imageSuggestions.forEach((suggestion, index) => {
      allSuggestions.push({
        id: `image-${index}`,
        type: 'image',
        impact: index === 0 ? 'high' : 'medium',
        text: suggestion,
        improvement: `Expected ${10 + index * 3}% improvement in conversion`,
        applied: false
      });
    });

    // Description suggestions
    analysis.analysis.descriptionSuggestions.forEach((suggestion, index) => {
      allSuggestions.push({
        id: `desc-${index}`,
        type: 'description',
        impact: 'medium',
        text: suggestion,
        improvement: `Potential ${12 + index * 4}% increase in engagement`,
        applied: false
      });
    });

    return allSuggestions.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  }, []);

  const startAnalysis = useCallback(async (url: string) => {
    if (!url.trim()) return;

    setState(prev => ({
      ...prev,
      url,
      isAnalyzing: true,
      analysisResult: null,
      suggestions: [],
      currentStage: LOADING_STAGES[0]
    }));

    // Simulate loading stages
    for (let i = 0; i < LOADING_STAGES.length; i++) {
      const stage = LOADING_STAGES[i];
      setState(prev => ({ ...prev, currentStage: stage }));
      
      await new Promise(resolve => setTimeout(resolve, stage.duration));
    }

    // Generate analysis
    const productInfo = extractProductInfo(url);
    const mockAnalysis = generateMockAnalysis(url, productInfo.marketplace, productInfo.platform);
    const generatedSuggestions = generateSuggestions(mockAnalysis);

    setState(prev => ({
      ...prev,
      analysisResult: mockAnalysis,
      suggestions: generatedSuggestions,
      isAnalyzing: false,
      currentStage: null,
      analysisCount: prev.analysisCount + 1,
      timeRemaining: 300 // Reset timer
    }));

    // Show paywall after 3 analyses
    if (state.analysisCount >= 2) {
      setTimeout(() => {
        setState(prev => ({ ...prev, showPaywall: true }));
      }, 2000);
    }
  }, [generateSuggestions, state.analysisCount]);

  const toggleSuggestion = useCallback((suggestionId: string) => {
    setState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(s => 
        s.id === suggestionId ? { ...s, applied: !s.applied } : s
      )
    }));
  }, []);

  const toggleSuggestionExpansion = useCallback((suggestionId: string) => {
    setState(prev => {
      const newSet = new Set(prev.expandedSuggestions);
      if (newSet.has(suggestionId)) {
        newSet.delete(suggestionId);
      } else {
        newSet.add(suggestionId);
      }
      return { ...prev, expandedSuggestions: newSet };
    });
  }, []);

  const setShowPaywall = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showPaywall: show }));
  }, []);

  const resetAnalysis = useCallback(() => {
    setState(prev => ({
      ...prev,
      url: '',
      analysisResult: null,
      suggestions: [],
      expandedSuggestions: new Set(),
      timeRemaining: 300
    }));
  }, []);

  const formatTimeRemaining = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    state,
    startAnalysis,
    toggleSuggestion,
    toggleSuggestionExpansion,
    setShowPaywall,
    resetAnalysis,
    formatTimeRemaining,
    setState
  };
}; 