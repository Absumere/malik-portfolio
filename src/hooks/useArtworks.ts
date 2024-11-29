import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export const useArtworks = () => {
  const artworks = useQuery(api.artworks.list);
  const isLoading = artworks === undefined;
  const error = artworks instanceof Error ? artworks : null;

  return {
    artworks: artworks && !isLoading && !error ? artworks : [],
    isLoading,
    error,
  };
};
