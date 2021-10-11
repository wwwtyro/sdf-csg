import { vec2, vec3 } from "gl-matrix";
import { SDF } from "./sdf";
import { clamp, vec2abs, vec3abs } from "./util";

export class Box extends SDF {
  private radii;

  constructor(width: number, height: number, depth: number) {
    super();
    this.radii = vec3.fromValues(width, height, depth);
    vec3.negate(this.bounds.min, this.radii);
    vec3.copy(this.bounds.max, this.radii);
  }

  public density = (x: number, y: number, z: number) => {
    const p = vec3.fromValues(x, y, z);
    const absp = vec3abs(vec3.create(), p);
    const q = vec3.subtract(vec3.create(), absp, this.radii);
    const posq = vec3.max(vec3.create(), q, vec3.fromValues(0, 0, 0));
    return vec3.length(posq) + Math.min(Math.max(q[0], Math.max(q[1], q[2])), 0);
  };
}

export class Sphere extends SDF {
  constructor(private radius: number) {
    super();
    vec3.negate(this.bounds.min, [this.radius, this.radius, this.radius]);
    vec3.set(this.bounds.max, this.radius, this.radius, this.radius);
  }

  public density = (x: number, y: number, z: number) => {
    const p = vec3.fromValues(x, y, z);
    return vec3.length(p) - this.radius;
  };
}

export class BoxFrame extends SDF {
  private radii;
  constructor(width: number, height: number, depth: number, private edge: number) {
    super();
    this.radii = vec3.fromValues(width, height, depth);
    vec3.negate(this.bounds.min, this.radii);
    vec3.copy(this.bounds.max, this.radii);
  }

  public density = (x: number, y: number, z: number) => {
    const p = vec3.subtract(vec3.create(), vec3abs(vec3.create(), vec3.fromValues(x, y, z)), this.radii);
    const e = vec3.fromValues(this.edge, this.edge, this.edge);
    const q = vec3.sub(vec3.create(), vec3abs(vec3.create(), vec3.add(vec3.create(), p, e)), e);
    return Math.min(
      Math.min(
        vec3.length(vec3.max(vec3.create(), [p[0], q[1], q[2]], [0, 0, 0])) +
          Math.min(Math.max(p[0], Math.max(q[1], q[2])), 0.0),
        vec3.length(vec3.max(vec3.create(), [q[0], p[1], q[2]], [0, 0, 0])) +
          Math.min(Math.max(q[0], Math.max(p[1], q[2])), 0.0)
      ),
      vec3.length(vec3.max(vec3.create(), [q[0], q[1], p[2]], [0, 0, 0])) +
        Math.min(Math.max(q[0], Math.max(q[1], p[2])), 0.0)
    );
  };
}

export class Torus extends SDF {
  constructor(private majorRadius: number, private minorRadius: number) {
    super();
    vec3.set(this.bounds.min, -majorRadius - minorRadius, -majorRadius - minorRadius, -minorRadius);
    vec3.set(this.bounds.max, majorRadius + minorRadius, majorRadius + minorRadius, +minorRadius);
  }

  public density = (x: number, y: number, z: number) => {
    const q = vec2.fromValues(vec2.length(vec2.fromValues(x, y)) - this.majorRadius, z);
    return vec2.length(q) - this.minorRadius;
  };
}

export class CappedTorus extends SDF {
  constructor(private majorRadius: number, private minorRadius: number, private angle: number) {
    super();
    vec3.set(this.bounds.min, -majorRadius - minorRadius, -majorRadius - minorRadius, -minorRadius);
    vec3.set(this.bounds.max, majorRadius + minorRadius, majorRadius + minorRadius, +minorRadius);
  }

  public density = (x: number, y: number, z: number) => {
    const sc = vec2.fromValues(Math.sin(this.angle), Math.cos(this.angle));
    x = Math.abs(x);
    const k = sc[1] * x > sc[0] * y ? vec2.dot([x, y], sc) : vec2.length([x, y]);
    const p = vec3.fromValues(x, y, z);
    return (
      Math.sqrt(vec3.dot(p, p) + this.majorRadius * this.majorRadius - 2.0 * this.majorRadius * k) - this.minorRadius
    );
  };
}

export class Link extends SDF {
  constructor(private majorRadius: number, private minorRadius: number, private length: number) {
    super();
    vec3.set(this.bounds.min, -majorRadius - minorRadius, -majorRadius - minorRadius - length, -minorRadius);
    vec3.set(this.bounds.max, majorRadius + minorRadius, majorRadius + minorRadius + length, +minorRadius);
  }

  public density = (x: number, y: number, z: number) => {
    const q = vec3.fromValues(x, Math.max(Math.abs(y) - this.length, 0.0), z);
    return vec2.length(vec2.fromValues(vec2.length([q[0], q[1]]) - this.majorRadius, q[2])) - this.minorRadius;
  };
}

export class Cone extends SDF {
  constructor(private angle: number, private height: number) {
    super();
    const sigma = height * Math.tan(angle);
    vec3.set(this.bounds.min, -sigma, -height, -sigma);
    vec3.set(this.bounds.max, sigma, 0, sigma);
  }

  public density = (x: number, y: number, z: number) => {
    const c = [Math.sin(this.angle), Math.cos(this.angle)];
    const q = vec2.scale(vec2.create(), vec2.fromValues(c[0] / c[1], -1.0), this.height);

    const w = vec2.fromValues(vec2.length([x, z]), y);
    const a = vec2.sub(
      vec2.create(),
      w,
      vec2.scale(vec2.create(), q, clamp(vec2.dot(w, q) / vec2.dot(q, q), 0.0, 1.0))
    );
    const b = vec2.sub(
      vec2.create(),
      w,
      vec2.mul(vec2.create(), q, vec2.fromValues(clamp(w[0] / q[0], 0.0, 1.0), 1.0))
    );
    const k = Math.sign(q[1]);
    const d = Math.min(vec2.dot(a, a), vec2.dot(b, b));
    const s = Math.max(k * (w[0] * q[1] - w[1] * q[0]), k * (w[1] - q[1]));
    return Math.sqrt(d) * Math.sign(s);
  };
}

export class HexagonalPrism extends SDF {
  constructor(private radius: number, private length: number) {
    super();
    const h = radius / Math.cos(Math.PI / 6);
    vec3.set(this.bounds.min, -h, -radius, -length);
    vec3.set(this.bounds.max, h, radius, length);
  }

  public density = (x: number, y: number, z: number) => {
    const k = vec3.fromValues(-0.8660254, 0.5, 0.57735);
    const p = vec3.fromValues(x, y, z);
    vec3abs(p, p);
    const q = vec2.scale(vec2.create(), [k[0], k[1]], 2.0 * Math.min(vec2.dot([k[0], k[1]], [p[0], p[1]]), 0.0));
    p[0] -= q[0];
    p[1] -= q[1];
    const d = vec2.fromValues(
      vec2.length(
        vec2.sub(
          vec2.create(),
          [p[0], p[1]],
          vec2.fromValues(clamp(p[0], -k[2] * this.radius, k[2] * this.radius), this.radius)
        )
      ) * Math.sign(p[1] - this.radius),
      p[2] - this.length
    );

    return Math.min(Math.max(d[0], d[1]), 0.0) + vec2.length(vec2.max(vec2.create(), d, [0, 0]));
  };
}

export class Capsule extends SDF {
  constructor(private pointA: number[], private pointB: number[], private radius: number) {
    super();
    const min = vec3.min(vec3.create(), pointA as vec3, pointB as vec3);
    const max = vec3.max(vec3.create(), pointA as vec3, pointB as vec3);
    vec3.sub(this.bounds.min, min, [radius, radius, radius]);
    vec3.add(this.bounds.max, max, [radius, radius, radius]);
  }

  public density = (x: number, y: number, z: number) => {
    const p = vec3.fromValues(x, y, z);
    const pa = vec3.sub(vec3.create(), p, this.pointA as vec3);
    const ba = vec3.sub(vec3.create(), this.pointB as vec3, this.pointA as vec3);
    const h = clamp(vec3.dot(pa, ba) / vec3.dot(ba, ba), 0.0, 1.0);
    return vec3.length(vec3.sub(vec3.create(), pa, vec3.scale(vec3.create(), ba, h))) - this.radius;
  };
}

export class CappedCylinder extends SDF {
  constructor(private length: number, private radius: number) {
    super();
    vec3.set(this.bounds.min, -radius, -length, -radius);
    vec3.set(this.bounds.max, radius, length, radius);
  }

  public density = (x: number, y: number, z: number) => {
    const d = vec2.sub(
      vec2.create(),
      vec2abs(vec2.create(), vec2.fromValues(vec2.length([x, z]), y)),
      vec2.fromValues(this.radius, this.length)
    );
    return Math.min(Math.max(d[0], d[1]), 0.0) + vec2.length(vec2.max(vec2.create(), d, [0, 0]));
  };
}

export class CappedCone extends SDF {
  constructor(private length: number, private radius1: number, private radius2: number) {
    super();
    const r = Math.max(radius1, radius2);
    vec3.set(this.bounds.min, -r, -length, -r);
    vec3.set(this.bounds.max, r, length, r);
  }

  public density = (x: number, y: number, z: number) => {
    const q = vec2.fromValues(vec2.length([x, z]), y);
    const k1 = vec2.fromValues(this.radius2, this.length);
    const k2 = vec2.fromValues(this.radius2 - this.radius1, 2.0 * this.length);
    const ca = vec2.fromValues(
      q[0] - Math.min(q[0], q[1] < 0.0 ? this.radius1 : this.radius2),
      Math.abs(q[1]) - this.length
    );
    const qk1 = vec2.sub(vec2.create(), k1, q);
    const cb = vec2.add(
      vec2.create(),
      vec2.sub(vec2.create(), q, k1),
      vec2.scale(vec2.create(), k2, clamp(vec2.dot(qk1, k2) / vec2.dot(k2, k2), 0.0, 1.0))
    );
    const s = cb[0] < 0.0 && ca[1] < 0.0 ? -1.0 : 1.0;
    return s * Math.sqrt(Math.min(vec2.dot(ca, ca), vec2.dot(cb, cb)));
  };
}

export class SolidAngle extends SDF {
  constructor(private angle: number, private radius: number) {
    super();
    const h = radius * Math.sin(angle);
    vec3.set(this.bounds.min, -h, 0, -h);
    vec3.set(this.bounds.max, h, radius, h);
  }

  public density = (x: number, y: number, z: number) => {
    const c = vec2.fromValues(Math.sin(this.angle), Math.cos(this.angle));
    const q = vec2.fromValues(vec2.length([x, z]), y);
    const l = vec2.length(q) - this.radius;
    const m = vec2.length(
      vec2.sub(vec2.create(), q, vec2.scale(vec2.create(), c, clamp(vec2.dot(q, c), 0.0, this.radius)))
    );
    return Math.max(l, m * Math.sign(c[1] * q[0] - c[0] * q[1]));
  };
}

export class TriangularPrism_ extends SDF {
  constructor(private radius: number, private length: number) {
    super();
    const h0 = (0.5 * radius) / Math.cos(Math.PI / 3);
    const h1 = 0.5 * radius * Math.tan(Math.PI / 3);
    vec3.set(this.bounds.min, -h1, -0.5 * radius, -length);
    vec3.set(this.bounds.max, h1, h0, length);
  }

  public density = (x: number, y: number, z: number) => {
    const q = vec3abs(vec3.create(), [x, y, z]);
    return Math.max(q[2] - this.length, Math.max(q[0] * 0.866025 + y * 0.5, -y) - this.radius * 0.5);
  };
}
