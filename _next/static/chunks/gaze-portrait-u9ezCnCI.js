import{r as e}from"./rolldown-runtime-C60lm6uB.js";import{i as t,r as n}from"./framework-D_rUT4EX.js";var r=e(t(),1);function i(e,t,n,r){let i=(e.x-t.x)/Math.max(n*1.05,1),a=(e.y-t.y)/Math.max(r*.8,1),o=Math.sqrt(1+i*i+a*a);return{x:i/o,y:a/o}}function a(e,t,n,r=160){let i=1-Math.exp(-Math.min(Math.max(n,0),80)/Math.max(r,1));return{x:e.x+(t.x-e.x)*i,y:e.y+(t.y-e.y)*i}}var o=n(),s=`/images/character-gaze.png`,c={x:488.5,y:518},l=`
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`,u=`
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform vec2 u_view;
uniform vec2 u_image_size;
uniform vec2 u_head;
uniform vec2 u_gaze;

float edgeDistance(vec2 p, vec2 a, vec2 b) {
  vec2 edge = b - a;
  vec2 delta = p - a;
  return (edge.x * delta.y - edge.y * delta.x) / length(edge);
}

float eyeOpening(vec2 p, bool right) {
  // Convex contours sit just inside the original eyelids, in source pixels.
  // Moving irises are clipped here; the lid, lashes and skin never slide.
  float d = 1000.0;
  if (right) {
    d = min(d, edgeDistance(p, vec2(527, 510), vec2(531, 495)));
    d = min(d, edgeDistance(p, vec2(531, 495), vec2(539, 484)));
    d = min(d, edgeDistance(p, vec2(539, 484), vec2(552, 477)));
    d = min(d, edgeDistance(p, vec2(552, 477), vec2(565, 474)));
    d = min(d, edgeDistance(p, vec2(565, 474), vec2(580, 477)));
    d = min(d, edgeDistance(p, vec2(580, 477), vec2(591, 483)));
    d = min(d, edgeDistance(p, vec2(591, 483), vec2(596, 491)));
    d = min(d, edgeDistance(p, vec2(596, 491), vec2(592, 502)));
    d = min(d, edgeDistance(p, vec2(592, 502), vec2(583, 512)));
    d = min(d, edgeDistance(p, vec2(583, 512), vec2(570, 522)));
    d = min(d, edgeDistance(p, vec2(570, 522), vec2(554, 526)));
    d = min(d, edgeDistance(p, vec2(554, 526), vec2(540, 527)));
    d = min(d, edgeDistance(p, vec2(540, 527), vec2(529, 524)));
    d = min(d, edgeDistance(p, vec2(529, 524), vec2(527, 510)));
  } else {
    d = min(d, edgeDistance(p, vec2(377, 542), vec2(381, 531)));
    d = min(d, edgeDistance(p, vec2(381, 531), vec2(388, 522)));
    d = min(d, edgeDistance(p, vec2(388, 522), vec2(399, 516)));
    d = min(d, edgeDistance(p, vec2(399, 516), vec2(413, 513)));
    d = min(d, edgeDistance(p, vec2(413, 513), vec2(427, 516)));
    d = min(d, edgeDistance(p, vec2(427, 516), vec2(440, 524)));
    d = min(d, edgeDistance(p, vec2(440, 524), vec2(448, 534)));
    d = min(d, edgeDistance(p, vec2(448, 534), vec2(452, 545)));
    d = min(d, edgeDistance(p, vec2(452, 545), vec2(442, 553)));
    d = min(d, edgeDistance(p, vec2(442, 553), vec2(430, 559)));
    d = min(d, edgeDistance(p, vec2(430, 559), vec2(416, 562)));
    d = min(d, edgeDistance(p, vec2(416, 562), vec2(402, 563)));
    d = min(d, edgeDistance(p, vec2(402, 563), vec2(389, 559)));
    d = min(d, edgeDistance(p, vec2(389, 559), vec2(381, 553)));
    d = min(d, edgeDistance(p, vec2(381, 553), vec2(377, 542)));
  }
  return smoothstep(0.0, 1.0, d);
}

vec4 lookingEye(vec4 original, vec2 pixel, vec2 direction, bool right) {
  vec2 center = right ? vec2(556.5, 500.5) : vec2(420.5, 537.0);
  vec2 radius = vec2(24.0, 25.5);
  if (length(pixel - center) > 48.0 || length(direction) < 0.0001) return original;
  vec2 offset = direction * vec2(10.0, 6.0);
  float oldIris = 1.0 - smoothstep(1.10, 1.22, length((pixel - center) / radius));
  float newIris = 1.0 - smoothstep(0.95, 1.01, length((pixel - center - offset) / radius));
  vec2 whiteLeft = right ? vec2(533.0, 514.0) : vec2(390.0, 547.0);
  vec2 whiteRight = right ? vec2(587.0, 493.0) : vec2(447.0, 541.0);
  vec4 sclera = mix(texture2D(u_image, whiteLeft / u_image_size), texture2D(u_image, whiteRight / u_image_size), smoothstep(-30.0, 30.0, pixel.x - center.x));
  // Move each iris as a solid texture, retaining its round shape and highlight.
  vec4 cleanEye = mix(original, sclera, oldIris);
  vec4 iris = texture2D(u_image, (pixel - offset) / u_image_size);
  vec4 eye = mix(cleanEye, iris, newIris);
  return mix(original, eye, eyeOpening(pixel, right) * smoothstep(0.0, 0.06, length(direction)));
}

float fingerMask(vec2 pixel, vec2 start, vec2 end, float radius) {
  vec2 segment = end - start;
  float along = clamp(dot(pixel - start, segment) / dot(segment, segment), 0.0, 1.0);
  float distance = length(pixel - start - along * segment);
  return 1.0 - smoothstep(radius, radius + 9.0, distance);
}

float headMask(vec2 pixel) {
  // The hat, hair, face and eyes share one rigid motion. Only the neck and
  // surrounding background blend back to the original, stationary picture.
  float silhouette = 1.0 - smoothstep(1.0, 1.16, length((pixel - vec2(490.0, 410.0)) / vec2(310.0, 305.0)));
  float neck = 1.0 - smoothstep(625.0, 695.0, pixel.y);
  // The raised peace-sign fingers overlap the head; keep them anchored.
  float fingers = max(
    fingerMask(pixel, vec2(318.0, 576.0), vec2(317.0, 653.0), 17.0),
    fingerMask(pixel, vec2(266.0, 582.0), vec2(304.0, 641.0), 16.0)
  );
  float palm = (1.0 - smoothstep(339.0, 365.0, pixel.x)) * smoothstep(629.0, 653.0, pixel.y);
  return silhouette * neck * (1.0 - max(fingers, palm));
}

void main() {
  // Match the existing 155%-wide image crop, using top-left image coordinates.
  vec2 screen = vec2(v_uv.x, 1.0 - v_uv.y) * u_view;
  float imageWidth = u_view.x * 1.55;
  vec2 imageSize = vec2(imageWidth, imageWidth * u_image_size.y / u_image_size.x);
  vec2 imageOffset = vec2((u_view.x - imageWidth) * 0.5, -0.09 * u_view.y);
  vec2 uv = (screen - imageOffset) / imageSize;
  vec2 pixel = uv * u_image_size;
  // At full reach the tilt is only 1.26 degrees; vertical travel is about
  // 2.5 display pixels on desktop. Inverse sampling preserves facial geometry.
  vec2 pivot = vec2(515.0, 668.0);
  float angle = u_head.x * 0.022;
  float c = cos(angle);
  float s = sin(angle);
  vec2 relative = pixel - pivot - u_head * vec2(5.0, 6.0);
  vec2 rotated = vec2(c * relative.x + s * relative.y, -s * relative.x + c * relative.y);
  vec2 source = mix(pixel, pivot + rotated, headMask(pixel));
  // The pupil movement is expressed in the turned head's local coordinates.
  vec2 gaze = vec2(c * u_gaze.x + s * u_gaze.y, -s * u_gaze.x + c * u_gaze.y);
  vec4 color = texture2D(u_image, clamp(source / u_image_size, 0.0, 1.0));
  color = lookingEye(color, source, gaze, false);
  gl_FragColor = lookingEye(color, source, gaze, true);
}`;function d(){let e=(0,r.useRef)(null),t=(0,r.useRef)(null),[n,d]=(0,r.useState)(!1);return(0,r.useEffect)(()=>{let n=e.current,r=t.current;if(!n||!r)return;let o=r.getContext(`webgl`,{alpha:!1,antialias:!1,powerPreference:`low-power`});if(!o)return;let f=!1,p=!1,m=!0,h=0,g=0,_,v=!1,y=n.getBoundingClientRect(),b={x:0,y:0},x={x:0,y:0},S={x:0,y:0},C=null,w=window.matchMedia(`(prefers-reduced-motion: reduce)`),T=[];function E(e,t){let n=o.createShader(e);return n?(T.push(n),o.shaderSource(n,t),o.compileShader(n),o.getShaderParameter(n,o.COMPILE_STATUS)?n:null):null}let D=E(o.VERTEX_SHADER,l),ee=o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT),O=E(o.FRAGMENT_SHADER,ee?.precision?u:u.replace(`highp`,`mediump`)),k=o.createProgram();if(!D||!O||!k){T.forEach(e=>o.deleteShader(e)),k&&o.deleteProgram(k);return}if(o.attachShader(k,D),o.attachShader(k,O),o.linkProgram(k),!o.getProgramParameter(k,o.LINK_STATUS)){T.forEach(e=>o.deleteShader(e)),o.deleteProgram(k);return}o.useProgram(k);let A=o.createBuffer(),j=o.createTexture();if(!A||!j){A&&o.deleteBuffer(A),j&&o.deleteTexture(j),T.forEach(e=>o.deleteShader(e)),o.deleteProgram(k);return}o.bindBuffer(o.ARRAY_BUFFER,A),o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),o.STATIC_DRAW);let M=o.getAttribLocation(k,`a_position`);o.enableVertexAttribArray(M),o.vertexAttribPointer(M,2,o.FLOAT,!1,0,0);let N=o.getUniformLocation(k,`u_view`),P=o.getUniformLocation(k,`u_image_size`),F=o.getUniformLocation(k,`u_head`),I=o.getUniformLocation(k,`u_gaze`);o.uniform1i(o.getUniformLocation(k,`u_image`),0);let L=new window.Image;L.decoding=`async`;function R(){!p||f||o.isContextLost()||(o.uniform2f(N,y.width,y.height),o.uniform2f(F,b.x,b.y),o.uniform2f(I,x.x,x.y),o.drawArrays(o.TRIANGLES,0,6))}function z(e){if(h=0,!p||f||!m||document.hidden)return;let t=g?e-g:16;x=a(x,S,t,65),b=a(b,S,t),g=e,R(),Math.max(Math.hypot(b.x-S.x,b.y-S.y),Math.hypot(x.x-S.x,x.y-S.y))>.001?h=requestAnimationFrame(z):(b={...S},x={...S},g=0,R())}function B(){!h&&p&&m&&!document.hidden&&!f&&(h=requestAnimationFrame(z))}function V(e){if(w.matches||!m||!y.width)return;let t=y.width*1.55,n=t/(L.naturalWidth||1024);S=i(e,{x:y.left+(y.width-t)*.5+c.x*n,y:y.top-y.height*.09+c.y*n},y.width,y.height),C=e,B()}function H(){clearTimeout(_),v=!1,C=null,S={x:0,y:0},B()}function U(){y=n.getBoundingClientRect();let e=Math.min(window.devicePixelRatio||1,2),t=Math.max(1,Math.round(y.width*e)),i=Math.max(1,Math.round(y.height*e));(r.width!==t||r.height!==i)&&(r.width=t,r.height=i,o.viewport(0,0,t,i)),C&&V(C),R()}function W(e){(e.pointerType===`mouse`||e.pointerType===`pen`||v)&&V({x:e.clientX,y:e.clientY})}function G(e){e.pointerType===`mouse`||!n.contains(e.target)||(clearTimeout(_),v=!0,V({x:e.clientX,y:e.clientY}))}function K(e){e.pointerType===`mouse`||!v||(v=!1,clearTimeout(_),_=setTimeout(H,650))}function q(e){e.pointerType!==`touch`&&H()}function J(){clearTimeout(_),cancelAnimationFrame(h),h=0,g=0,b={x:0,y:0},x={x:0,y:0},S={x:0,y:0},C=null,v=!1}function Y(){document.hidden?J():(U(),B())}function X(){w.matches&&(J(),R())}function Z(e){e.preventDefault(),J(),p=!1,d(!1)}let Q=new ResizeObserver(U);Q.observe(n);let $=new IntersectionObserver(([e])=>{m=e.isIntersecting,m?(U(),B()):J()});return $.observe(n),L.onload=()=>{f||o.isContextLost()||(o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,j),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,L),o.uniform2f(P,L.naturalWidth,L.naturalHeight),p=!0,U(),d(!0),B())},L.src=s,window.addEventListener(`pointermove`,W,{passive:!0}),window.addEventListener(`pointerdown`,G,{passive:!0}),window.addEventListener(`pointerup`,K,{passive:!0}),window.addEventListener(`pointercancel`,H,{passive:!0}),window.addEventListener(`blur`,H),window.addEventListener(`scroll`,U,{passive:!0}),window.addEventListener(`resize`,U,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,q),document.addEventListener(`visibilitychange`,Y),w.addEventListener(`change`,X),r.addEventListener(`webglcontextlost`,Z),()=>{f=!0,J(),clearTimeout(_),L.onload=null,Q.disconnect(),$.disconnect(),window.removeEventListener(`pointermove`,W),window.removeEventListener(`pointerdown`,G),window.removeEventListener(`pointerup`,K),window.removeEventListener(`pointercancel`,H),window.removeEventListener(`blur`,H),window.removeEventListener(`scroll`,U),window.removeEventListener(`resize`,U),document.documentElement.removeEventListener(`pointerleave`,q),document.removeEventListener(`visibilitychange`,Y),w.removeEventListener(`change`,X),r.removeEventListener(`webglcontextlost`,Z),o.deleteBuffer(A),o.deleteTexture(j),o.deleteProgram(k),T.forEach(e=>o.deleteShader(e))}},[]),(0,o.jsxs)(`div`,{ref:e,className:`portrait-frame gaze-portrait`,children:[(0,o.jsx)(`img`,{className:`portrait-source`,src:s,alt:`谢达的蓝帽动漫形象，双眼睁开微笑比耶`,width:`1024`,height:`1536`,fetchPriority:`high`,draggable:!1}),(0,o.jsx)(`canvas`,{ref:t,className:`gaze-canvas${n?` is-ready`:``}`,"aria-hidden":`true`})]})}export{d as GazePortrait};