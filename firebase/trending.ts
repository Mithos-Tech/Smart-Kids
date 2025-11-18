// firebase/trending.ts
export interface TrendingEpisode extends Episode {
    // Datos adicionales para trending
    fullSynopsis?: string;
    educationalValues?: Array<{
        icon: string;
        title: string;
        description: string;
    }>;
    ageRecommended?: string;
    curriculum?: string;
    narratorMessage?: string;
}