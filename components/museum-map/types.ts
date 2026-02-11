/**
 * Types for the Museum Map component
 */

export interface MapRoom {
  id: string;
  label: string;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
  accentColor: string;
  comingSoon?: boolean;
  parent?: string;
  children?: string[];
}

export type RoomConnection = [string, string];

export type MapLevel = 'museum' | 'floor' | 'exhibition';

export type TransitionState = 'idle' | 'exiting' | 'entering';

export interface MapLevelConfig {
  level: MapLevel;
  viewBox: string;
  rooms: MapRoom[];
  connections: RoomConnection[];
  title?: string;
  backTarget?: { label: string; path: string };
  siblingExhibitions?: MapRoom[];
}
