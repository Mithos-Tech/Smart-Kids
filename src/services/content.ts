import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface HeroContent {
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    enabled: boolean;
}

export interface TrendingContent {
    title: string;
    subtitle: string;
    featuredEpisodeId: string;
    showFeatured: boolean;
    enabled: boolean;
}

// ============================================
// HERO SECTION
// ============================================

export const getHeroContent = async () => {
    try {
        const heroRef = doc(db, 'siteContent', 'hero');
        const heroSnap = await getDoc(heroRef);

        if (heroSnap.exists()) {
            return {
                success: true,
                data: heroSnap.data() as HeroContent
            };
        } else {
            // Valores por defecto si no existe
            return {
                success: true,
                data: {
                    title: "Hablamos, Tú Escuchas",
                    subtitle: "Podcasts educativos creados por estudiantes de 4°, 5° y 6° grado",
                    imageUrl: "https://picsum.photos/seed/hero-smartkids/1920/1080",
                    ctaText: "Escuchar Ahora",
                    ctaLink: "/episodes",
                    enabled: true
                }
            };
        }
    } catch (error) {
        console.error('Error al obtener hero content:', error);
        return { success: false, error: 'Error al cargar contenido' };
    }
};

export const updateHeroContent = async (data: Partial<HeroContent>) => {
    try {
        const heroRef = doc(db, 'siteContent', 'hero');
        await updateDoc(heroRef, {
            ...data,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('Error al actualizar hero:', error);
        return { success: false, error: 'Error al actualizar contenido' };
    }
};

// ============================================
// TRENDING SECTION
// ============================================

export const getTrendingContent = async () => {
    try {
        const trendingRef = doc(db, 'siteContent', 'trending');
        const trendingSnap = await getDoc(trendingRef);

        if (trendingSnap.exists()) {
            return {
                success: true,
                data: trendingSnap.data() as TrendingContent
            };
        } else {
            return {
                success: true,
                data: {
                    title: "Popular & Tendencia",
                    subtitle: "Los episodios más escuchados de esta semana",
                    featuredEpisodeId: "",
                    showFeatured: true,
                    enabled: true
                }
            };
        }
    } catch (error) {
        console.error('Error al obtener trending content:', error);
        return { success: false, error: 'Error al cargar contenido' };
    }
};

export const updateTrendingContent = async (data: Partial<TrendingContent>) => {
    try {
        const trendingRef = doc(db, 'siteContent', 'trending');
        await updateDoc(trendingRef, {
            ...data,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('Error al actualizar trending:', error);
        return { success: false, error: 'Error al actualizar contenido' };
    }
};