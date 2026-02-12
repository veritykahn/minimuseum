'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MapRoom, FloorPlanRoom } from '../types';
import { getRoomByPath } from '../data/rooms';

/**
 * Hook for managing museum map state.
 *
 * The map has its own internal viewPath so you can browse levels
 * (Great Hall → 1st Floor → Exhibition) without leaving the current page.
 * Only clicking a leaf room (no children) actually navigates.
 */
export function useMapState() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewPath, setViewPath] = useState<string | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === '/';

  // The actual current page (for "You are here")
  const currentRoom = getRoomByPath(pathname);

  // What the map is displaying — defaults to current pathname
  const effectiveViewPath = isOpen ? (viewPath ?? pathname) : pathname;

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setViewPath(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        // Opening — initialize view to current route
        setViewPath(pathname);
      } else {
        // Closing — reset
        setViewPath(null);
      }
      return !prev;
    });
  }, [pathname]);

  const close = useCallback(() => {
    setIsOpen(false);
    setViewPath(null);
  }, []);

  // Navigate within the map only (change what's displayed, don't change URL)
  const navigateInMap = useCallback((path: string) => {
    setViewPath(path);
  }, []);

  // Click a room on the map
  const navigateToRoom = useCallback((room: MapRoom | FloorPlanRoom) => {
    if ('comingSoon' in room && room.comingSoon) return;

    const hasChildren = 'children' in room && room.children && room.children.length > 0;

    if (hasChildren) {
      // Has children → browse deeper in the map (don't navigate page)
      navigateInMap(room.path);
    } else {
      // Leaf node → actually navigate and close the map
      router.push(room.path);
      close();
    }
  }, [router, close, navigateInMap]);

  const isCurrentRoom = useCallback((room: { path: string; id?: string }) => {
    return currentRoom?.id === room.id || pathname.startsWith(room.path);
  }, [currentRoom, pathname]);

  return {
    isOpen,
    isHomePage,
    currentRoom,
    currentPath: pathname,
    viewPath: effectiveViewPath,
    hoveredRoom,
    setHoveredRoom,
    toggle,
    close,
    navigateToRoom,
    navigateInMap,
    isCurrentRoom,
  };
}
