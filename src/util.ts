import { vec2, vec3 } from "gl-matrix";

export function vec3abs(out: vec3, p: vec3) {
  out[0] = Math.abs(p[0]);
  out[1] = Math.abs(p[1]);
  out[2] = Math.abs(p[2]);
  return out;
}

export function vec2abs(out: vec2, p: vec2) {
  out[0] = Math.abs(p[0]);
  out[1] = Math.abs(p[1]);
  return out;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function mix(n0: number, n1: number, frac: number) {
  return n0 * (1 - frac) + n1 * frac;
}
