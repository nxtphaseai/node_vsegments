/**
 * TypeScript definitions for vsegments
 */

/// <reference types="node" />

import { Canvas } from 'canvas';

export interface BoundingBoxData {
  label: string;
  y1: number;
  x1: number;
  y2: number;
  x2: number;
}

export class BoundingBox {
  label: string;
  y1: number;
  x1: number;
  y2: number;
  x2: number;

  constructor(label: string, y1: number, x1: number, y2: number, x2: number);
  toAbsolute(imgWidth: number, imgHeight: number): [number, number, number, number];
  static fromDict(data: any): BoundingBox;
}

export class SegmentationMask {
  y0: number;
  x0: number;
  y1: number;
  x1: number;
  mask: Buffer;
  label: string;

  constructor(y0: number, x0: number, y1: number, x1: number, mask: Buffer, label: string);
}

export class SegmentationResult {
  boxes: BoundingBox[];
  masks: SegmentationMask[] | null;
  rawResponse: string | null;

  constructor(boxes: BoundingBox[], masks?: SegmentationMask[] | null, rawResponse?: string | null);
  get length(): number;
}

export interface VSegmentsOptions {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxObjects?: number;
}

export interface DetectBoxesOptions {
  prompt?: string;
  customInstructions?: string;
  maxSize?: number;
}

export interface SegmentOptions {
  prompt?: string;
  maxSize?: number;
}

export interface VisualizeOptions {
  outputPath?: string;
  lineWidth?: number;
  fontSize?: number;
  alpha?: number;
}

export default class VSegments {
  constructor(options?: VSegmentsOptions);
  
  detectBoxes(imagePath: string, options?: DetectBoxesOptions): Promise<SegmentationResult>;
  segment(imagePath: string, options?: SegmentOptions): Promise<SegmentationResult>;
  visualize(imagePath: string, result: SegmentationResult, options?: VisualizeOptions): Promise<Canvas>;
}

export { VSegments };
export const version: string;
