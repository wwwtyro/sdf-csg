import { mat4, quat, vec3 } from "gl-matrix";
import { clamp, mix } from "./util";
import { isosurfaceGenerator } from "./isosurface";

export interface Bounds {
  min: vec3;
  max: vec3;
}

interface Mesh {
  positions: number[][];
  normals: number[][];
  cells: number[][];
  userdata: number[][] | null;
}

export abstract class SDF {
  protected _userData: number[] | null = null;

  public bounds: Bounds = {
    min: vec3.fromValues(0, 0, 0),
    max: vec3.fromValues(0, 0, 0),
  };

  abstract density(x: number, y: number, z: number): number;

  public normal(x: number, y: number, z: number) {
    const dr = 0.001;
    const p0 = this.density(x, y, z);
    const px = this.density(x + dr, y, z);
    const py = this.density(x, y + dr, z);
    const pz = this.density(x, y, z + dr);
    const n0 = vec3.fromValues((px - p0) / dr, (py - p0) / dr, (pz - p0) / dr);
    return vec3.normalize(vec3.create(), n0);
  }

  public generateMesh(resolution: number[], padding: number): Mesh {
    let t0 = performance.now();
    const grid = this.generateGrid(resolution, padding);
    console.log(`Grid: ${Math.round(performance.now() - t0)} ms`);
    t0 = performance.now();
    const mesh = isosurfaceGenerator(grid, 0);
    console.log(`Isosurface extraction: ${Math.round(performance.now() - t0)} ms`);
    const min = vec3.sub(vec3.create(), this.bounds.min, [padding, padding, padding]);
    const max = vec3.add(vec3.create(), this.bounds.max, [padding, padding, padding]);
    const dm = vec3.sub(vec3.create(), max, min);
    for (const position of mesh.positions as vec3[]) {
      vec3.mul(position, position, [dm[0] / resolution[0], dm[1] / resolution[1], dm[2] / resolution[2]]);
      vec3.add(position, position, min);
    }
    const normals: number[][] = [];
    for (const p of mesh.positions as vec3[]) {
      normals.push(this.normal(p[0], p[1], p[2]) as number[]);
    }
    let userdata: number[][] | null = null;
    if (this.getUserData(0, 0, 0) !== null) {
      userdata = [];
      for (const p of mesh.positions) {
        userdata.push(this.getUserData(p[0], p[1], p[2])!);
      }
    }
    return {
      ...mesh,
      normals,
      userdata,
    };
  }

  private generateGrid(resolution: number[], padding: number) {
    const grid = new Float32Array((resolution[0] + 1) * (resolution[1] + 1) * (resolution[2] + 1));
    const min = vec3.sub(vec3.create(), this.bounds.min, [padding, padding, padding]);
    const max = vec3.add(vec3.create(), this.bounds.max, [padding, padding, padding]);
    const dx = (max[0] - min[0]) / resolution[0];
    const dy = (max[1] - min[1]) / resolution[1];
    const dz = (max[2] - min[2]) / resolution[2];
    for (let i = 0; i < resolution[0] + 1; i++) {
      const x = i * dx + min[0];
      for (let j = 0; j < resolution[1] + 1; j++) {
        const y = j * dy + min[1];
        for (let k = 0; k < resolution[2] + 1; k++) {
          const z = k * dz + min[2];
          const index = resolution[0] * resolution[2] * j + resolution[0] * k + i;
          grid[index] = this.density(x, y, z);
        }
      }
    }
    return {
      get: (i: number, j: number, k: number) => grid[resolution[0] * resolution[2] * j + resolution[0] * k + i],
      shape: [resolution[0] + 1, resolution[1] + 1, resolution[2] + 1],
    };
  }

  public setUserData(data: number[]) {
    this._userData = data.slice();
    return this;
  }

  public getUserData(x: number, y: number, z: number) {
    return this._userData;
  }

  public union(sdf: SDF) {
    return new Union(this, sdf);
  }

  public subtract(sdf: SDF) {
    return new Subtraction(sdf, this);
  }

  public intersect(sdf: SDF) {
    return new Intersection(sdf, this);
  }

  public smoothUnion(sdf: SDF, smoothness: number) {
    return new SmoothUnion(this, sdf, smoothness);
  }

  public smoothSubtract(sdf: SDF, smoothness: number) {
    return new SmoothSubtraction(sdf, this, smoothness);
  }

  public smoothIntersect(sdf: SDF, smoothness: number) {
    return new SmoothIntersection(this, sdf, smoothness);
  }

  public translate(x: number, y: number, z: number) {
    return new Transform(this, [x, y, z], quat.create() as number[], 1.0);
  }

  public rotate(quat: number[]) {
    return new Transform(this, [0, 0, 0], quat, 1.0);
  }

  public rotateX(radians: number) {
    return new Transform(this, [0, 0, 0], quat.rotateX(quat.create(), quat.create(), radians) as number[], 1.0);
  }

  public rotateY(radians: number) {
    return new Transform(this, [0, 0, 0], quat.rotateY(quat.create(), quat.create(), radians) as number[], 1.0);
  }

  public rotateZ(radians: number) {
    return new Transform(this, [0, 0, 0], quat.rotateZ(quat.create(), quat.create(), radians) as number[], 1.0);
  }

  public scale(amount: number) {
    return new Transform(this, [0, 0, 0], quat.create() as number[], amount);
  }

  public round(amount: number) {
    return new Round(this, amount);
  }
}

export class Subtraction extends SDF {
  constructor(private sdf1: SDF, private sdf2: SDF) {
    super();
    vec3.copy(this.bounds.min, sdf2.bounds.min);
    vec3.copy(this.bounds.max, sdf2.bounds.max);
  }

  public density = (x: number, y: number, z: number) => {
    const d1 = this.sdf1.density(x, y, z);
    const d2 = this.sdf2.density(x, y, z);
    return Math.max(-d1, d2);
  };

  public getUserData(x: number, y: number, z: number) {
    if (this._userData !== null) {
      return this._userData;
    }
    const ud1 = this.sdf1.getUserData(x, y, z);
    const ud2 = this.sdf2.getUserData(x, y, z);
    if (ud1 !== null && ud2 === null) {
      return ud1;
    } else if (ud1 === null && ud2 !== null) {
      return ud2;
    } else if (ud1 === null && ud2 === null) {
      return null;
    }
    const d1 = Math.abs(this.sdf1.density(x, y, z));
    const d2 = Math.abs(this.sdf2.density(x, y, z));
    const frac = d1 / (d1 + d2);
    const lerp: number[] = [];
    for (let i = 0; i < ud1!.length; i++) {
      lerp.push(ud1![i] + frac * (ud2![i] - ud1![i]));
    }
    return lerp;
  }
}

export class Union extends SDF {
  constructor(private sdf1: SDF, private sdf2: SDF) {
    super();
    vec3.min(this.bounds.min, sdf1.bounds.min, sdf2.bounds.min);
    vec3.max(this.bounds.max, sdf1.bounds.max, sdf2.bounds.max);
  }

  public density = (x: number, y: number, z: number) => {
    const d1 = this.sdf1.density(x, y, z);
    const d2 = this.sdf2.density(x, y, z);
    return Math.min(d1, d2);
  };

  public getUserData(x: number, y: number, z: number) {
    if (this._userData !== null) {
      return this._userData;
    }
    const ud1 = this.sdf1.getUserData(x, y, z);
    const ud2 = this.sdf2.getUserData(x, y, z);
    if (ud1 !== null && ud2 === null) {
      return ud1;
    } else if (ud1 === null && ud2 !== null) {
      return ud2;
    } else if (ud1 === null && ud2 === null) {
      return null;
    }
    const d1 = Math.abs(this.sdf1.density(x, y, z));
    const d2 = Math.abs(this.sdf2.density(x, y, z));
    const frac = d1 / (d1 + d2);
    const lerp: number[] = [];
    for (let i = 0; i < ud1!.length; i++) {
      lerp.push(ud1![i] + frac * (ud2![i] - ud1![i]));
    }
    return lerp;
  }
}

export class Intersection extends SDF {
  constructor(private sdf1: SDF, private sdf2: SDF) {
    super();
    vec3.max(this.bounds.min, sdf1.bounds.min, sdf2.bounds.min);
    vec3.min(this.bounds.max, sdf1.bounds.max, sdf2.bounds.max);
  }

  public density = (x: number, y: number, z: number) => {
    const d1 = this.sdf1.density(x, y, z);
    const d2 = this.sdf2.density(x, y, z);
    return Math.max(d1, d2);
  };

  public getUserData(x: number, y: number, z: number) {
    if (this._userData !== null) {
      return this._userData;
    }
    const ud1 = this.sdf1.getUserData(x, y, z);
    const ud2 = this.sdf2.getUserData(x, y, z);
    if (ud1 !== null && ud2 === null) {
      return ud1;
    } else if (ud1 === null && ud2 !== null) {
      return ud2;
    } else if (ud1 === null && ud2 === null) {
      return null;
    }
    const d1 = Math.abs(this.sdf1.density(x, y, z));
    const d2 = Math.abs(this.sdf2.density(x, y, z));
    const frac = d1 / (d1 + d2);
    const lerp: number[] = [];
    for (let i = 0; i < ud1!.length; i++) {
      lerp.push(ud1![i] + frac * (ud2![i] - ud1![i]));
    }
    return lerp;
  }
}

export class SmoothSubtraction extends SDF {
  constructor(private sdf1: SDF, private sdf2: SDF, private smoothness: number) {
    super();
    vec3.copy(this.bounds.min, sdf2.bounds.min);
    vec3.copy(this.bounds.max, sdf2.bounds.max);
  }

  public density = (x: number, y: number, z: number) => {
    const d1 = this.sdf1.density(x, y, z);
    const d2 = this.sdf2.density(x, y, z);
    const h = clamp(0.5 - (0.5 * (d2 + d1)) / this.smoothness, 0.0, 1.0);
    return mix(d2, -d1, h) + this.smoothness * h * (1.0 - h);
  };

  public getUserData(x: number, y: number, z: number) {
    if (this._userData !== null) {
      return this._userData;
    }
    const ud1 = this.sdf1.getUserData(x, y, z);
    const ud2 = this.sdf2.getUserData(x, y, z);
    if (ud1 !== null && ud2 === null) {
      return ud1;
    } else if (ud1 === null && ud2 !== null) {
      return ud2;
    } else if (ud1 === null && ud2 === null) {
      return null;
    }
    const d1 = Math.abs(this.sdf1.density(x, y, z));
    const d2 = Math.abs(this.sdf2.density(x, y, z));
    const frac = d1 / (d1 + d2);
    const lerp: number[] = [];
    for (let i = 0; i < ud1!.length; i++) {
      lerp.push(ud1![i] + frac * (ud2![i] - ud1![i]));
    }
    return lerp;
  }
}

export class SmoothUnion extends SDF {
  constructor(private sdf1: SDF, private sdf2: SDF, private smoothness: number) {
    super();
    vec3.min(this.bounds.min, sdf1.bounds.min, sdf2.bounds.min);
    vec3.max(this.bounds.max, sdf1.bounds.max, sdf2.bounds.max);
  }

  public density = (x: number, y: number, z: number) => {
    const d1 = this.sdf1.density(x, y, z);
    const d2 = this.sdf2.density(x, y, z);
    const h = clamp(0.5 + (0.5 * (d2 - d1)) / this.smoothness, 0.0, 1.0);
    return mix(d2, d1, h) - this.smoothness * h * (1.0 - h);
  };

  public getUserData(x: number, y: number, z: number) {
    if (this._userData !== null) {
      return this._userData;
    }
    const ud1 = this.sdf1.getUserData(x, y, z);
    const ud2 = this.sdf2.getUserData(x, y, z);
    if (ud1 !== null && ud2 === null) {
      return ud1;
    } else if (ud1 === null && ud2 !== null) {
      return ud2;
    } else if (ud1 === null && ud2 === null) {
      return null;
    }
    const d1 = Math.abs(this.sdf1.density(x, y, z));
    const d2 = Math.abs(this.sdf2.density(x, y, z));
    const frac = d1 / (d1 + d2);
    const lerp: number[] = [];
    for (let i = 0; i < ud1!.length; i++) {
      lerp.push(ud1![i] + frac * (ud2![i] - ud1![i]));
    }
    return lerp;
  }
}

export class SmoothIntersection extends SDF {
  constructor(private sdf1: SDF, private sdf2: SDF, private smoothness: number) {
    super();
    vec3.max(this.bounds.min, sdf1.bounds.min, sdf2.bounds.min);
    vec3.min(this.bounds.max, sdf1.bounds.max, sdf2.bounds.max);
  }

  public density = (x: number, y: number, z: number) => {
    const d1 = this.sdf1.density(x, y, z);
    const d2 = this.sdf2.density(x, y, z);
    const h = clamp(0.5 - (0.5 * (d2 - d1)) / this.smoothness, 0.0, 1.0);
    return mix(d2, d1, h) + this.smoothness * h * (1.0 - h);
  };

  public getUserData(x: number, y: number, z: number) {
    if (this._userData !== null) {
      return this._userData;
    }
    const ud1 = this.sdf1.getUserData(x, y, z);
    const ud2 = this.sdf2.getUserData(x, y, z);
    if (ud1 !== null && ud2 === null) {
      return ud1;
    } else if (ud1 === null && ud2 !== null) {
      return ud2;
    } else if (ud1 === null && ud2 === null) {
      return null;
    }
    const d1 = Math.abs(this.sdf1.density(x, y, z));
    const d2 = Math.abs(this.sdf2.density(x, y, z));
    const frac = d1 / (d1 + d2);
    const lerp: number[] = [];
    for (let i = 0; i < ud1!.length; i++) {
      lerp.push(ud1![i] + frac * (ud2![i] - ud1![i]));
    }
    return lerp;
  }
}

export class Transform extends SDF {
  private matrix: mat4;

  constructor(private sdf: SDF, translation: number[], rotation: number[], scale: number) {
    super();
    this.matrix = mat4.fromRotationTranslationScale(
      mat4.create(),
      rotation,
      translation as vec3,
      vec3.fromValues(scale, scale, scale)
    );
    const bmin = vec3.clone(this.sdf.bounds.min);
    const bmax = vec3.clone(this.sdf.bounds.max);
    const db = vec3.subtract(vec3.create(), bmax, bmin);
    const t0 = vec3.add(vec3.create(), bmin, [db[0], 0, 0]);
    const t1 = vec3.add(vec3.create(), bmin, [db[0], db[1], 0]);
    const t2 = vec3.add(vec3.create(), bmin, [0, db[1], 0]);
    const t3 = vec3.sub(vec3.create(), bmax, [db[0], 0, 0]);
    const t4 = vec3.sub(vec3.create(), bmax, [db[0], db[1], 0]);
    const t5 = vec3.sub(vec3.create(), bmax, [0, db[1], 0]);
    vec3.transformMat4(bmin, bmin, this.matrix);
    vec3.transformMat4(bmax, bmax, this.matrix);
    vec3.transformMat4(t0, t0, this.matrix);
    vec3.transformMat4(t1, t1, this.matrix);
    vec3.transformMat4(t2, t2, this.matrix);
    vec3.transformMat4(t3, t3, this.matrix);
    vec3.transformMat4(t4, t4, this.matrix);
    vec3.transformMat4(t5, t5, this.matrix);
    vec3.min(this.bounds.min, bmin, bmax);
    vec3.min(this.bounds.min, this.bounds.min, t0);
    vec3.min(this.bounds.min, this.bounds.min, t1);
    vec3.min(this.bounds.min, this.bounds.min, t2);
    vec3.min(this.bounds.min, this.bounds.min, t3);
    vec3.min(this.bounds.min, this.bounds.min, t4);
    vec3.min(this.bounds.min, this.bounds.min, t5);
    vec3.max(this.bounds.max, bmin, bmax);
    vec3.max(this.bounds.max, this.bounds.max, t0);
    vec3.max(this.bounds.max, this.bounds.max, t1);
    vec3.max(this.bounds.max, this.bounds.max, t2);
    vec3.max(this.bounds.max, this.bounds.max, t3);
    vec3.max(this.bounds.max, this.bounds.max, t4);
    vec3.max(this.bounds.max, this.bounds.max, t5);
    mat4.invert(this.matrix, this.matrix);
  }

  public density = (x: number, y: number, z: number) => {
    const point = vec3.fromValues(x, y, z);
    vec3.transformMat4(point, point, this.matrix);
    return this.sdf.density(point[0], point[1], point[2]);
  };

  public getUserData(x: number, y: number, z: number) {
    if (this._userData !== null) {
      return this._userData;
    }
    const p = vec3.transformMat4(vec3.create(), [x, y, z], this.matrix);
    return this.sdf.getUserData(p[0], p[1], p[2]);
  }
}

export class Round extends SDF {
  constructor(private sdf: SDF, private radius: number) {
    super();
    vec3.sub(this.bounds.min, sdf.bounds.min, [radius, radius, radius]);
    vec3.add(this.bounds.max, sdf.bounds.max, [radius, radius, radius]);
  }

  public density = (x: number, y: number, z: number) => {
    return this.sdf.density(x, y, z) - this.radius;
  };

  public getUserData(x: number, y: number, z: number) {
    if (this._userData !== null) {
      return this._userData;
    }
    return this.sdf.getUserData(x, y, z);
  }
}
