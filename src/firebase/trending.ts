import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { Episode } from '../../types';

export const getTrendingEpisode = async (): Promise<Episode | null> => {
    try {
        // 1. Obtener configuración de trending (el documento se llama "trending")
        const trendingDocRef = doc(db, 'siteContent', 'trending');
        const trendingSnap = await getDoc(trendingDocRef);

        if (!trendingSnap.exists()) {
            console.log('❌ Trending document not found');
            return null;
        }

        const trendingConfig = trendingSnap.data();
        console.log('✅ Trending config:', trendingConfig);

        if (!trendingConfig.enabled) {
            console.log('❌ Trending not enabled');
            return null;
        }

        if (!trendingConfig.featuredEpisodeId) {
            console.log('❌ No featuredEpisodeId configured');
            return null;
        }

        console.log('🔍 Looking for episode ID:', trendingConfig.featuredEpisodeId);

        // 2. Obtener el episodio desde episodes
        const episodesRef = collection(db, 'episodes');
        const episodesSnap = await getDocs(episodesRef);

        const allEpisodes = episodesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log('📚 All episode IDs:', allEpisodes.map(e => e.id));

        const episode = allEpisodes.find(ep => ep.id === trendingConfig.featuredEpisodeId);

        if (!episode) {
            console.log('❌ Episode not found. Looking for:', trendingConfig.featuredEpisodeId);
            return null;
        }

        console.log('✅ Trending episode found:', episode.title);
        return episode as Episode;

    } catch (error) {
        console.error('💥 Error loading trending:', error);
        return null;
    }
};