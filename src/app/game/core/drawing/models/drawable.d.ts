export interface Drawable {
  draw: (ctx: CanvasRenderingContext2D) => void;
  zIndex: number;
}
