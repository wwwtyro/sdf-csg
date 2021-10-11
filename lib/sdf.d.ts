import { vec3 } from "gl-matrix";
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
export declare abstract class SDF {
    protected _userData: number[] | null;
    bounds: Bounds;
    abstract density(x: number, y: number, z: number): number;
    normal(x: number, y: number, z: number): vec3;
    generateMesh(resolution: number[], padding: number): Mesh;
    private generateGrid;
    setUserData(data: number[]): this;
    getUserData(x: number, y: number, z: number): number[] | null;
    union(sdf: SDF): Union;
    subtract(sdf: SDF): Subtraction;
    intersect(sdf: SDF): Intersection;
    smoothUnion(sdf: SDF, smoothness: number): SmoothUnion;
    smoothSubtract(sdf: SDF, smoothness: number): SmoothSubtraction;
    smoothIntersect(sdf: SDF, smoothness: number): SmoothIntersection;
    translate(x: number, y: number, z: number): Transform;
    rotate(quat: number[]): Transform;
    rotateX(radians: number): Transform;
    rotateY(radians: number): Transform;
    rotateZ(radians: number): Transform;
    scale(amount: number): Transform;
    round(amount: number): Round;
}
export declare class Subtraction extends SDF {
    private sdf1;
    private sdf2;
    constructor(sdf1: SDF, sdf2: SDF);
    density: (x: number, y: number, z: number) => number;
    getUserData(x: number, y: number, z: number): number[] | null;
}
export declare class Union extends SDF {
    private sdf1;
    private sdf2;
    constructor(sdf1: SDF, sdf2: SDF);
    density: (x: number, y: number, z: number) => number;
    getUserData(x: number, y: number, z: number): number[] | null;
}
export declare class Intersection extends SDF {
    private sdf1;
    private sdf2;
    constructor(sdf1: SDF, sdf2: SDF);
    density: (x: number, y: number, z: number) => number;
    getUserData(x: number, y: number, z: number): number[] | null;
}
export declare class SmoothSubtraction extends SDF {
    private sdf1;
    private sdf2;
    private smoothness;
    constructor(sdf1: SDF, sdf2: SDF, smoothness: number);
    density: (x: number, y: number, z: number) => number;
    getUserData(x: number, y: number, z: number): number[] | null;
}
export declare class SmoothUnion extends SDF {
    private sdf1;
    private sdf2;
    private smoothness;
    constructor(sdf1: SDF, sdf2: SDF, smoothness: number);
    density: (x: number, y: number, z: number) => number;
    getUserData(x: number, y: number, z: number): number[] | null;
}
export declare class SmoothIntersection extends SDF {
    private sdf1;
    private sdf2;
    private smoothness;
    constructor(sdf1: SDF, sdf2: SDF, smoothness: number);
    density: (x: number, y: number, z: number) => number;
    getUserData(x: number, y: number, z: number): number[] | null;
}
export declare class Transform extends SDF {
    private sdf;
    private matrix;
    constructor(sdf: SDF, translation: number[], rotation: number[], scale: number);
    density: (x: number, y: number, z: number) => number;
    getUserData(x: number, y: number, z: number): number[] | null;
}
export declare class Round extends SDF {
    private sdf;
    private radius;
    constructor(sdf: SDF, radius: number);
    density: (x: number, y: number, z: number) => number;
    getUserData(x: number, y: number, z: number): number[] | null;
}
export {};
//# sourceMappingURL=sdf.d.ts.map