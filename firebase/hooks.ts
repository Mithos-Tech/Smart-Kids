// firebase/hooks.ts
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';
import { Episode, TeamMember, GalleryItem } from '../types';

// Hook para obtener episodios
export const useEpisodes = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const episodesCol = collection(db, 'episodes');
        const episodesSnapshot = await getDocs(episodesCol);
        const episodesList = episodesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Episode[];
        setEpisodes(episodesList);
        setError(null);
      } catch (err) {
        setError('Error al cargar episodios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  return { episodes, loading, error };
};

// Hook para obtener episodios destacados
export const useFeaturedEpisodes = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'episodes'), where('featured', '==', true));
        const snapshot = await getDocs(q);
        const episodesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Episode[];
        setEpisodes(episodesList);
      } catch (err) {
        console.error('Error al cargar destacados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { episodes, loading };
};

// Hook para obtener equipo
export const useTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const teamCol = collection(db, 'team');
        const teamSnapshot = await getDocs(teamCol);
        const teamList = teamSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TeamMember[];
        setTeam(teamList);
      } catch (err) {
        console.error('Error al cargar equipo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return { team, loading };
};

// Hook para obtener galería
export const useGallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const galleryCol = collection(db, 'gallery');
        const gallerySnapshot = await getDocs(galleryCol);
        const galleryList = gallerySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GalleryItem[];
        setGallery(galleryList);
      } catch (err) {
        console.error('Error al cargar galería:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return { gallery, loading };
};