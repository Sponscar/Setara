"use client"

/**
 * Nimbus UI · Liquid Navbar — "Waterline"
 * Adapted for SETARA Platform (Warm Liquid Amber & Gold theme)
 * A pill of water. The active drop stretches toward the item you pick, splits into
 * droplets on long jumps and merges back with a ripple. The cursor lifts a meniscus,
 * every tap sends a wave along the pill, and each icon plays its own little scene.
 * Water is drawn by a tiny WebGL shader (only inside the pill, paused off-screen);
 * without WebGL it falls back to a CSS drop.
 */

import * as React from "react"

export type NimbusFx = "plane" | "drop" | "spin" | "glow" | "wave" | "pop" | "none"

export type LiquidNavItem = {
  label: string
  href?: string
  id?: string
  icon?: React.ReactNode
  /** the little scene the icon plays when tapped */
  fx?: NimbusFx
}

export type LiquidNavbarProps = {
  items?: LiquidNavItem[]
  defaultActive?: number
  active?: number
  onChange?: (index: number, item: LiquidNavItem) => void
  /** "light" water for bright backgrounds, "dark" for dark ones */
  tone?: "light" | "dark"
  /** icons only */
  compact?: boolean
  /** soft synthesized "plip" on tap (no audio files) */
  sound?: boolean
  className?: string
  style?: React.CSSProperties
}

/* ---------- icons ---------- */
const I = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)
export const NimbusIcons = {
  home: I(<><path d="M3.5 11.2 12 4l8.5 7.2" /><path d="M6 9.6V20h12V9.6" /><path className="nv-door" d="M10 20v-5h4v5Z" /></>),
  globe: I(<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17" /></>),
  plane: I(<path d="M21 12.2 3.6 5.4l2.7 6.8-2.7 6.4L21 12.2Zm-14.7 0H13" />),
  drop: I(<path d="M12 3.5s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5Z" />),
  user: I(<><circle cx="12" cy="8.5" r="3.8" /><path d="M4.8 20c1.2-3.4 4-5 7.2-5s6 1.6 7.2 5" /></>),
  news: I(<><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></>),
  community: I(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  info: I(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>),
}

const DEFAULT_ITEMS: LiquidNavItem[] = [
  { label: "Home", icon: NimbusIcons.home, fx: "glow" },
  { label: "Explore", icon: NimbusIcons.globe, fx: "spin" },
  { label: "Flights", icon: NimbusIcons.plane, fx: "plane" },
  { label: "Weather", icon: NimbusIcons.drop, fx: "drop" },
  { label: "Profile", icon: NimbusIcons.user, fx: "wave" },
]

const PAD = 14 // canvas bleed around the pill, for shadows and ripples

/* ---------- styles (SETARA Orange & Amber Brand Palette) ---------- */
const NIMBUS_CSS = `
.nimbus-nav{
  --n-tint: rgba(255, 255, 255, 0.75);
  --n-fg: #0F172A;
  --n-fg-soft: rgba(51, 65, 85, 0.8);
  --n-rim: rgba(249, 115, 22, 0.35);
  --n-brand: #EA580C;
  --n-amber: #F59E0B;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 999px;
  isolation: isolate;
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.nimbus-nav[data-tone="dark"]{
  --n-tint: rgba(6, 9, 17, 0.7);
  --n-fg: #FFFFFF;
  --n-fg-soft: rgba(203, 213, 225, 0.75);
  --n-rim: rgba(255, 255, 255, 0.08);
  --n-brand: #FB923C;
  --n-amber: #FBBF24;
}
.nimbus-glass{
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -2;
  overflow: hidden;
  background: var(--n-tint);
  -webkit-backdrop-filter: blur(14px) saturate(1.3) brightness(1.05);
  backdrop-filter: blur(14px) saturate(1.3) brightness(1.05);
  box-shadow: inset 0 1px 1px var(--n-rim), inset 0 0 0 1px rgba(249, 115, 22, 0.15), 0 10px 25px -8px rgba(234, 88, 12, 0.15), 0 2px 6px rgba(0, 0, 0, 0.05);
}
.nimbus-nav[data-tone="dark"] .nimbus-glass{
  background: var(--n-tint);
  -webkit-backdrop-filter: blur(16px) saturate(1.1) brightness(0.9);
  backdrop-filter: blur(16px) saturate(1.1) brightness(0.9);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 25px -8px rgba(0, 0, 0, 0.7);
}
.nimbus-nav[data-refract="on"] .nimbus-glass{
  -webkit-backdrop-filter: url(#nimbus-refract) blur(3px) saturate(1.3);
  backdrop-filter: url(#nimbus-refract) blur(3px) saturate(1.3);
}
.nimbus-water{
  position: absolute;
  left: ${-PAD}px;
  top: ${-PAD}px;
  z-index: -1;
  pointer-events: none;
}
/* Hilangkan efek liquid 3D yang terang/putih di night mode agar gelap serasi */
.nimbus-nav[data-tone="dark"] .nimbus-water{
  display: none !important;
}
.nimbus-nav[data-gl="off"] .nimbus-water{
  display: none;
}
.nimbus-drop{
  display: none;
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  border-radius: 999px;
  z-index: -1;
  pointer-events: none;
  will-change: transform, width;
  background: radial-gradient(120% 140% at 30% 0%, rgba(254, 215, 170, 0.7), rgba(249, 115, 22, 0.22) 65%), rgba(255, 255, 255, 0.55);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -2px 6px rgba(234, 88, 12, 0.3), inset 0 0 0 1px rgba(249, 115, 22, 0.3), 0 4px 14px -4px rgba(234, 88, 12, 0.4);
}
.nimbus-nav[data-gl="off"] .nimbus-drop{
  display: block;
}
/* Di night mode, aktifkan drop indikator gelap elegan tanpa efek liquid gelatin putih */
.nimbus-nav[data-tone="dark"] .nimbus-drop{
  display: block !important;
  background: rgba(249, 115, 22, 0.16);
  border: 1px solid rgba(249, 115, 22, 0.32);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 2px 12px -2px rgba(234, 88, 12, 0.35);
}
.nimbus-item{
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--n-fg-soft);
  font-family: inherit;
  font-weight: 600;
  font-size: 13px;
  line-height: 1;
  letter-spacing: -0.01em;
  text-decoration: none;
  cursor: pointer;
  transition: color .25s ease, transform .2s ease;
}
.nimbus-item:hover{
  color: var(--n-fg);
}
.nimbus-item[aria-current="page"]{
  color: var(--n-brand);
  font-weight: 700;
}
.nimbus-item:focus-visible{
  outline: 2px solid var(--n-brand);
  outline-offset: 2px;
}
.nv-ico{
  position: relative;
  display: inline-flex;
  flex: none;
}
.nv-ico svg{
  transition: transform .45s cubic-bezier(.3,1.6,.5,1);
}
.nimbus-item[aria-current="page"] .nv-ico svg{
  transform: translateY(-1px) scale(1.08);
}
.nv-door{
  fill: transparent;
}
.nv-ico[data-fx="pop"] svg{animation:nvPop .5s cubic-bezier(.3,1.6,.5,1) both}
@keyframes nvPop{0%{transform:scale(.72)}60%{transform:scale(1.2)}100%{transform:translateY(-1px) scale(1.08)}}
.nv-ico[data-fx="plane"] svg{animation:nvPlane 1.15s cubic-bezier(.55,0,.3,1) both}
@keyframes nvPlane{0%{transform:none}12%{transform:translate(-3px,2px) rotate(7deg)}42%{transform:translate(64px,-26px) rotate(-24deg) scale(.9);opacity:0}43%{transform:translate(-60px,16px) rotate(-12deg) scale(.9);opacity:0}58%{opacity:1}80%{transform:translate(3px,-1px) rotate(2deg)}100%{transform:translateY(-1px) scale(1.08)}}
.nv-ico[data-fx="plane"]::after{content:"";position:absolute;left:55%;top:48%;height:2px;width:46px;border-radius:2px;transform-origin:0 50%;
  background:linear-gradient(90deg,rgba(249,115,22,0),rgba(245,158,11,.95));animation:nvTrail 1.15s ease-out both;pointer-events:none}
@keyframes nvTrail{0%,8%{opacity:0;transform:rotate(-22deg) scaleX(0)}30%{opacity:.9;transform:rotate(-22deg) scaleX(1)}55%,100%{opacity:0;transform:rotate(-22deg) translateX(30px) scaleX(.2)}}
.nv-ico[data-fx="drop"] svg{animation:nvDrop .95s cubic-bezier(.4,0,.3,1) both;transform-origin:50% 100%}
@keyframes nvDrop{0%{transform:translateY(-1px)}26%{transform:translateY(-13px) scale(.88,1.12)}46%{transform:translateY(3px) scale(1.3,.68)}62%{transform:translateY(-3px) scale(.92,1.08)}80%{transform:translateY(0) scale(1.04,.97)}100%{transform:translateY(-1px) scale(1.08)}}
.nv-ico[data-fx="drop"]::before,.nv-ico[data-fx="drop"]::after{content:"";position:absolute;bottom:0;left:50%;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:currentColor;opacity:0;pointer-events:none}
.nv-ico[data-fx="drop"]::before{animation:nvSplashL .95s ease-out both}
.nv-ico[data-fx="drop"]::after{animation:nvSplashR .95s ease-out both}
@keyframes nvSplashL{0%,44%{opacity:0;transform:none}50%{opacity:.9;transform:translate(-5px,-6px)}75%,100%{opacity:0;transform:translate(-11px,1px) scale(.4)}}
@keyframes nvSplashR{0%,44%{opacity:0;transform:none}50%{opacity:.9;transform:translate(5px,-7px)}75%,100%{opacity:0;transform:translate(12px,1px) scale(.4)}}
.nv-ico[data-fx="spin"] svg{animation:nvSpin 1s cubic-bezier(.2,.75,.25,1) both}
@keyframes nvSpin{0%{transform:perspective(80px) rotateY(0)}100%{transform:perspective(80px) rotateY(360deg) translateY(-1px) scale(1.08)}}
.nv-ico[data-fx="glow"] svg{animation:nvHop .8s cubic-bezier(.3,1.4,.5,1) both;transform-origin:50% 100%}
@keyframes nvHop{0%{transform:none}30%{transform:translateY(-5px) scale(1.04,.96)}55%{transform:translateY(0) scale(1.12,.88)}75%{transform:translateY(-2px) scale(.98,1.04)}100%{transform:translateY(-1px) scale(1.08)}}
.nv-ico[data-fx="glow"] .nv-door{animation:nvDoor 1.3s ease both}
@keyframes nvDoor{0%{fill:transparent}30%{fill:#FDE68A}100%{fill:rgba(249,115,22,.55)}}
.nv-ico[data-fx="wave"] svg{animation:nvWave .9s ease-in-out both;transform-origin:50% 92%}
@keyframes nvWave{0%{transform:none}20%{transform:rotate(-15deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(4deg)}100%{transform:translateY(-1px) scale(1.08)}}
.nimbus-nav[data-compact="true"] .nimbus-item{padding:0 12px}
.nimbus-nav[data-compact="true"] .nimbus-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (max-width:580px){
  .nimbus-nav:not([data-compact="false"]) .nimbus-item{padding:0 11px}
  .nimbus-nav:not([data-compact="false"]) .nimbus-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
}
@media (prefers-reduced-motion:reduce){.nv-ico svg,.nv-ico::before,.nv-ico::after,.nv-door{animation:none!important;transition:none}}
`

/* ---------- the liquid shader (Warm Golden Water) ---------- */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float sdCap(vec2 p,vec4 B,float sy){p-=B.xy;p.y/=sy;p.x=max(abs(p.x)-B.z,0.);return(length(p)-B.w)*min(1.,sy);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),13.);}}return d;}
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,h.y);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1000.);
 w+=uAmb*(sin(p.x*.05+uTime*1.2)*.45+sin(p.x*.13-uTime*.85+p.y*.2)*.25);return w;}
float H(vec2 p){float dp=pillD(p);return lens(dp,uPill.w*.36)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=pillD(p);float dd=dropD(p);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 // Warm golden-orange iridescence
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.05,.22,.45)+fres*.85+p.x*.0028+uTime*.035));
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dropD(p-vec2(0.,5.)))*(1.-dm)*pm*(.11+.07*uDark);
 vec3 c=vec3(0.35,.15,.02)*sh;float a=sh;
 float pa=clamp(pm*(fres*.5+spec*.9+spec2),0.,1.);
 c=mix(vec3(1.),irid,.5*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 // Warm golden water tint
 vec3 tint=mix(vec3(1.0,.93,.86),vec3(1.0,.78,.55),uDark);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.26+.14*body)*(1.-.35*uDark);vec3 dc=mix(tint,vec3(1.),body*.6);
 float la=rim*.22;vec3 lc=mix(vec3(0.92,.40,.08),vec3(1.0,.68,.20),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*.28*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.4;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`

type Body = { x: number; v: number }
type Sat = { x: number; y: number; vx: number; vy: number; r: number; k: number }
type Rip = { x: number; y: number; age: number; amp: number }

function makeState() {
  return {
    a: { x: 0, v: 0 } as Body,
    b: { x: 0, v: 0 } as Body,
    sy: { s: 1, v: 0 },
    lead: 0 as 0 | 1,
    lagFrom: 0,
    sats: [] as Sat[],
    rips: [] as Rip[],
    t: { x: 0, cy: 0, q: 0, r: 18 },
    q: 0,
    mouse: { x: 0, y: 0, s: 0, on: false },
    moving: false,
    split: false,
    ready: false,
    w: 0,
    h: 0,
    visible: true,
    reduce: false,
    raf: 0,
    last: 0,
    time: 0,
    glc: null as null | { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> },
  }
}

function initGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null
  if (!gl) return null
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = sh(gl.VERTEX_SHADER, VERT)
  const fs = sh(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const p = gl.createProgram()!
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null
  gl.useProgram(p)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(p, "a")
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const u: Record<string, WebGLUniformLocation | null> = {}
  for (const n of ["uRes", "uDpr", "uTime", "uPill", "uBlob", "uSy", "uRip", "uMouse", "uDark", "uAmb"]) u[n] = gl.getUniformLocation(p, n)
  return { gl, u }
}

function supportsRefraction() {
  if (typeof window === "undefined" || typeof CSS === "undefined") return false
  const ua = navigator.userAgent
  return /Chrome\/|Chromium\/|Edg\//.test(ua) && !/Firefox\//.test(ua) && !!(CSS as any).supports?.("backdrop-filter", "url(#a)")
}

export function LiquidNavbar({
  items = DEFAULT_ITEMS,
  defaultActive = 0,
  active,
  onChange,
  tone = "light",
  compact,
  sound = false,
  className,
  style,
}: LiquidNavbarProps) {
  const [inner, setInner] = React.useState(defaultActive)
  const current = active ?? inner
  const navRef = React.useRef<HTMLElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const dropRef = React.useRef<HTMLSpanElement>(null)
  const itemRefs = React.useRef<(HTMLElement | null)[]>([])
  const iconRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const audio = React.useRef<AudioContext | null>(null)
  const st = React.useRef(makeState())
  const [gl, setGl] = React.useState<"on" | "off">("on")
  const [refract, setRefract] = React.useState(false)
  const [fx, setFx] = React.useState({ i: -1, n: 0 })
  const dark = tone === "dark" ? 1 : 0
  const darkRef = React.useRef(dark)
  darkRef.current = dark

  /* ---- drawing ---- */
  const draw = React.useCallback(() => {
    const s = st.current
    const T = s.t
    const sep = Math.abs(s.a.x - s.b.x)
    const thin = Math.min(sep / (2 * (s.q + T.r) || 1), 1)
    const r = T.r * (1 - 0.3 * thin)
    // Selalu perbarui style dropRef agar drop indicator pada night mode dapat meluncur mulus
    if (dropRef.current) {
      const left = Math.min(s.a.x, s.b.x) - s.q - r - PAD
      const width = sep + 2 * (s.q + r)
      dropRef.current.style.width = `${width}px`
      dropRef.current.style.transform = `translateX(${left}px) scaleY(${s.sy.s})`
    }

    if (s.glc) {
      const { gl: g, u } = s.glc
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight)
      g.uniform2f(u.uRes, s.w + PAD * 2, s.h + PAD * 2)
      g.uniform1f(u.uDpr, dpr)
      g.uniform1f(u.uTime, s.time)
      g.uniform4f(u.uPill, PAD, PAD, s.w, s.h)
      const blobs = new Float32Array(24)
      const sy = new Float32Array(6).fill(1)
      const head = s.lead === 0 ? s.a : s.b, tail = s.lead === 0 ? s.b : s.a
      blobs.set([head.x, T.cy, s.q * (1 - 0.25 * thin), T.r * (1 - 0.12 * thin), tail.x, T.cy, s.q * (1 - 0.8 * thin), T.r * (1 - 0.5 * thin)], 0)
      sy[0] = sy[1] = s.sy.s
      s.sats.slice(0, 4).forEach((d, i) => blobs.set([d.x, d.y, 0, d.r], 8 + i * 4))
      g.uniform4fv(u.uBlob, blobs)
      g.uniform1fv(u.uSy, sy)
      const rips = new Float32Array(24)
      s.rips.slice(-6).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4))
      g.uniform4fv(u.uRip, rips)
      g.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s)
      g.uniform1f(u.uDark, darkRef.current)
      g.uniform1f(u.uAmb, s.reduce ? 0 : 1)
      g.clearColor(0, 0, 0, 0)
      g.clear(g.COLOR_BUFFER_BIT)
      g.drawArrays(g.TRIANGLES, 0, 3)
    }
  }, [])

  /* ---- physics ---- */
  const step = React.useCallback((dt: number, now: number) => {
    const s = st.current
    const T = s.t
    s.time += dt
    s.q += (T.q - s.q) * Math.min(1, dt * 12)
    const bodies = [s.a, s.b]
    let still = true
    if (s.reduce) {
      s.a.x = s.b.x = T.x; s.a.v = s.b.v = 0; s.sy.s = 1; s.sats = []
    } else {
      bodies.forEach((B, i) => {
        const lead = i === s.lead
        const k = lead ? 210 : 72
        const c = lead ? 25 : 13
        const f = !lead && now < s.lagFrom ? 0.08 : 1
        B.v += (k * (T.x - B.x) - c * B.v) * dt * f
        B.x += B.v * dt
        const lo = PAD + 4 + s.q + T.r - 2, hi = PAD + s.w - 4 - s.q - T.r + 2
        if (B.x < lo || B.x > hi) {
          s.sy.v -= Math.min(Math.abs(B.v), 900) * 0.0016
          B.x = Math.max(lo, Math.min(hi, B.x))
          B.v *= -0.25
        }
        if (Math.abs(T.x - B.x) > 0.3 || Math.abs(B.v) > 3) still = false
      })
      const L = bodies[s.lead]
      const syT = 1 - 0.2 * Math.min(Math.abs(L.v) / 1500, 1)
      s.sy.v += (280 * (syT - s.sy.s) - 9 * s.sy.v) * dt
      s.sy.s += s.sy.v * dt
      if (Math.abs(s.sy.s - 1) > 0.002 || Math.abs(s.sy.v) > 0.02) still = false
      const sep = Math.abs(s.a.x - s.b.x)
      const r = T.r * (1 - 0.3 * Math.min(sep / (2 * (T.q + T.r) || 1), 1))
      if (!s.split && s.moving && sep - 2 * T.q - 2 * r > -6) {
        s.split = true
        const lo = bodies[1 - s.lead], hi = bodies[s.lead]
        ;[0.3, 0.5, 0.72].forEach((t, j) => {
          s.sats.push({
            x: lo.x + (hi.x - lo.x) * t + (Math.random() - 0.5) * 6,
            y: T.cy + (Math.random() - 0.5) * 10,
            vx: (lo.v + hi.v) * 0.45,
            vy: (Math.random() - 0.5) * 60,
            r: 5 + Math.random() * 3 - j * 0.5,
            k: 70 + Math.random() * 90,
          })
        })
      }
      s.sats = s.sats.filter((d) => {
        d.vx += (d.k * (T.x - d.x) - 9 * d.vx) * dt
        d.vy += (90 * (T.cy - d.y) - 7 * d.vy) * dt
        d.x += d.vx * dt
        d.y += d.vy * dt
        d.x = Math.max(PAD + 8 + d.r, Math.min(PAD + s.w - 8 - d.r, d.x))
        d.y = Math.max(T.cy - T.r + d.r, Math.min(T.cy + T.r - d.r, d.y))
        if (Math.abs(T.x - d.x) < T.q + T.r * 0.5) d.r -= dt * 26
        return d.r > 0.6
      })
      if (s.sats.length) still = false
    }
    if (s.moving && still) {
      s.moving = false
      if (s.split || !s.reduce) s.rips.push({ x: T.x, y: T.cy, age: 0, amp: s.split ? 1.2 : 0.7 })
    }
    s.rips.forEach((p) => (p.age += dt))
    s.rips = s.rips.filter((p) => p.age < 2.4)
    const target = s.mouse.on ? 1 : 0
    s.mouse.s += (target - s.mouse.s) * Math.min(1, dt * 7)
  }, [])

  const loop = React.useCallback(() => {
    const s = st.current
    if (s.raf) return
    s.last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - s.last) / 1000, 1 / 30)
      s.last = now
      step(dt, now)
      draw()
      const busy = s.moving || s.rips.length || s.sats.length || s.mouse.s > 0.01
      if (s.visible && (!s.reduce || busy)) s.raf = requestAnimationFrame(tick)
      else s.raf = 0
    }
    s.raf = requestAnimationFrame(tick)
  }, [draw, step])

  /* ---- layout ---- */
  const measure = React.useCallback(() => {
    const nav = navRef.current
    const el = itemRefs.current[current]
    if (!nav || !el) return
    const s = st.current
    s.w = nav.offsetWidth
    s.h = nav.offsetHeight
    const T = s.t
    T.r = el.offsetHeight / 2
    T.q = Math.max(0, el.offsetWidth / 2 - T.r)
    T.cy = PAD + el.offsetTop + el.offsetHeight / 2
    const nx = PAD + el.offsetLeft + el.offsetWidth / 2
    if (!s.ready) {
      s.a.x = s.b.x = nx
      s.q = T.q
      s.ready = true
    } else if (Math.abs(nx - T.x) > 0.5) {
      const movingRight = nx > (s.a.x + s.b.x) / 2
      // Pastikan kepala (lead) selalu berada di depan menuju arah tujuan
      s.lead = movingRight ? (s.a.x >= s.b.x ? 0 : 1) : (s.a.x <= s.b.x ? 0 : 1)
      
      // Hentikan inersia/kecepatan mundur yang menyebabkan kickback ke arah berlawanan
      if (movingRight) {
        if (s.a.v < 0) s.a.v = 0
        if (s.b.v < 0) s.b.v = 0
      } else {
        if (s.a.v > 0) s.a.v = 0
        if (s.b.v > 0) s.b.v = 0
      }

      s.lagFrom = performance.now() + 60
      s.moving = true
      s.split = false
    }
    T.x = nx
    const cv = canvasRef.current
    if (cv) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const W = s.w + PAD * 2, Hh = s.h + PAD * 2
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(Hh * dpr)) {
        cv.width = Math.round(W * dpr)
        cv.height = Math.round(Hh * dpr)
        cv.style.width = `${W}px`
        cv.style.height = `${Hh}px`
      }
    }
    loop()
  }, [current, loop])

  React.useEffect(() => {
    setRefract(supportsRefraction())
    const s = st.current
    s.reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const cv = canvasRef.current
    s.glc = cv ? initGL(cv) : null
    if (!s.glc) setGl("off")
    const lost = (e: Event) => { e.preventDefault(); s.glc = null; setGl("off") }
    cv?.addEventListener("webglcontextlost", lost)
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) loop() })
    if (navRef.current) io.observe(navRef.current)
    const vis = () => { s.visible = document.visibilityState === "visible"; if (s.visible) loop() }
    document.addEventListener("visibilitychange", vis)
    return () => {
      cv?.removeEventListener("webglcontextlost", lost)
      io.disconnect()
      document.removeEventListener("visibilitychange", vis)
      cancelAnimationFrame(s.raf)
      s.raf = 0
    }
  }, [loop])

  React.useLayoutEffect(() => { measure() }, [measure, items.length, compact])
  const measureRef = React.useRef(measure)
  measureRef.current = measure
  React.useEffect(() => {
    let lastW = -1
    const ro = new ResizeObserver(() => {
      const w = navRef.current?.offsetWidth ?? 0
      if (w !== lastW) { lastW = w; st.current.ready = false; measureRef.current() }
    })
    if (navRef.current) ro.observe(navRef.current)
    return () => ro.disconnect()
  }, [])
  React.useEffect(() => { loop() }, [tone, loop])

  /* ---- interaction ---- */
  const local = (clientX: number, clientY: number) => {
    const r = navRef.current!.getBoundingClientRect()
    return { x: clientX - r.left + PAD, y: clientY - r.top + PAD }
  }
  const ripple = (x: number, y: number, amp: number) => {
    const s = st.current
    if (s.reduce) return
    s.rips.push({ x, y, age: 0, amp })
    loop()
  }
  const iconCenter = (i: number) => {
    const el = iconRefs.current[i]
    if (!el) return null
    const b = el.getBoundingClientRect()
    return local(b.left + b.width / 2, b.top + b.height / 2)
  }
  const plip = () => {
    if (!sound) return
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      const ctx = (audio.current ||= new AC())
      const t = ctx.currentTime
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = "sine"
      o.frequency.setValueAtTime(480 + Math.random() * 80, t)
      o.frequency.exponentialRampToValueAtTime(1600, t + 0.07)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
      o.connect(g).connect(ctx.destination)
      o.start(t)
      o.stop(t + 0.18)
    } catch {}
  }

  const select = (i: number) => {
    const kind = items[i]?.fx ?? (items[i]?.icon ? "pop" : "none")
    setFx((f) => ({ i, n: f.n + 1 }))
    plip()
    const c = iconCenter(i)
    if (c && kind === "drop") setTimeout(() => ripple(c.x, st.current.t.cy, 1.4), 430)
    if (c && kind === "plane") ripple(c.x, c.y, 0.6)
    if (i !== current) {
      if (active === undefined) setInner(i)
      onChange?.(i, items[i])
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const n = (current + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length
    select(n)
    itemRefs.current[n]?.focus()
  }

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return
    const p = local(e.clientX, e.clientY)
    const s = st.current
    s.mouse.x = p.x
    s.mouse.y = p.y
    s.mouse.on = true
    loop()
  }

  return (
    <nav
      ref={navRef as any}
      className={["nimbus-nav", className].filter(Boolean).join(" ")}
      data-tone={tone}
      data-gl={gl}
      data-compact={compact === undefined ? undefined : String(compact)}
      data-refract={refract ? "on" : "off"}
      aria-label="Main"
      onKeyDown={onKeyDown}
      onPointerMove={onMove}
      onPointerLeave={() => { st.current.mouse.on = false; loop() }}
      onPointerDown={(e) => { const p = local(e.clientX, e.clientY); ripple(p.x, p.y, 0.8) }}
      style={style}
    >
      <style dangerouslySetInnerHTML={{ __html: NIMBUS_CSS }} />
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="nimbus-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="60" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <span className="nimbus-glass" aria-hidden="true" />
      <canvas className="nimbus-water" ref={canvasRef} aria-hidden="true" />
      <span className="nimbus-drop" ref={dropRef} aria-hidden="true" />
      {items.map((it, i) => {
        const kind = it.fx ?? "pop"
        const playing = fx.i === i && kind !== "none"
        const props = {
          ref: (el: HTMLElement | null) => { itemRefs.current[i] = el },
          className: "nimbus-item",
          "aria-current": i === current ? ("page" as const) : undefined,
          onClick: () => select(i),
        }
        const content = (
          <>
            {it.icon && (
              <span className="nv-ico" key={playing ? fx.n : 0} data-fx={playing ? kind : undefined} ref={(el) => { iconRefs.current[i] = el }}>
                {it.icon}
              </span>
            )}
            <span className="nimbus-label">{it.label}</span>
          </>
        )
        return it.href ? (
          <a key={it.label + i} {...(props as any)} href={it.href} aria-label={it.label}>{content}</a>
        ) : (
          <button key={it.label + i} {...(props as any)} type="button" aria-label={it.label}>{content}</button>
        )
      })}
    </nav>
  )
}

export { LiquidNavbar as Component }
export default LiquidNavbar

