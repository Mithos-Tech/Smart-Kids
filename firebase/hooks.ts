import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './config';
import type { Episode, TeamMember, GalleryItem } from '../types';

export const useEpisodes = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'episodes'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Episode[];
      setEpisodes(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { episodes, loading };
};

export const useTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'team'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TeamMember[];
      setTeam(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { team, loading };
};

export const useGallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryItem[];
      setGallery(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { gallery, loading };
};

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'subscribers'), orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubscribers(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching subscribers:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { subscribers, loading };
};