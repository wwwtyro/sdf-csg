interface Grid {
    get(x: number, y: number, z: number): number;
    shape: number[];
}
export declare function isosurfaceGenerator(density: Grid, level: number): {
    positions: number[][];
    cells: number[][];
};
export {};
//# sourceMappingURL=isosurface.d.ts.map