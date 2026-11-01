// Torn-edged paint that grows outward from a rectangle: a distance field to the rectangle,
// pushed out by noise sampled along the direction from its centre, which gives the ragged streaks.
const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform float uHeight;
uniform float uScale;
uniform vec4 uRect;
uniform float uSpread;
uniform float uTime;
uniform vec3 uPaint;
out vec4 color;

float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(cell), hash(cell + vec2(1, 0)), f.x), mix(hash(cell + vec2(0, 1)), hash(cell + vec2(1, 1)), f.x), f.y);
}
float layered(vec2 p) {
  float sum = 0.0;
  float weight = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += weight * noise(p);
    p = p * 2.1 + 11.3;
    weight *= 0.5;
  }
  return sum;
}

void main() {
  vec2 point = vec2(gl_FragCoord.x, uHeight * uScale - gl_FragCoord.y) / uScale;
  vec2 q = point - uRect.xy;
  vec2 outside = abs(q) - uRect.zw;
  float dist = length(max(outside, 0.0)) + min(max(outside.x, outside.y), 0.0);
  vec2 nearest = clamp(q, -uRect.zw, uRect.zw);
  vec2 dir = normalize(nearest / uRect.zw + (q - nearest) / max(uRect.z, uRect.w));

  // Big slow lobes set the shape; finer noise and bristles tear the edge, capped so it stays ragged, not huge.
  float brush = min(uSpread, 120.0);
  float lobes = layered(dir * 1.6 + vec2(uTime * 0.03, uTime * 0.02));
  float tears = layered(dir * 9.0 + 3.1);
  float bristles = noise(dir * 90.0 + 9.7);
  float edge = uSpread * (0.55 + 0.75 * lobes) + brush * (0.7 * tears + 0.12 * bristles) - dist;

  float alpha = smoothstep(-1.2, 1.2, edge);
  float strand = noise(dir * 260.0 + dist * 0.003);
  alpha *= smoothstep(strand - 0.25, strand + 0.25, clamp(edge / max(brush * 0.2, 1.0), 0.0, 1.0) * 1.6);
  color = vec4(uPaint * alpha, alpha);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export type TornPaint = {
  resize: () => void;
  draw: (rect: { x: number; y: number; width: number; height: number }, spread: number, time: number) => void;
  clear: () => void;
  dispose: () => void;
};

/** Returns null without WebGL2: the frame's own zoom still covers the screen, just with no torn edge. */
export function createTornPaint(canvas: HTMLCanvasElement, paint: [number, number, number]): TornPaint | null {
  const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false });
  if (!gl) return null;
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const height = gl.getUniformLocation(program, "uHeight");
  const scale = gl.getUniformLocation(program, "uScale");
  const rectangle = gl.getUniformLocation(program, "uRect");
  const spreadAt = gl.getUniformLocation(program, "uSpread");
  const timeAt = gl.getUniformLocation(program, "uTime");
  gl.uniform3fv(gl.getUniformLocation(program, "uPaint"), paint);

  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();

  return {
    resize,
    draw: (rect, spread, time) => {
      gl.uniform1f(height, canvas.clientHeight);
      gl.uniform1f(scale, dpr);
      gl.uniform4f(rectangle, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width / 2, rect.height / 2);
      gl.uniform1f(spreadAt, spread);
      gl.uniform1f(timeAt, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    clear: () => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    dispose: () => {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    },
  };
}
