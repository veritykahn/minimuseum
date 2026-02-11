'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MapRoom } from '../types';
import { getRoomByPath } from '../data/rooms';

/**
 * Hook for managing museum map state.
 *
 * Smart close logic: clicking a room that has children (floor/exhibition)
 * keeps the map open for the level transition. Clicking a leaf room
 * closes the map and navigates.
 */
export function useMapState() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === '/';

  const currentRoom = getRoomByPath(pathname);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const navigateToRoom = useCallback((room: MapRoom) => {
    if (room.comingSoon) return;

    // If the room has children, it can zoom deeper — keep map open
    const hasChildren = room.children && room.children.length > 0;

    router.push(room.path);

    if (!hasChildren) {
      // Leaf node — close the map, user has arrived at destination
      setIsOpen(false);
    }
    // Otherwise map stays open for the level transition
  }, [router]);

  // Navigate back (from the back button in the map overlay)
  const navigateBack = useCallback((path: string) => {
    router.push(path);
    // Map stays open — the level transition will animate
  }, [router]);

  const isCurrentRoom = useCallback((room: MapRoom) => {
    return currentRoom?.id === room.id || pathname.startsWith(room.path);
  }, [currentRoom, pathname]);

  return {
    isOpen,
    isHomePage,
    currentRoom,
    currentPath: pathname,
    hoveredRoom,
    setHoveredRoom,
    toggle,
    close,
    navigateToRoom,
    navigateBack,
    isCurrentRoom,
  };
}
