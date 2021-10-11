import { SDF } from "./sdf";
export declare class Box extends SDF {
    private radii;
    constructor(width: number, height: number, depth: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class Sphere extends SDF {
    private radius;
    constructor(radius: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class BoxFrame extends SDF {
    private edge;
    private radii;
    constructor(width: number, height: number, depth: number, edge: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class Torus extends SDF {
    private majorRadius;
    private minorRadius;
    constructor(majorRadius: number, minorRadius: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class CappedTorus extends SDF {
    private majorRadius;
    private minorRadius;
    private angle;
    constructor(majorRadius: number, minorRadius: number, angle: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class Link extends SDF {
    private majorRadius;
    private minorRadius;
    private length;
    constructor(majorRadius: number, minorRadius: number, length: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class Cone extends SDF {
    private angle;
    private height;
    constructor(angle: number, height: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class HexagonalPrism extends SDF {
    private radius;
    private length;
    constructor(radius: number, length: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class Capsule extends SDF {
    private pointA;
    private pointB;
    private radius;
    constructor(pointA: number[], pointB: number[], radius: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class CappedCylinder extends SDF {
    private length;
    private radius;
    constructor(length: number, radius: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class CappedCone extends SDF {
    private length;
    private radius1;
    private radius2;
    constructor(length: number, radius1: number, radius2: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class SolidAngle extends SDF {
    private angle;
    private radius;
    constructor(angle: number, radius: number);
    density: (x: number, y: number, z: number) => number;
}
export declare class TriangularPrism_ extends SDF {
    private radius;
    private length;
    constructor(radius: number, length: number);
    density: (x: number, y: number, z: number) => number;
}
//# sourceMappingURL=primitives.d.ts.map