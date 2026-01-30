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
