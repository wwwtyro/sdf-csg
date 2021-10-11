var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };
function create$5() {
  var out = new ARRAY_TYPE(9);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }
  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
function create$4() {
  var out = new ARRAY_TYPE(16);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
function invert(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
function fromRotationTranslationScale(out, q, v, s) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function create$3() {
  var out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}
function clone(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function length$1(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
function fromValues$1(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add$1(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract$1(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiply$1(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
function max$1(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
function scale$1(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
function normalize$2(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len2 = x * x + y * y + z * z;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
  }
  out[0] = a[0] * len2;
  out[1] = a[1] * len2;
  out[2] = a[2] * len2;
  return out;
}
function dot$1(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2];
  var bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function transformMat4(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
var sub$1 = subtract$1;
var mul$1 = multiply$1;
var len = length$1;
(function() {
  var vec = create$3();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
})();
function create$2() {
  var out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }
  return out;
}
function normalize$1(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len2 = x * x + y * y + z * z + w * w;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
  }
  out[0] = x * len2;
  out[1] = y * len2;
  out[2] = z * len2;
  out[3] = w * len2;
  return out;
}
(function() {
  var vec = create$2();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 4;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }
    return a;
  };
})();
function create$1() {
  var out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  out[3] = 1;
  return out;
}
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
function rotateX(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
function rotateY(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var by = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
function rotateZ(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bz = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
function slerp(out, a, b, t) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = b[0], by = b[1], bz = b[2], bw = b[3];
  var omega, cosom, sinom, scale0, scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > EPSILON) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
function fromMat3(out, m) {
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;
  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    var i = 0;
    if (m[4] > m[0])
      i = 1;
    if (m[8] > m[i * 3 + i])
      i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }
  return out;
}
var normalize = normalize$1;
(function() {
  var tmpvec3 = create$3();
  var xUnitVec3 = fromValues$1(1, 0, 0);
  var yUnitVec3 = fromValues$1(0, 1, 0);
  return function(out, a, b) {
    var dot2 = dot$1(a, b);
    if (dot2 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 1e-6)
        cross(tmpvec3, yUnitVec3, a);
      normalize$2(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot2 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot2;
      return normalize(out, out);
    }
  };
})();
(function() {
  var temp1 = create$1();
  var temp2 = create$1();
  return function(out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
})();
(function() {
  var matr = create$5();
  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize(out, fromMat3(out, matr));
  };
})();
function create() {
  var out = new ARRAY_TYPE(2);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }
  return out;
}
function fromValues(x, y) {
  var out = new ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
}
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
function length(a) {
  var x = a[0], y = a[1];
  return Math.hypot(x, y);
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
var sub = subtract;
var mul = multiply;
(function() {
  var vec = create();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 2;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }
    return a;
  };
})();
function vec3abs(out, p) {
  out[0] = Math.abs(p[0]);
  out[1] = Math.abs(p[1]);
  out[2] = Math.abs(p[2]);
  return out;
}
function vec2abs(out, p) {
  out[0] = Math.abs(p[0]);
  out[1] = Math.abs(p[1]);
  return out;
}
function clamp(n, min2, max2) {
  return Math.max(min2, Math.min(max2, n));
}
function mix(n0, n1, frac) {
  return n0 * (1 - frac) + n1 * frac;
}
const unitCube = {
  points: [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1]
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
    [6, 7]
  ]
};
function isosurfaceGenerator(density, level) {
  const width = density.shape[0];
  const height = density.shape[1];
  const depth = density.shape[2];
  const featurePoints = [];
  const featurePointIndex = {};
  function getFeaturePointIndex(x, y, z) {
    if ([x, y, z].toString() in featurePointIndex)
      return featurePointIndex[[x, y, z].toString()];
    const values = [];
    unitCube.points.forEach(function(v) {
      values.push(density.get(x + v[0], y + v[1], z + v[2]));
    });
    let p = [0, 0, 0];
    let sum = 0;
    unitCube.edges.forEach(function(e) {
      if (values[e[0]] < level && values[e[1]] < level)
        return;
      if (values[e[0]] >= level && values[e[1]] >= level)
        return;
      const dv = values[e[1]] - values[e[0]];
      const dr = (level - values[e[0]]) / dv;
      const r = [
        unitCube.points[e[1]][0] - unitCube.points[e[0]][0],
        unitCube.points[e[1]][1] - unitCube.points[e[0]][1],
        unitCube.points[e[1]][2] - unitCube.points[e[0]][2]
      ];
      const interp = [
        unitCube.points[e[0]][0] + r[0] * dr,
        unitCube.points[e[0]][1] + r[1] * dr,
        unitCube.points[e[0]][2] + r[2] * dr
      ];
      p = [p[0] + interp[0] + x, p[1] + interp[1] + y, p[2] + interp[2] + z];
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
    cells
  };
}
class SDF {
  constructor() {
    __publicField(this, "_userData", null);
    __publicField(this, "bounds", {
      min: fromValues$1(0, 0, 0),
      max: fromValues$1(0, 0, 0)
    });
  }
  normal(x, y, z) {
    const dr = 1e-3;
    const p0 = this.density(x, y, z);
    const px = this.density(x + dr, y, z);
    const py = this.density(x, y + dr, z);
    const pz = this.density(x, y, z + dr);
    const n0 = fromValues$1((px - p0) / dr, (py - p0) / dr, (pz - p0) / dr);
    return normalize$2(create$3(), n0);
  }
  generateMesh(resolution, padding) {
    let t0 = performance.now();
    const grid = this.generateGrid(resolution, padding);
    console.log(`Grid: ${Math.round(performance.now() - t0)} ms`);
    t0 = performance.now();
    const mesh = isosurfaceGenerator(grid, 0);
    console.log(`Isosurface extraction: ${Math.round(performance.now() - t0)} ms`);
    const min2 = sub$1(create$3(), this.bounds.min, [padding, padding, padding]);
    const max2 = add$1(create$3(), this.bounds.max, [padding, padding, padding]);
    const dm = sub$1(create$3(), max2, min2);
    for (const position of mesh.positions) {
      mul$1(position, position, [dm[0] / resolution[0], dm[1] / resolution[1], dm[2] / resolution[2]]);
      add$1(position, position, min2);
    }
    const normals = [];
    for (const p of mesh.positions) {
      normals.push(this.normal(p[0], p[1], p[2]));
    }
    let userdata = null;
    if (this.getUserData(0, 0, 0) !== null) {
      userdata = [];
      for (const p of mesh.positions) {
        userdata.push(this.getUserData(p[0], p[1], p[2]));
      }
    }
    return __spreadProps(__spreadValues({}, mesh), {
      normals,
      userdata
    });
  }
  generateGrid(resolution, padding) {
    const grid = new Float32Array((resolution[0] + 1) * (resolution[1] + 1) * (resolution[2] + 1));
    const min2 = sub$1(create$3(), this.bounds.min, [padding, padding, padding]);
    const max2 = add$1(create$3(), this.bounds.max, [padding, padding, padding]);
    const dx = (max2[0] - min2[0]) / resolution[0];
    const dy = (max2[1] - min2[1]) / resolution[1];
    const dz = (max2[2] - min2[2]) / resolution[2];
    for (let i = 0; i < resolution[0] + 1; i++) {
      const x = i * dx + min2[0];
      for (let j = 0; j < resolution[1] + 1; j++) {
        const y = j * dy + min2[1];
        for (let k = 0; k < resolution[2] + 1; k++) {
          const z = k * dz + min2[2];
          const index = resolution[0] * resolution[2] * j + resolution[0] * k + i;
          grid[index] = this.density(x, y, z);
        }
      }
    }
    return {
      get: (i, j, k) => grid[resolution[0] * resolution[2] * j + resolution[0] * k + i],
      shape: [resolution[0] + 1, resolution[1] + 1, resolution[2] + 1]
    };
  }
  setUserData(data) {
    this._userData = data.slice();
    return this;
  }
  getUserData(x, y, z) {
    return this._userData;
  }
  union(sdf) {
    return new Union(this, sdf);
  }
  subtract(sdf) {
    return new Subtraction(sdf, this);
  }
  intersect(sdf) {
    return new Intersection(sdf, this);
  }
  smoothUnion(sdf, smoothness) {
    return new SmoothUnion(this, sdf, smoothness);
  }
  smoothSubtract(sdf, smoothness) {
    return new SmoothSubtraction(sdf, this, smoothness);
  }
  smoothIntersect(sdf, smoothness) {
    return new SmoothIntersection(this, sdf, smoothness);
  }
  translate(x, y, z) {
    return new Transform(this, [x, y, z], create$1(), 1);
  }
  rotate(quat2) {
    return new Transform(this, [0, 0, 0], quat2, 1);
  }
  rotateX(radians) {
    return new Transform(this, [0, 0, 0], rotateX(create$1(), create$1(), radians), 1);
  }
  rotateY(radians) {
    return new Transform(this, [0, 0, 0], rotateY(create$1(), create$1(), radians), 1);
  }
  rotateZ(radians) {
    return new Transform(this, [0, 0, 0], rotateZ(create$1(), create$1(), radians), 1);
  }
  scale(amount) {
    return new Transform(this, [0, 0, 0], create$1(), amount);
  }
  round(amount) {
    return new Round(this, amount);
  }
}
class Subtraction extends SDF {
  constructor(sdf1, sdf2) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const d1 = this.sdf1.density(x, y, z);
      const d2 = this.sdf2.density(x, y, z);
      return Math.max(-d1, d2);
    });
    this.sdf1 = sdf1;
    this.sdf2 = sdf2;
    copy(this.bounds.min, sdf2.bounds.min);
    copy(this.bounds.max, sdf2.bounds.max);
  }
  getUserData(x, y, z) {
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
    const lerp = [];
    for (let i = 0; i < ud1.length; i++) {
      lerp.push(ud1[i] + frac * (ud2[i] - ud1[i]));
    }
    return lerp;
  }
}
class Union extends SDF {
  constructor(sdf1, sdf2) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const d1 = this.sdf1.density(x, y, z);
      const d2 = this.sdf2.density(x, y, z);
      return Math.min(d1, d2);
    });
    this.sdf1 = sdf1;
    this.sdf2 = sdf2;
    min(this.bounds.min, sdf1.bounds.min, sdf2.bounds.min);
    max$1(this.bounds.max, sdf1.bounds.max, sdf2.bounds.max);
  }
  getUserData(x, y, z) {
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
    const lerp = [];
    for (let i = 0; i < ud1.length; i++) {
      lerp.push(ud1[i] + frac * (ud2[i] - ud1[i]));
    }
    return lerp;
  }
}
class Intersection extends SDF {
  constructor(sdf1, sdf2) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const d1 = this.sdf1.density(x, y, z);
      const d2 = this.sdf2.density(x, y, z);
      return Math.max(d1, d2);
    });
    this.sdf1 = sdf1;
    this.sdf2 = sdf2;
    max$1(this.bounds.min, sdf1.bounds.min, sdf2.bounds.min);
    min(this.bounds.max, sdf1.bounds.max, sdf2.bounds.max);
  }
  getUserData(x, y, z) {
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
    const lerp = [];
    for (let i = 0; i < ud1.length; i++) {
      lerp.push(ud1[i] + frac * (ud2[i] - ud1[i]));
    }
    return lerp;
  }
}
class SmoothSubtraction extends SDF {
  constructor(sdf1, sdf2, smoothness) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const d1 = this.sdf1.density(x, y, z);
      const d2 = this.sdf2.density(x, y, z);
      const h = clamp(0.5 - 0.5 * (d2 + d1) / this.smoothness, 0, 1);
      return mix(d2, -d1, h) + this.smoothness * h * (1 - h);
    });
    this.sdf1 = sdf1;
    this.sdf2 = sdf2;
    this.smoothness = smoothness;
    copy(this.bounds.min, sdf2.bounds.min);
    copy(this.bounds.max, sdf2.bounds.max);
  }
  getUserData(x, y, z) {
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
    const lerp = [];
    for (let i = 0; i < ud1.length; i++) {
      lerp.push(ud1[i] + frac * (ud2[i] - ud1[i]));
    }
    return lerp;
  }
}
class SmoothUnion extends SDF {
  constructor(sdf1, sdf2, smoothness) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const d1 = this.sdf1.density(x, y, z);
      const d2 = this.sdf2.density(x, y, z);
      const h = clamp(0.5 + 0.5 * (d2 - d1) / this.smoothness, 0, 1);
      return mix(d2, d1, h) - this.smoothness * h * (1 - h);
    });
    this.sdf1 = sdf1;
    this.sdf2 = sdf2;
    this.smoothness = smoothness;
    min(this.bounds.min, sdf1.bounds.min, sdf2.bounds.min);
    max$1(this.bounds.max, sdf1.bounds.max, sdf2.bounds.max);
  }
  getUserData(x, y, z) {
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
    const lerp = [];
    for (let i = 0; i < ud1.length; i++) {
      lerp.push(ud1[i] + frac * (ud2[i] - ud1[i]));
    }
    return lerp;
  }
}
class SmoothIntersection extends SDF {
  constructor(sdf1, sdf2, smoothness) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const d1 = this.sdf1.density(x, y, z);
      const d2 = this.sdf2.density(x, y, z);
      const h = clamp(0.5 - 0.5 * (d2 - d1) / this.smoothness, 0, 1);
      return mix(d2, d1, h) + this.smoothness * h * (1 - h);
    });
    this.sdf1 = sdf1;
    this.sdf2 = sdf2;
    this.smoothness = smoothness;
    max$1(this.bounds.min, sdf1.bounds.min, sdf2.bounds.min);
    min(this.bounds.max, sdf1.bounds.max, sdf2.bounds.max);
  }
  getUserData(x, y, z) {
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
    const lerp = [];
    for (let i = 0; i < ud1.length; i++) {
      lerp.push(ud1[i] + frac * (ud2[i] - ud1[i]));
    }
    return lerp;
  }
}
class Transform extends SDF {
  constructor(sdf, translation, rotation, scale2) {
    super();
    __publicField(this, "matrix");
    __publicField(this, "density", (x, y, z) => {
      const point = fromValues$1(x, y, z);
      transformMat4(point, point, this.matrix);
      return this.sdf.density(point[0], point[1], point[2]);
    });
    this.sdf = sdf;
    this.matrix = fromRotationTranslationScale(create$4(), rotation, translation, fromValues$1(scale2, scale2, scale2));
    const bmin = clone(this.sdf.bounds.min);
    const bmax = clone(this.sdf.bounds.max);
    const db = subtract$1(create$3(), bmax, bmin);
    const t0 = add$1(create$3(), bmin, [db[0], 0, 0]);
    const t1 = add$1(create$3(), bmin, [db[0], db[1], 0]);
    const t2 = add$1(create$3(), bmin, [0, db[1], 0]);
    const t3 = sub$1(create$3(), bmax, [db[0], 0, 0]);
    const t4 = sub$1(create$3(), bmax, [db[0], db[1], 0]);
    const t5 = sub$1(create$3(), bmax, [0, db[1], 0]);
    transformMat4(bmin, bmin, this.matrix);
    transformMat4(bmax, bmax, this.matrix);
    transformMat4(t0, t0, this.matrix);
    transformMat4(t1, t1, this.matrix);
    transformMat4(t2, t2, this.matrix);
    transformMat4(t3, t3, this.matrix);
    transformMat4(t4, t4, this.matrix);
    transformMat4(t5, t5, this.matrix);
    min(this.bounds.min, bmin, bmax);
    min(this.bounds.min, this.bounds.min, t0);
    min(this.bounds.min, this.bounds.min, t1);
    min(this.bounds.min, this.bounds.min, t2);
    min(this.bounds.min, this.bounds.min, t3);
    min(this.bounds.min, this.bounds.min, t4);
    min(this.bounds.min, this.bounds.min, t5);
    max$1(this.bounds.max, bmin, bmax);
    max$1(this.bounds.max, this.bounds.max, t0);
    max$1(this.bounds.max, this.bounds.max, t1);
    max$1(this.bounds.max, this.bounds.max, t2);
    max$1(this.bounds.max, this.bounds.max, t3);
    max$1(this.bounds.max, this.bounds.max, t4);
    max$1(this.bounds.max, this.bounds.max, t5);
    invert(this.matrix, this.matrix);
  }
  getUserData(x, y, z) {
    if (this._userData !== null) {
      return this._userData;
    }
    const p = transformMat4(create$3(), [x, y, z], this.matrix);
    return this.sdf.getUserData(p[0], p[1], p[2]);
  }
}
class Round extends SDF {
  constructor(sdf, radius) {
    super();
    __publicField(this, "density", (x, y, z) => {
      return this.sdf.density(x, y, z) - this.radius;
    });
    this.sdf = sdf;
    this.radius = radius;
    sub$1(this.bounds.min, sdf.bounds.min, [radius, radius, radius]);
    add$1(this.bounds.max, sdf.bounds.max, [radius, radius, radius]);
  }
  getUserData(x, y, z) {
    if (this._userData !== null) {
      return this._userData;
    }
    return this.sdf.getUserData(x, y, z);
  }
}
class Box extends SDF {
  constructor(width, height, depth) {
    super();
    __publicField(this, "radii");
    __publicField(this, "density", (x, y, z) => {
      const p = fromValues$1(x, y, z);
      const absp = vec3abs(create$3(), p);
      const q = subtract$1(create$3(), absp, this.radii);
      const posq = max$1(create$3(), q, fromValues$1(0, 0, 0));
      return length$1(posq) + Math.min(Math.max(q[0], Math.max(q[1], q[2])), 0);
    });
    this.radii = fromValues$1(width, height, depth);
    negate(this.bounds.min, this.radii);
    copy(this.bounds.max, this.radii);
  }
}
class Sphere extends SDF {
  constructor(radius) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const p = fromValues$1(x, y, z);
      return length$1(p) - this.radius;
    });
    this.radius = radius;
    negate(this.bounds.min, [this.radius, this.radius, this.radius]);
    set(this.bounds.max, this.radius, this.radius, this.radius);
  }
}
class BoxFrame extends SDF {
  constructor(width, height, depth, edge) {
    super();
    __publicField(this, "radii");
    __publicField(this, "density", (x, y, z) => {
      const p = subtract$1(create$3(), vec3abs(create$3(), fromValues$1(x, y, z)), this.radii);
      const e = fromValues$1(this.edge, this.edge, this.edge);
      const q = sub$1(create$3(), vec3abs(create$3(), add$1(create$3(), p, e)), e);
      return Math.min(Math.min(length$1(max$1(create$3(), [p[0], q[1], q[2]], [0, 0, 0])) + Math.min(Math.max(p[0], Math.max(q[1], q[2])), 0), length$1(max$1(create$3(), [q[0], p[1], q[2]], [0, 0, 0])) + Math.min(Math.max(q[0], Math.max(p[1], q[2])), 0)), length$1(max$1(create$3(), [q[0], q[1], p[2]], [0, 0, 0])) + Math.min(Math.max(q[0], Math.max(q[1], p[2])), 0));
    });
    this.edge = edge;
    this.radii = fromValues$1(width, height, depth);
    negate(this.bounds.min, this.radii);
    copy(this.bounds.max, this.radii);
  }
}
class Torus extends SDF {
  constructor(majorRadius, minorRadius) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const q = fromValues(length(fromValues(x, y)) - this.majorRadius, z);
      return length(q) - this.minorRadius;
    });
    this.majorRadius = majorRadius;
    this.minorRadius = minorRadius;
    set(this.bounds.min, -majorRadius - minorRadius, -majorRadius - minorRadius, -minorRadius);
    set(this.bounds.max, majorRadius + minorRadius, majorRadius + minorRadius, +minorRadius);
  }
}
class CappedTorus extends SDF {
  constructor(majorRadius, minorRadius, angle) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const sc = fromValues(Math.sin(this.angle), Math.cos(this.angle));
      x = Math.abs(x);
      const k = sc[1] * x > sc[0] * y ? dot([x, y], sc) : length([x, y]);
      const p = fromValues$1(x, y, z);
      return Math.sqrt(dot$1(p, p) + this.majorRadius * this.majorRadius - 2 * this.majorRadius * k) - this.minorRadius;
    });
    this.majorRadius = majorRadius;
    this.minorRadius = minorRadius;
    this.angle = angle;
    set(this.bounds.min, -majorRadius - minorRadius, -majorRadius - minorRadius, -minorRadius);
    set(this.bounds.max, majorRadius + minorRadius, majorRadius + minorRadius, +minorRadius);
  }
}
class Link extends SDF {
  constructor(majorRadius, minorRadius, length2) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const q = fromValues$1(x, Math.max(Math.abs(y) - this.length, 0), z);
      return length(fromValues(length([q[0], q[1]]) - this.majorRadius, q[2])) - this.minorRadius;
    });
    this.majorRadius = majorRadius;
    this.minorRadius = minorRadius;
    this.length = length2;
    set(this.bounds.min, -majorRadius - minorRadius, -majorRadius - minorRadius - length2, -minorRadius);
    set(this.bounds.max, majorRadius + minorRadius, majorRadius + minorRadius + length2, +minorRadius);
  }
}
class Cone extends SDF {
  constructor(angle, height) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const c = [Math.sin(this.angle), Math.cos(this.angle)];
      const q = scale(create(), fromValues(c[0] / c[1], -1), this.height);
      const w = fromValues(length([x, z]), y);
      const a = sub(create(), w, scale(create(), q, clamp(dot(w, q) / dot(q, q), 0, 1)));
      const b = sub(create(), w, mul(create(), q, fromValues(clamp(w[0] / q[0], 0, 1), 1)));
      const k = Math.sign(q[1]);
      const d = Math.min(dot(a, a), dot(b, b));
      const s = Math.max(k * (w[0] * q[1] - w[1] * q[0]), k * (w[1] - q[1]));
      return Math.sqrt(d) * Math.sign(s);
    });
    this.angle = angle;
    this.height = height;
    const sigma = height * Math.tan(angle);
    set(this.bounds.min, -sigma, -height, -sigma);
    set(this.bounds.max, sigma, 0, sigma);
  }
}
class HexagonalPrism extends SDF {
  constructor(radius, length2) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const k = fromValues$1(-0.8660254, 0.5, 0.57735);
      const p = fromValues$1(x, y, z);
      vec3abs(p, p);
      const q = scale(create(), [k[0], k[1]], 2 * Math.min(dot([k[0], k[1]], [p[0], p[1]]), 0));
      p[0] -= q[0];
      p[1] -= q[1];
      const d = fromValues(length(sub(create(), [p[0], p[1]], fromValues(clamp(p[0], -k[2] * this.radius, k[2] * this.radius), this.radius))) * Math.sign(p[1] - this.radius), p[2] - this.length);
      return Math.min(Math.max(d[0], d[1]), 0) + length(max(create(), d, [0, 0]));
    });
    this.radius = radius;
    this.length = length2;
    const h = radius / Math.cos(Math.PI / 6);
    set(this.bounds.min, -h, -radius, -length2);
    set(this.bounds.max, h, radius, length2);
  }
}
class Capsule extends SDF {
  constructor(pointA, pointB, radius) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const p = fromValues$1(x, y, z);
      const pa = sub$1(create$3(), p, this.pointA);
      const ba = sub$1(create$3(), this.pointB, this.pointA);
      const h = clamp(dot$1(pa, ba) / dot$1(ba, ba), 0, 1);
      return length$1(sub$1(create$3(), pa, scale$1(create$3(), ba, h))) - this.radius;
    });
    this.pointA = pointA;
    this.pointB = pointB;
    this.radius = radius;
    const min$1 = min(create$3(), pointA, pointB);
    const max2 = max$1(create$3(), pointA, pointB);
    sub$1(this.bounds.min, min$1, [radius, radius, radius]);
    add$1(this.bounds.max, max2, [radius, radius, radius]);
  }
}
class CappedCylinder extends SDF {
  constructor(length2, radius) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const d = sub(create(), vec2abs(create(), fromValues(length([x, z]), y)), fromValues(this.radius, this.length));
      return Math.min(Math.max(d[0], d[1]), 0) + length(max(create(), d, [0, 0]));
    });
    this.length = length2;
    this.radius = radius;
    set(this.bounds.min, -radius, -length2, -radius);
    set(this.bounds.max, radius, length2, radius);
  }
}
class CappedCone extends SDF {
  constructor(length2, radius1, radius2) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const q = fromValues(length([x, z]), y);
      const k1 = fromValues(this.radius2, this.length);
      const k2 = fromValues(this.radius2 - this.radius1, 2 * this.length);
      const ca = fromValues(q[0] - Math.min(q[0], q[1] < 0 ? this.radius1 : this.radius2), Math.abs(q[1]) - this.length);
      const qk1 = sub(create(), k1, q);
      const cb = add(create(), sub(create(), q, k1), scale(create(), k2, clamp(dot(qk1, k2) / dot(k2, k2), 0, 1)));
      const s = cb[0] < 0 && ca[1] < 0 ? -1 : 1;
      return s * Math.sqrt(Math.min(dot(ca, ca), dot(cb, cb)));
    });
    this.length = length2;
    this.radius1 = radius1;
    this.radius2 = radius2;
    const r = Math.max(radius1, radius2);
    set(this.bounds.min, -r, -length2, -r);
    set(this.bounds.max, r, length2, r);
  }
}
class SolidAngle extends SDF {
  constructor(angle, radius) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const c = fromValues(Math.sin(this.angle), Math.cos(this.angle));
      const q = fromValues(length([x, z]), y);
      const l = length(q) - this.radius;
      const m = length(sub(create(), q, scale(create(), c, clamp(dot(q, c), 0, this.radius))));
      return Math.max(l, m * Math.sign(c[1] * q[0] - c[0] * q[1]));
    });
    this.angle = angle;
    this.radius = radius;
    const h = radius * Math.sin(angle);
    set(this.bounds.min, -h, 0, -h);
    set(this.bounds.max, h, radius, h);
  }
}
class TriangularPrism_ extends SDF {
  constructor(radius, length2) {
    super();
    __publicField(this, "density", (x, y, z) => {
      const q = vec3abs(create$3(), [x, y, z]);
      return Math.max(q[2] - this.length, Math.max(q[0] * 0.866025 + y * 0.5, -y) - this.radius * 0.5);
    });
    this.radius = radius;
    this.length = length2;
    const h0 = 0.5 * radius / Math.cos(Math.PI / 3);
    const h1 = 0.5 * radius * Math.tan(Math.PI / 3);
    set(this.bounds.min, -h1, -0.5 * radius, -length2);
    set(this.bounds.max, h1, h0, length2);
  }
}
export { Box, BoxFrame, CappedCone, CappedCylinder, CappedTorus, Capsule, Cone, HexagonalPrism, Link, SolidAngle, Sphere, Torus, TriangularPrism_ };
