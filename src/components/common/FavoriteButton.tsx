'use client';

import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { favoritesStorage } from '@/utils/storage';

interface FavoriteButtonProps { partId: string; size?: number; }

export default function FavoriteButton({ partId, size = 24 }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => { setIsFavorite(favoritesStorage.isFavorite(partId)); }, [partId]);
  const handleToggle = async () => {
    setIsLoading(true);
    if (isFavorite) favoritesStorage.remove(partId); else favoritesStorage.add(partId);
    setIsFavorite(!isFavorite);
    setIsLoading(false);
  };
  return <button onClick={handleToggle} disabled={isLoading} className="p-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50" aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}><Heart size={size} className={`transition ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} /></button>;
}
