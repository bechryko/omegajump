interface CommonDrawingConfig {
  color: string;
  opacity?: number;
  isFixed?: boolean;
}

export interface RectangleDrawingConfig extends CommonDrawingConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  isStroke?: boolean;
  lineWidth?: number;
}

export interface CircleDrawingConfig extends CommonDrawingConfig {
  x: number;
  y: number;
  radius: number;
  isStroke?: boolean;
  lineWidth?: number;
}

export interface LineDrawingConfig extends CommonDrawingConfig {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  lineWidth?: number;
  lineCap?: CanvasLineCap;
}

interface CommonImageDrawingConfig extends Omit<CommonDrawingConfig, 'color'> {
  imageSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ImageDrawingConfig =
  | CommonImageDrawingConfig
  | (CommonImageDrawingConfig & {
      frameToDrawIdx: number;
      frameNumber: number;
    });

export interface TextDrawingConfig extends CommonDrawingConfig {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  isStroke?: boolean;
  fontFace?: string;
}

export interface OverlayDrawingConfig {
  color: string;
  opacity: number;
}
