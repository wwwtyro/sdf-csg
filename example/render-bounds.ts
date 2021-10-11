import { mat4, vec3 } from "gl-matrix";
import { Regl } from "regl";
import { Bounds } from "../src";

function roundCapJoinGeometry(regl: Regl, resolution: number) {
  const instanceRoundRound = [
    [0, -0.5, 0],
    [0, -0.5, 1],
    [0, 0.5, 1],
    [0, -0.5, 0],
    [0, 0.5, 1],
    [0, 0.5, 0],
  ];
  // Add the left cap.
  for (let step = 0; step < resolution; step++) {
    const theta0 = Math.PI / 2 + ((step + 0) * Math.PI) / resolution;
    const theta1 = Math.PI / 2 + ((step + 1) * Math.PI) / resolution;
    instanceRoundRound.push([0, 0, 0]);
    instanceRoundRound.push([0.5 * Math.cos(theta0), 0.5 * Math.sin(theta0), 0]);
    instanceRoundRound.push([0.5 * Math.cos(theta1), 0.5 * Math.sin(theta1), 0]);
  }
  // Add the right cap.
  for (let step = 0; step < resolution; step++) {
    const theta0 = (3 * Math.PI) / 2 + ((step + 0) * Math.PI) / resolution;
    const theta1 = (3 * Math.PI) / 2 + ((step + 1) * Math.PI) / resolution;
    instanceRoundRound.push([0, 0, 1]);
    instanceRoundRound.push([0.5 * Math.cos(theta0), 0.5 * Math.sin(theta0), 1]);
    instanceRoundRound.push([0.5 * Math.cos(theta1), 0.5 * Math.sin(theta1), 1]);
  }
  return {
    buffer: regl.buffer(instanceRoundRound),
    count: instanceRoundRound.length,
  };
}

export function createBoundsRenderer(regl: Regl) {
  const roundCapJoin = roundCapJoinGeometry(regl, 8);

  const command = regl({
    vert: `
      precision highp float;
      attribute vec3 position;
      attribute vec3 pointA, pointB;

      uniform float width;
      uniform vec2 resolution;
      uniform mat4 model, view, projection;

      varying vec3 vColor;

      void main() {
        vec4 clip0 = projection * view * model * vec4(pointA, 1.0);
        vec4 clip1 = projection * view * model * vec4(pointB, 1.0);
        vec2 screen0 = resolution * (0.5 * clip0.xy/clip0.w + 0.5);
        vec2 screen1 = resolution * (0.5 * clip1.xy/clip1.w + 0.5);
        vec2 xBasis = normalize(screen1 - screen0);
        vec2 yBasis = vec2(-xBasis.y, xBasis.x);
        vec2 pt0 = screen0 + width * (position.x * xBasis + position.y * yBasis);
        vec2 pt1 = screen1 + width * (position.x * xBasis + position.y * yBasis);
        vec2 pt = mix(pt0, pt1, position.z);
        vec4 clip = mix(clip0, clip1, position.z);
        gl_Position = vec4(clip.w * (2.0 * pt/resolution - 1.0), clip.z, clip.w);
      }`,

    frag: `
      precision highp float;

      void main() {
        gl_FragColor = vec4(0.9,0.9,0.9,1);
      }`,

    attributes: {
      position: {
        buffer: roundCapJoin.buffer,
        divisor: 0,
      },
      pointA: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 0,
        stride: Float32Array.BYTES_PER_ELEMENT * 6,
      },
      pointB: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 3,
        stride: Float32Array.BYTES_PER_ELEMENT * 6,
      },
    },

    uniforms: {
      width: regl.prop<any, any>("width"),
      model: regl.prop<any, any>("model"),
      view: regl.prop<any, any>("view"),
      projection: regl.prop<any, any>("projection"),
      resolution: regl.prop<any, any>("resolution"),
    },

    // cull: {
    //   enable: true,
    //   face: "back",
    // },

    count: roundCapJoin.count,
    instances: regl.prop<any, any>("segments"),
    viewport: regl.prop<any, any>("viewport"),
  });

  return function renderBounds(bounds: Bounds, resolution: number[], model: mat4, view: mat4, projection: mat4) {
    const bmin = vec3.clone(bounds.min);
    const bmax = vec3.clone(bounds.max);
    const db = vec3.subtract(vec3.create(), bmax, bmin);
    const t0 = vec3.add(vec3.create(), bmin, [db[0], 0, 0]);
    const t1 = vec3.add(vec3.create(), bmin, [db[0], db[1], 0]);
    const t2 = vec3.add(vec3.create(), bmin, [0, db[1], 0]);
    const t3 = vec3.sub(vec3.create(), bmax, [db[0], 0, 0]);
    const t4 = vec3.sub(vec3.create(), bmax, [db[0], db[1], 0]);
    const t5 = vec3.sub(vec3.create(), bmax, [0, db[1], 0]);
    const points: vec3[] = [];
    points.push(bmin, t0, bmin, t2, t0, t1, t2, t1);
    points.push(bmax, t3, bmax, t5, t3, t4, t5, t4);
    points.push(t1, bmax, t0, t5, bmin, t4, t2, t3);
    command({
      points,
      width: 2,
      segments: points.length / 2,
      resolution,
      model,
      view,
      projection,
      viewport: { x: 0, y: 0, width: resolution[0], height: resolution[1] },
    });
  };
}
