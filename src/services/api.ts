import { EPISODES, PROFESSORS, TESTIMONIALS, CATEGORIES, GRADES } from '../../constants';
import { Episode } from '../../types';

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  getEpisodes: async (): Promise<Episode[]> => {
    await delay(500); // Simulate network request
    return Promise.resolve(EPISODES);
  },

  searchEpisodes: async (query: string): Promise<Episode[]> => {
    await delay(300);
    if (!query || query.trim().length <= 2) {
        return Promise.resolve([]);
    }
    const lowercasedQuery = query.toLowerCase();
    const results = EPISODES.filter(episode =>
        episode.title.toLowerCase().includes(lowercasedQuery) ||
        episode.description.toLowerCase().includes(lowercasedQuery) ||
        episode.podcaster.name.toLowerCase().includes(lowercasedQuery) ||
        episode.category.toLowerCase().includes(lowercasedQuery)
    );
    return Promise.resolve(results);
  },
  
  getProfessors: async () => {
    await delay(500);
    return Promise.resolve(PROFESSORS);
  },

  getTestimonials: async () => {
    await delay(500);
    return Promise.resolve(TESTIMONIALS);
  },

  getCategories: async () => {
    await delay(500);
    return Promise.resolve(CATEGORIES);
  },
  
  getGrades: async () => {
    await delay(500);
    return Promise.resolve(GRADES);
  }
};