import REGL from "regl";
import Trackball from "trackball-controller";
import { mat4 } from "gl-matrix";

import { Box, Sphere, CappedCylinder } from "../src";
// import { createBoundsRenderer } from "./render-bounds";

const regl = REGL({
  extensions: ["ANGLE_instanced_arrays", "OES_element_index_uint"],
});

// const renderBounds = createBoundsRenderer(regl);

const sdf = new Sphere(1)
  .setUserData([0, 0, 1])
  .smoothIntersect(new Box(0.75, 0.75, 0.75).setUserData([1, 0, 0]), 0.1)
  .smoothSubtract(
    new CappedCylinder(1, 0.5)
      .smoothUnion(new CappedCylinder(1, 0.5).rotateX(Math.PI / 2), 0.1)
      .smoothUnion(new CappedCylinder(1, 0.5).rotateZ(Math.PI / 2), 0.1)
      .setUserData([0, 1, 0]),
    0.1
  );

const padding = 0.2;

const mesh = sdf.generateMesh([64, 64, 64], padding);

const buffers = {
  positions: regl.buffer(mesh.positions),
  colors: regl.buffer(mesh.userdata),
  normals: regl.buffer(mesh.normals),
  cells: regl.elements(mesh.cells),
};

const render = regl({
  vert: `
    precision highp float;
    attribute vec3 position, color, normal;
    uniform mat4 model, view, projection;
    varying vec3 vNormal, vColor;

    void main() {
      gl_Position = projection * view * model * vec4(position, 1.0);
      vNormal = vec3(model * vec4(normal, 1.0));
      vColor = color;
    }
  `,
  frag: `
    precision highp float;
    varying vec3 vNormal, vColor;

    void main() {
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float light = 0.5 + 0.5 * dot(normalize(vNormal), lightDir);
      gl_FragColor = vec4(light * vColor,1);
    }
  `,
  attributes: {
    position: regl.prop<any, any>("positions"),
    color: regl.prop<any, any>("colors"),
    normal: regl.prop<any, any>("normals"),
  },
  uniforms: {
    model: regl.prop<any, any>("model"),
    view: regl.prop<any, any>("view"),
    projection: regl.prop<any, any>("projection"),
  },
  viewport: regl.prop<any, any>("viewport"),
  elements: regl.prop<any, any>("cells"),

  cull: {
    enable: true,
    face: "back",
  },
});

const canvas = document.getElementsByTagName("canvas")[0];

var trackball = new Trackball(canvas, {
  drag: 0.01,
});
trackball.spin(Math.random() * 32 - 16, Math.random() * 32 - 16);

let zoom = 3;

window.addEventListener("wheel", (e) => {
  if (e.deltaY < 0) {
    zoom *= 0.95;
  } else {
    zoom /= 0.95;
  }
});

function renderLoop() {
  regl.clear({ color: [0, 0, 0, 0], depth: 1 });
  const view = mat4.lookAt(mat4.create(), [0, 0, zoom], [0, 0, 0], [0, 1, 0]);
  const projection = mat4.perspective(mat4.create(), Math.PI / 4, canvas.width / canvas.height, 0.1, 1000);
  const viewport = { x: 0, y: 0, width: canvas.width, height: canvas.height };
  render({
    ...buffers,
    model: trackball.rotation,
    view,
    projection,
    viewport,
  });
  // renderBounds(sdf.bounds, [canvas.width, canvas.height], trackball.rotation, view, projection);
  // const padded = {
  //   min: vec3.sub(vec3.create(), sdf.bounds.min, vec3.fromValues(padding, padding, padding)),
  //   max: vec3.add(vec3.create(), sdf.bounds.max, vec3.fromValues(padding, padding, padding)),
  // };
  // renderBounds(padded, [canvas.width, canvas.height], trackball.rotation, view, projection);
  requestAnimationFrame(renderLoop);
}

renderLoop();

console.log("done");
