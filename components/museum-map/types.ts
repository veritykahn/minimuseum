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

export interface FloorPlanWall {
  x1: number; y1: number;
  x2: number; y2: number;
}

export interface FloorPlanRoom {
  id: string;
  label: string;
  path: string;
  accentColor: string;
  comingSoon?: boolean;
  parent?: string;
  children?: string[];
  x: number; y: number; width: number; height: number;
  labelX: number; labelY: number;
}

export interface ExhibitionFloorPlan {
  outline: { x: number; y: number; width: number; height: number; rx?: number };
  accentColor: string;
  walls: FloorPlanWall[];
  rooms: FloorPlanRoom[];
}

export interface MapAncestor {
  label: string;
  viewPath: string;
  accentColor: string;
}

export interface MapLevelConfig {
  level: MapLevel;
  viewBox: string;
  rooms: MapRoom[];
  connections: RoomConnection[];
  title?: string;
  backTarget?: { label: string; path: string };
  ancestors?: MapAncestor[];
  floorPlan?: ExhibitionFloorPlan;
}
