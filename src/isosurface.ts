const unitCube = {
  points: [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
  ],
  edges: [
    [0, 1],
    [0, 2],
    [0, 4],
    [1, 3],
    [1, 5],
    [2, 3],
    [2, 6],
    [3, 7],
    [4, 5],
    [4, 6],
    [5, 7],
    [6, 7],
  ],
};

interface Grid {
  get(x: number, y: number, z: number): number;
  shape: number[];
}

export function isosurfaceGenerator(density: Grid, level: number) {
  const width = density.shape[0];
  const height = density.shape[1];
  const depth = density.shape[2];

  const featurePoints: number[][] = [];
  const featurePointIndex: Record<string, number> = {};

  function getFeaturePointIndex(x: number, y: number, z: number) {
    if ([x, y, z].toString() in featurePointIndex) return featurePointIndex[[x, y, z].toString()];
    const values: number[] = [];
    unitCube.points.forEach(function (v) {
      values.push(density.get(x + v[0], y + v[1], z + v[2]));
    });
    let p = [0, 0, 0];
    let sum = 0;
    unitCube.edges.forEach(function (e) {
      // if the surface doesn't pass through this edge, skip it
      if (values[e[0]] < level && values[e[1]] < level) return;
      if (values[e[0]] >= level && values[e[1]] >= level) return;
      // Calculate the rate of change of the density along this edge.
      const dv = values[e[1]] - values[e[0]];
      // Figure out how far along this edge the surface lies (linear approximation).
      const dr = (level - values[e[0]]) / dv;
      // Figure out the direction of this edge.
      const r = [
        unitCube.points[e[1]][0] - unitCube.points[e[0]][0],
        unitCube.points[e[1]][1] - unitCube.points[e[0]][1],
        unitCube.points[e[1]][2] - unitCube.points[e[0]][2],
      ];
      // Figure out the point that the surface intersects this edge.
      const interp = [
        unitCube.points[e[0]][0] + r[0] * dr,
        unitCube.points[e[0]][1] + r[1] * dr,
        unitCube.points[e[0]][2] + r[2] * dr,
      ];
      // Add this intersection to the sum of intersections.
      p = [p[0] + interp[0] + x, p[1] + interp[1] + y, p[2] + interp[2] + z];
      // Increment the edge intersection count for later averaging.
      sum++;
    });
    featurePoints.push([p[0] / sum, p[1] / sum, p[2] / sum]);
    featurePointIndex[[x, y, z].toString()] = featurePoints.length - 1;
    return featurePointIndex[[x, y, z].toString()];
  }

  const cells = [];

  for (let x = 0; x < width - 1; x++) {
    for (let y = 0; y < height - 1; y++) {
      for (let z = 0; z < depth - 1; z++) {
        const p0 = density.get(x + 0, y + 0, z + 0) >= level ? 1 : 0;
        const px = density.get(x + 1, y + 0, z + 0) >= level ? 1 : 0;
        const py = density.get(x + 0, y + 1, z + 0) >= level ? 1 : 0;
        const pz = density.get(x + 0, y + 0, z + 1) >= level ? 1 : 0;
        if (p0 + px === 1 && y > 0 && z > 0) {
          const a = getFeaturePointIndex(x + 0, y - 1, z - 1);
          const b = getFeaturePointIndex(x + 0, y - 1, z + 0);
          const c = getFeaturePointIndex(x + 0, y + 0, z + 0);
          const d = getFeaturePointIndex(x + 0, y + 0, z - 1);
          if (px < p0) {
            cells.push([a, b, c]);
            cells.push([a, c, d]);
          } else {
            cells.push([a, c, b]);
            cells.push([a, d, c]);
          }
        }
        if (p0 + py === 1 && x > 0 && z > 0) {
          const a = getFeaturePointIndex(x - 1, y + 0, z - 1);
          const b = getFeaturePointIndex(x + 0, y + 0, z - 1);
          const c = getFeaturePointIndex(x + 0, y + 0, z + 0);
          const d = getFeaturePointIndex(x - 1, y + 0, z + 0);
          if (py < p0) {
            cells.push([a, b, c]);
            cells.push([a, c, d]);
          } else {
            cells.push([a, c, b]);
            cells.push([a, d, c]);
          }
        }
        if (p0 + pz === 1 && x > 0 && y > 0) {
          const a = getFeaturePointIndex(x - 1, y - 1, z + 0);
          const b = getFeaturePointIndex(x + 0, y - 1, z + 0);
          const c = getFeaturePointIndex(x + 0, y + 0, z + 0);
          const d = getFeaturePointIndex(x - 1, y + 0, z + 0);
          if (pz > p0) {
            cells.push([a, b, c]);
            cells.push([a, c, d]);
          } else {
            cells.push([a, c, b]);
            cells.push([a, d, c]);
          }
        }
      }
    }
  }
  return {
    positions: featurePoints,
    cells: cells,
  };
}
