const VERT_SRC = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAG_SRC = `
precision highp float;

uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_fromAspect;
uniform float u_toAspect;
uniform float u_scale;
uniform float u_direction;

varying vec2 v_uv;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x   + h.x  * x0.y;
  g.yz = a0.yz * x12.xz  + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
  float fbm(vec2 v) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(v);
      v *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

vec2 coverUV(vec2 uv, float imgAspect) {
  float canvasAspect = u_resolution.x / u_resolution.y;
  vec2 scale = (canvasAspect > imgAspect)
    ? vec2(1.0, imgAspect / canvasAspect)
    : vec2(canvasAspect / imgAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  float edge = 0.15;
  float adjustedProgress = u_progress * (1.0 + 2.0 * edge) - edge;
  float noise = fbm(v_uv * u_scale + vec2(0, u_progress * u_direction)) * .5 + .5;
  noise = smoothstep(0., 2., length(texture2D(u_to, coverUV(v_uv, u_fromAspect)).rgb) + noise);
  float mixFactor = 1.0 - smoothstep(adjustedProgress - edge, adjustedProgress + edge, noise);
  float distort_in = noise * u_progress;
  float distort_out = noise * (1.0 - u_progress);

  vec2 fromUV = coverUV(v_uv + vec2(0, distort_in * 0.5 * u_direction), u_fromAspect);
  vec2 toUV   = coverUV(v_uv + vec2(0, distort_out * -0.25 * u_direction), u_toAspect);

  vec4 fromColor = texture2D(u_from, fromUV);
  vec4 toColor   = texture2D(u_to,toUV);

  gl_FragColor = mix(fromColor, toColor, mixFactor);
}
`

interface UniformLocations {
  from: WebGLUniformLocation | null
  to: WebGLUniformLocation | null
  progress: WebGLUniformLocation | null
  resolution: WebGLUniformLocation | null
  fromAspect: WebGLUniformLocation | null
  toAspect: WebGLUniformLocation | null
  scale: WebGLUniformLocation | null
  direction: WebGLUniformLocation | null
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error("Failed to create WebGL shader")
  }

  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const err = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader compile error: ${err ?? "Unknown error"}`)
  }

  return shader
}

function createProgram(
  gl: WebGLRenderingContext,
  vertSrc: string,
  fragSrc: string
): WebGLProgram {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc)
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc)
  const prog = gl.createProgram()
  if (!prog) {
    throw new Error("Failed to create WebGL program")
  }

  gl.attachShader(prog, vert)
  gl.attachShader(prog, frag)
  gl.linkProgram(prog)

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const err = gl.getProgramInfoLog(prog)
    throw new Error(`Program link error: ${err ?? "Unknown error"}`)
  }

  return prog
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = (event: string | Event) => reject(event)
    img.src = url
  })
}

function uploadTexture(gl: WebGLRenderingContext, img: HTMLImageElement): WebGLTexture {
  const tex = gl.createTexture()
  if (!tex) {
    throw new Error("Failed to create WebGL texture")
  }

  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  return tex
}

export class MorphRenderer {
  private _canvas: HTMLCanvasElement
  private _gl: WebGLRenderingContext | null = null
  private _prog: WebGLProgram | null = null
  private _uniforms: UniformLocations | null = null
  private _textures: WebGLTexture[] = []
  private _aspects: number[] = []
  private _fromIndex: number = 0
  private _toIndex: number = 0
  private _progress: number = 1.0
  private _transitionStart: number | null = null
  private _transitionDuration: number = 1500
  private _direction: 1 | -1 = 1
  private _rafId: number | null = null
  private _ro: ResizeObserver | null = null
  private _ready: boolean = false
  private _destroyed: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas
  }

  public async init(imageUrls: string[]): Promise<void> {
    const gl = this._canvas.getContext("webgl")
    if (!gl) {
      throw new Error("WebGL not supported")
    }
    this._gl = gl

    this._ro = new ResizeObserver(() => this._resize())
    this._ro.observe(this._canvas)

    const prog = createProgram(gl, VERT_SRC, FRAG_SRC)
    this._prog = prog
    gl.useProgram(prog)

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buf = gl.createBuffer()
    if (!buf) {
      throw new Error("Failed to create WebGL buffer")
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(prog, "a_position")
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    this._uniforms = {
      from: gl.getUniformLocation(prog, "u_from"),
      to: gl.getUniformLocation(prog, "u_to"),
      progress: gl.getUniformLocation(prog, "u_progress"),
      resolution: gl.getUniformLocation(prog, "u_resolution"),
      fromAspect: gl.getUniformLocation(prog, "u_fromAspect"),
      toAspect: gl.getUniformLocation(prog, "u_toAspect"),
      scale: gl.getUniformLocation(prog, "u_scale"),
      direction: gl.getUniformLocation(prog, "u_direction"),
    }

    const images = await Promise.all(imageUrls.map(loadImage))
    this._textures = images.map((img: HTMLImageElement) => uploadTexture(gl, img))
    this._aspects = images.map(
      (img: HTMLImageElement) => img.naturalWidth / img.naturalHeight
    )

    this._ready = true
    this._loop()
  }

  public transition(
    fromIndex: number,
    toIndex: number,
    duration: number = this._transitionDuration
  ): void {
    if (!this._ready || fromIndex === toIndex) return
    this._fromIndex = fromIndex
    this._toIndex = toIndex
    this._progress = 0.0
    this._transitionStart = performance.now()
    this._transitionDuration = duration
    this._direction = toIndex > fromIndex ? 1 : -1
  }

  private _resize(): void {
    const gl = this._gl
    if (!gl) return
    const dpr = window.devicePixelRatio || 1
    const w = Math.round(this._canvas.clientWidth * dpr)
    const h = Math.round(this._canvas.clientHeight * dpr)
    if (w === 0 || h === 0) return
    this._canvas.width = w
    this._canvas.height = h
    gl.viewport(0, 0, w, h)
  }

  private _loop(): void {
    if (this._destroyed) return
    this._render()
    this._rafId = requestAnimationFrame(() => this._loop())
  }

  private _render(): void {
    const gl = this._gl
    const uniforms = this._uniforms
    if (!gl || !uniforms || !this._ready) return

    if (this._transitionStart !== null && this._progress < 1.0) {
      const elapsed = performance.now() - this._transitionStart
      const t = Math.min(elapsed / this._transitionDuration, 1.0)
      this._progress = t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2
    }

    const fromTex = this._textures[this._fromIndex] ?? null
    const toTex = this._textures[this._toIndex] ?? null
    const fromAspect = this._aspects[this._fromIndex] ?? 1
    const toAspect = this._aspects[this._toIndex] ?? 1

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, fromTex)
    gl.uniform1i(uniforms.from, 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, toTex)
    gl.uniform1i(uniforms.to, 1)

    gl.uniform1f(uniforms.progress, this._progress)
    gl.uniform2f(uniforms.resolution, this._canvas.width, this._canvas.height)
    gl.uniform1f(uniforms.fromAspect, fromAspect)
    gl.uniform1f(uniforms.toAspect, toAspect)
    gl.uniform1f(uniforms.scale, 3.5)
    gl.uniform1f(uniforms.direction, this._direction)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  public destroy(): void {
    this._destroyed = true
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId)
    }
    this._ro?.disconnect()
    if (this._gl) {
      this._textures.forEach((t: WebGLTexture) => this._gl?.deleteTexture(t))
      if (this._prog) {
        this._gl.deleteProgram(this._prog)
      }
    }
  }
}
