import { useState, useEffect } from 'react';
import { config } from '../config';

export interface Phase {
  id: number | string;
  name: string;
  count: number;
  color?: string; // Color might come from API in the future
}

export interface UsePhaseResult {
  phases: Phase[];
  loading: boolean;
  error: string | null;
  getPhaseById: (id: number | string) => Phase | undefined;
  getPhaseColor: (id: number | string) => string;
}

// Default colors as fallback if API doesn't provide them
const DEFAULT_PHASE_COLORS: { [key: string]: string } = {
  '0': '#22c55e', // green - Published
  '1': '#f59e0b', // amber - Publish Pending  
  '2': '#ef4444', // red - Edit Requested
  '3': '#3b82f6', // blue - Material Done
  '4': '#8b5cf6', // purple - Started
  '5': '#f97316', // orange - Delayed
  '6': '#6b7280', // gray - Sponsored Blocked
  '7': '#06b6d4'  // cyan - Ideas
};

export const usePhases = (): UsePhaseResult => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}${config.endpoints.phases}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // The API returns { "phases": [...] }
        const phasesData = Array.isArray(data.phases) ? data.phases : [];
        
        // Sort phases by ID and add default colors
        const sortedPhases = phasesData
          .sort((a: Phase, b: Phase) => Number(a.id) - Number(b.id))
          .map((phase: Phase) => ({
            ...phase,
            color: phase.color || DEFAULT_PHASE_COLORS[String(phase.id)] || '#6b7280'
          }));
        
        setPhases(sortedPhases);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch phases:', err);
        setError('Unable to load phases. Please try again.');
        setPhases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhases();
  }, []);

  const getPhaseById = (id: number | string): Phase | undefined => {
    return phases.find(phase => String(phase.id) === String(id));
  };

  const getPhaseColor = (id: number | string): string => {
    const phase = getPhaseById(id);
    return phase?.color || DEFAULT_PHASE_COLORS[String(id)] || '#6b7280';
  };

  return {
    phases,
    loading,
    error,
    getPhaseById,
    getPhaseColor
  };
}; 