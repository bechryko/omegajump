export interface RectangleDrawingConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  isStroke?: boolean;
  color?: string;
}

export interface CircleDrawingConfig {
  x: number;
  y: number;
  radius: number;
  isStroke?: boolean;
  color?: string;
}

export interface LineDrawingConfig {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  lineWidth?: number;
}

export interface ImageDrawingConfig {
  imageSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
