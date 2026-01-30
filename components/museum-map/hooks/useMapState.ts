'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MapRoom } from '../types';
import { getRoomByPath } from '../data/rooms';

/**
 * Hook for managing museum map state
 */
export function useMapState() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Don't show map on home/splash page
  const isHomePage = pathname === '/';

  // Find current room based on pathname
  const currentRoom = getRoomByPath(pathname);

  // Close map on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
    if (!room.comingSoon) {
      router.push(room.path);
      setIsOpen(false);
    }
  }, [router]);

  const isCurrentRoom = useCallback((room: MapRoom) => {
    return currentRoom?.id === room.id || pathname.startsWith(room.path);
  }, [currentRoom, pathname]);

  return {
    isOpen,
    isHomePage,
    currentRoom,
    hoveredRoom,
    setHoveredRoom,
    toggle,
    close,
    navigateToRoom,
    isCurrentRoom,
  };
}
