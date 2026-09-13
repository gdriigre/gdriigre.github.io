import{r as e}from"./rolldown-runtime-C60lm6uB.js";import{i as t,r as n}from"./framework-D_rUT4EX.js";var r=e(t(),1);function i(e){let t=null,n=!0,r=null,i=0,a=new Set,o=new Set,s=new Set,c=new Set,l=new Set,u=new AbortController;function d(e,t){if(!e)throw Error(`Fluid resource allocation failed`);return t.add(e),e}function f(){if(n){if(n=!1,u.abort(),r!==null&&cancelAnimationFrame(r),t){for(let e of a)t.deleteTexture(e);for(let e of o)t.deleteFramebuffer(e);for(let e of s)t.deleteBuffer(e);for(let e of c)t.deleteShader(e);for(let e of l)t.deleteProgram(e);t.bindFramebuffer(t.FRAMEBUFFER,null),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}a.clear(),o.clear(),s.clear(),c.clear(),l.clear(),e.style.opacity=`0`}}try{function ee(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color={r:0,g:0,b:0}}let p=window.matchMedia(`(pointer: coarse)`).matches,m={SIM_RESOLUTION:p?96:128,DYE_RESOLUTION:p?384:768,DENSITY_DISSIPATION:3.5,VELOCITY_DISSIPATION:2,PRESSURE:.1,PRESSURE_ITERATIONS:p?12:20,CURL:3,SPLAT_RADIUS:.2,SPLAT_FORCE:6e3,SHADING:!p,COLOR_UPDATE_SPEED:1.2,RAINBOW_MODE:!0,COLOR:`#b76bd7`},h=[new ee],g=te(e);if(!g)return f;t=g.gl;let{ext:_}=g;if(!_.formatRGBA||!_.formatRG||!_.formatR||!_.halfFloatTexType)return f(),f;_.supportLinearFiltering||(m.DYE_RESOLUTION=256,m.SHADING=!1);function te(e){let n={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};t=e.getContext(`webgl2`,n);let r=!!t;if(r||(t=e.getContext(`webgl`,n)||e.getContext(`experimental-webgl`,n)),!t)return null;let i,a;r?(t.getExtension(`EXT_color_buffer_float`),a=t.getExtension(`OES_texture_float_linear`)):(i=t.getExtension(`OES_texture_half_float`),a=t.getExtension(`OES_texture_half_float_linear`)),t.clearColor(0,0,0,1);let o=r?t.HALF_FLOAT:i&&i.HALF_FLOAT_OES;if(!o)return{gl:t,ext:{}};let s,c,l;return r?(s=v(t,t.RGBA16F,t.RGBA,o),c=v(t,t.RG16F,t.RG,o),l=v(t,t.R16F,t.RED,o)):(s=v(t,t.RGBA,t.RGBA,o),c=v(t,t.RGBA,t.RGBA,o),l=v(t,t.RGBA,t.RGBA,o)),{gl:t,ext:{formatRGBA:s,formatRG:c,formatR:l,halfFloatTexType:o,supportLinearFiltering:a}}}function v(e,t,n,r){if(!ne(e,t,n,r))switch(t){case e.R16F:return v(e,e.RG16F,e.RG,r);case e.RG16F:return v(e,e.RGBA16F,e.RGBA,r);default:return null}return{internalFormat:t,format:n}}function ne(e,t,n,r){let i=d(e.createTexture(),a);e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,t,4,4,0,n,r,null);let s=d(e.createFramebuffer(),o);e.bindFramebuffer(e.FRAMEBUFFER,s),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0);let c=e.checkFramebufferStatus(e.FRAMEBUFFER);return e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),e.deleteFramebuffer(s),o.delete(s),e.deleteTexture(i),a.delete(i),c===e.FRAMEBUFFER_COMPLETE}class re{constructor(e,t){this.vertexShader=e,this.fragmentShaderSource=t,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(e){let n=0;for(let t=0;t<e.length;t++)n+=Ie(e[t]);let r=this.programs[n];if(r==null){let i=S(t.FRAGMENT_SHADER,this.fragmentShaderSource,e);r=b(this.vertexShader,i),this.programs[n]=r}r!==this.activeProgram&&(this.uniforms=x(r),this.activeProgram=r)}bind(){t.useProgram(this.activeProgram)}}class y{constructor(e,t){this.uniforms={},this.program=b(e,t),this.uniforms=x(this.program)}bind(){t.useProgram(this.program)}}function b(e,n){let r=d(t.createProgram(),l);if(t.attachShader(r,e),t.attachShader(r,n),t.bindAttribLocation(r,0,`aPosition`),t.linkProgram(r),!t.getProgramParameter(r,t.LINK_STATUS))throw Error(`Fluid program link failed`);return r}function x(e){let n=[],r=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<r;i++){let r=t.getActiveUniform(e,i).name;n[r]=t.getUniformLocation(e,r)}return n}function S(e,n,r){n=ie(n,r);let i=d(t.createShader(e),c);if(t.shaderSource(i,n),t.compileShader(i),!t.getShaderParameter(i,t.COMPILE_STATUS))throw Error(`Fluid shader compilation failed`);return i}function ie(e,t){if(!t)return e;let n=``;return t.forEach(e=>{n+=`#define `+e+`
`}),n+e}let C=S(t.VERTEX_SHADER,`
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `),ae=S(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `),oe=S(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `),se=S(t.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `),ce=S(t.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,_.supportLinearFiltering?null:[`MANUAL_FILTERING`]),le=S(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `),ue=S(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `),de=S(t.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `),fe=S(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `),pe=S(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `),w=(t.bindBuffer(t.ARRAY_BUFFER,d(t.createBuffer(),s)),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,d(t.createBuffer(),s)),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(0),(e,n=!1)=>{e==null?(t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),t.bindFramebuffer(t.FRAMEBUFFER,null)):(t.viewport(0,0,e.width,e.height),t.bindFramebuffer(t.FRAMEBUFFER,e.fbo)),n&&(t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT)),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0)}),T,E,D,O,k,A=new y(C,ae),j=new y(C,oe),M=new y(C,se),N=new y(C,ce),P=new y(C,le),F=new y(C,ue),I=new y(C,de),L=new y(C,fe),R=new y(C,pe),z=new re(C,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          // Keep the overlay translucent even during repeated clicks.
          float alpha = clamp(a * 0.85, 0.0, 0.52);
          gl_FragColor = vec4(c / max(a, 0.0001) * alpha, alpha);
      }
    `);function B(){let e=Fe(m.SIM_RESOLUTION),n=Fe(m.DYE_RESOLUTION),r=_.halfFloatTexType,i=_.formatRGBA,a=_.formatRG,o=_.formatR,s=_.supportLinearFiltering?t.LINEAR:t.NEAREST;t.disable(t.BLEND),T=T?he(T,n.width,n.height,i.internalFormat,i.format,r,s):U(n.width,n.height,i.internalFormat,i.format,r,s),E=E?he(E,e.width,e.height,a.internalFormat,a.format,r,s):U(e.width,e.height,a.internalFormat,a.format,r,s),V(D),V(O),k&&(V(k.read),V(k.write)),D=H(e.width,e.height,o.internalFormat,o.format,r,t.NEAREST),O=H(e.width,e.height,o.internalFormat,o.format,r,t.NEAREST),k=U(e.width,e.height,o.internalFormat,o.format,r,t.NEAREST)}function V(e){e&&(t.deleteTexture(e.texture),a.delete(e.texture),t.deleteFramebuffer(e.fbo),o.delete(e.fbo))}function H(e,n,r,i,s,c){t.activeTexture(t.TEXTURE0);let l=d(t.createTexture(),a);t.bindTexture(t.TEXTURE_2D,l),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,c),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,c),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,r,e,n,0,i,s,null);let u=d(t.createFramebuffer(),o);return t.bindFramebuffer(t.FRAMEBUFFER,u),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,l,0),t.viewport(0,0,e,n),t.clear(t.COLOR_BUFFER_BIT),{texture:l,fbo:u,width:e,height:n,texelSizeX:1/e,texelSizeY:1/n,attach(e){return t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,l),e}}}function U(e,t,n,r,i,a){let o=H(e,t,n,r,i,a),s=H(e,t,n,r,i,a);return{width:e,height:t,texelSizeX:o.texelSizeX,texelSizeY:o.texelSizeY,get read(){return o},set read(e){o=e},get write(){return s},set write(e){s=e},swap(){let e=o;o=s,s=e}}}function me(e,n,r,i,a,o,s){let c=H(n,r,i,a,o,s);return A.bind(),t.uniform1i(A.uniforms.uTexture,e.attach(0)),w(c),V(e),c}function he(e,t,n,r,i,a,o){return e.width===t&&e.height===n?e:(e.read=me(e.read,t,n,r,i,a,o),V(e.write),e.write=H(t,n,r,i,a,o),e.width=t,e.height=n,e.texelSizeX=1/t,e.texelSizeY=1/n,e)}function ge(){let e=[];m.SHADING&&e.push(`SHADING`),z.setKeywords(e)}K(),ge(),B();let W=Date.now(),G=0;function _e(){if(r=null,!n||document.hidden)return;let e=ve();K()&&B(),ye(e),be(),xe(e),Se(null),performance.now()-i<2800?r=requestAnimationFrame(_e):q()}function ve(){let e=Date.now(),t=(e-W)/1e3;return t=Math.min(t,.016666),W=e,t}function K(){let t=Y(e.clientWidth),n=Y(e.clientHeight);return e.width!==t||e.height!==n?(e.width=t,e.height=n,!0):!1}function ye(e){G+=e*m.COLOR_UPDATE_SPEED,G>=1&&(G=Pe(G,0,1),h.forEach(e=>{e.color=J()}))}function be(){h.forEach(e=>{e.moved&&(e.moved=!1,we(e))})}function xe(e){t.disable(t.BLEND),F.bind(),t.uniform2f(F.uniforms.texelSize,E.texelSizeX,E.texelSizeY),t.uniform1i(F.uniforms.uVelocity,E.read.attach(0)),w(O),I.bind(),t.uniform2f(I.uniforms.texelSize,E.texelSizeX,E.texelSizeY),t.uniform1i(I.uniforms.uVelocity,E.read.attach(0)),t.uniform1i(I.uniforms.uCurl,O.attach(1)),t.uniform1f(I.uniforms.curl,m.CURL),t.uniform1f(I.uniforms.dt,e),w(E.write),E.swap(),P.bind(),t.uniform2f(P.uniforms.texelSize,E.texelSizeX,E.texelSizeY),t.uniform1i(P.uniforms.uVelocity,E.read.attach(0)),w(D),j.bind(),t.uniform1i(j.uniforms.uTexture,k.read.attach(0)),t.uniform1f(j.uniforms.value,m.PRESSURE),w(k.write),k.swap(),L.bind(),t.uniform2f(L.uniforms.texelSize,E.texelSizeX,E.texelSizeY),t.uniform1i(L.uniforms.uDivergence,D.attach(0));for(let e=0;e<m.PRESSURE_ITERATIONS;e++)t.uniform1i(L.uniforms.uPressure,k.read.attach(1)),w(k.write),k.swap();R.bind(),t.uniform2f(R.uniforms.texelSize,E.texelSizeX,E.texelSizeY),t.uniform1i(R.uniforms.uPressure,k.read.attach(0)),t.uniform1i(R.uniforms.uVelocity,E.read.attach(1)),w(E.write),E.swap(),N.bind(),t.uniform2f(N.uniforms.texelSize,E.texelSizeX,E.texelSizeY),_.supportLinearFiltering||t.uniform2f(N.uniforms.dyeTexelSize,E.texelSizeX,E.texelSizeY);let n=E.read.attach(0);t.uniform1i(N.uniforms.uVelocity,n),t.uniform1i(N.uniforms.uSource,n),t.uniform1f(N.uniforms.dt,e),t.uniform1f(N.uniforms.dissipation,m.VELOCITY_DISSIPATION),w(E.write),E.swap(),_.supportLinearFiltering||t.uniform2f(N.uniforms.dyeTexelSize,T.texelSizeX,T.texelSizeY),t.uniform1i(N.uniforms.uVelocity,E.read.attach(0)),t.uniform1i(N.uniforms.uSource,T.read.attach(1)),t.uniform1f(N.uniforms.dissipation,m.DENSITY_DISSIPATION),w(T.write),T.swap()}function q(){t.bindFramebuffer(t.FRAMEBUFFER,null),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}function Se(e){q(),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),Ce(e)}function Ce(e){let n=e==null?t.drawingBufferWidth:e.width,r=e==null?t.drawingBufferHeight:e.height;z.bind(),m.SHADING&&t.uniform2f(z.uniforms.texelSize,1/n,1/r),t.uniform1i(z.uniforms.uTexture,T.read.attach(0)),w(e)}function we(e){let t=e.deltaX*m.SPLAT_FORCE,n=e.deltaY*m.SPLAT_FORCE;Ee(e.texcoordX,e.texcoordY,t,n,e.color)}function Te(e){let t=J();t.r*=2.5,t.g*=2.5,t.b*=2.5;let n=10*(Math.random()-.5),r=30*(Math.random()-.5);Ee(e.texcoordX,e.texcoordY,n,r,t)}function Ee(n,r,i,a,o){M.bind(),t.uniform1i(M.uniforms.uTarget,E.read.attach(0)),t.uniform1f(M.uniforms.aspectRatio,e.width/e.height),t.uniform2f(M.uniforms.point,n,r),t.uniform3f(M.uniforms.color,i,a,0),t.uniform1f(M.uniforms.radius,De(m.SPLAT_RADIUS/100)),w(E.write),E.swap(),t.uniform1i(M.uniforms.uTarget,T.read.attach(0)),t.uniform3f(M.uniforms.color,o.r,o.g,o.b),w(T.write),T.swap()}function De(t){let n=e.width/e.height;return n>1&&(t*=n),t}function Oe(t,n,r,i){t.id=n,t.down=!0,t.moved=!1,t.texcoordX=r/e.width,t.texcoordY=1-i/e.height,t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.deltaX=0,t.deltaY=0,t.color=J()}function ke(t,n,r,i){t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.texcoordX=n/e.width,t.texcoordY=1-r/e.height,t.deltaX=Ae(t.texcoordX-t.prevTexcoordX),t.deltaY=je(t.texcoordY-t.prevTexcoordY),t.moved=Math.abs(t.deltaX)>0||Math.abs(t.deltaY)>0,t.color=i}function Ae(t){let n=e.width/e.height;return n<1&&(t*=n),t}function je(t){let n=e.width/e.height;return n>1&&(t/=n),t}function Me(e){let t=e.replace(`#`,``);t.length===3&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]);let n=parseInt(t.slice(0,2),16)/255,r=parseInt(t.slice(2,4),16)/255,i=parseInt(t.slice(4,6),16)/255;return{r:n*.15,g:r*.15,b:i*.15}}function J(){if(!m.RAINBOW_MODE)return Me(m.COLOR);let e=Ne(Math.random(),.65,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function Ne(e,t,n){let r,i,a,o=Math.floor(e*6),s=e*6-o,c=n*(1-t),l=n*(1-s*t),u=n*(1-(1-s)*t);switch(o%6){case 0:r=n,i=u,a=c;break;case 1:r=l,i=n,a=c;break;case 2:r=c,i=n,a=u;break;case 3:r=c,i=l,a=n;break;case 4:r=u,i=c,a=n;break;case 5:r=n,i=c,a=l;break;default:break}return{r,g:i,b:a}}function Pe(e,t,n){let r=n-t;return r===0?t:(e-t)%r+t}function Fe(e){let n=t.drawingBufferWidth/t.drawingBufferHeight;n<1&&(n=1/n);let r=Math.round(e),i=Math.min(Math.round(e*n),1536);return t.drawingBufferWidth>t.drawingBufferHeight?{width:i,height:r}:{width:r,height:i}}function Y(e){let t=Math.min(window.devicePixelRatio||1,1.5);return Math.floor(e*t)}function Ie(e){if(e.length===0)return 0;let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t|=0;return t}let X=null,Z=!1,Q={passive:!0,signal:u.signal};function Le(){!n||document.hidden||(i=performance.now(),e.style.opacity=`1`,r===null&&(W=Date.now(),r=requestAnimationFrame(_e)))}function Re(e){if(!e.isPrimary||!n||document.hidden||e.pointerType!==`mouse`&&X!==e.pointerId)return;K()&&(B(),Z=!1);let t=Y(e.clientX),r=Y(e.clientY),a=h[0];!Z||performance.now()-i>2800?(Oe(a,e.pointerId,t,r),Z=!0,Te(a)):ke(a,t,r,a.color),Le()}function ze(e){if(!e.isPrimary||e.button!==0||!n||document.hidden)return;K()&&B(),X=e.pointerId,Z=!0;let t=h[0];Oe(t,e.pointerId,Y(e.clientX),Y(e.clientY)),Te(t),Le()}function $(e){e&&e.type===`pointerout`&&e.relatedTarget!==null||(Z=!1,X=null,h[0].moved=!1,h[0].down=!1)}function Be(){$(),document.hidden&&r!==null&&(cancelAnimationFrame(r),r=null),q()}function Ve(){K()&&B(),$(),q()}return window.addEventListener(`pointermove`,Re,Q),window.addEventListener(`pointerdown`,ze,Q),window.addEventListener(`pointerup`,$,Q),window.addEventListener(`pointercancel`,$,Q),window.addEventListener(`pointerout`,$,Q),window.addEventListener(`blur`,$,Q),window.addEventListener(`resize`,Ve,Q),document.addEventListener(`visibilitychange`,Be,Q),e.addEventListener(`webglcontextlost`,f,Q),q(),f}catch(e){throw f(),e}}var a=n();function o(){let e=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let t=e.current;if(!t)return;let n=window.matchMedia(`(prefers-reduced-motion: reduce)`),r=window.matchMedia(`print`),a;function o(){if(a?.(),a=void 0,!(n.matches||r.matches))try{a=i(t)}catch{t&&(t.style.opacity=`0`)}}return o(),n.addEventListener(`change`,o),r.addEventListener(`change`,o),()=>{n.removeEventListener(`change`,o),r.removeEventListener(`change`,o),a?.()}},[]),(0,a.jsx)(`canvas`,{ref:e,className:`splash-cursor`,"aria-hidden":`true`})}export{o as default};