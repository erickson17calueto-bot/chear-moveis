/* ============================================================
   CHEAR INVESTMENT — Esfera 3D WebGL
   Elemento fixo que viaja pelas secções ao scroll, com rasto
   de luz dourada, hover-reactivo (sem clique) e drag opcional.
   Sem dependências externas.
   ============================================================ */
(function () {
    'use strict';

    var container = document.getElementById('sphere-container');
    var glow      = document.getElementById('sphere-glow');
    var canvas    = document.getElementById('sphere-canvas');
    if (!container || !canvas) return;

    var gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) { container.style.display = 'none'; if (glow) glow.style.display = 'none'; return; }

    /* ================================================================
       SHADERS
    ================================================================ */
    var VS = [
        'precision highp float;',
        'attribute vec3 aPos;',
        'uniform mat4 uProj;',
        'uniform mat4 uMV;',
        'uniform float uTime;',
        'uniform float uStr;',
        'uniform float uDen;',

        /* ---- Simplex 3D noise (Ashima Arts / Ian McEwan) ---- */
        'vec3 m289v3(vec3 x){return x-floor(x*(1./289.))*289.;}',
        'vec4 m289v4(vec4 x){return x-floor(x*(1./289.))*289.;}',
        'vec4 perm(vec4 x){return m289v4(((x*34.)+1.)*x);}',
        'vec4 tIS(vec4 r){return 1.79284291400159-0.85373472095314*r;}',
        'float sn(vec3 v){',
        '  const vec2 C=vec2(1./6.,1./3.);',
        '  const vec4 D=vec4(0.,.5,1.,2.);',
        '  vec3 i=floor(v+dot(v,C.yyy));',
        '  vec3 x0=v-i+dot(i,C.xxx);',
        '  vec3 g=step(x0.yzx,x0.xyz);',
        '  vec3 l=1.-g;',
        '  vec3 i1=min(g.xyz,l.zxy);',
        '  vec3 i2=max(g.xyz,l.zxy);',
        '  vec3 x1=x0-i1+C.xxx;',
        '  vec3 x2=x0-i2+C.yyy;',
        '  vec3 x3=x0-D.yyy;',
        '  i=m289v3(i);',
        '  vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));',
        '  float n_=0.142857142857;',
        '  vec3 ns=n_*D.wyz-D.xzx;',
        '  vec4 j=p-49.*floor(p*ns.z*ns.z);',
        '  vec4 x_=floor(j*ns.z);',
        '  vec4 y_=floor(j-7.*x_);',
        '  vec4 x=x_*ns.x+ns.yyyy;',
        '  vec4 y=y_*ns.x+ns.yyyy;',
        '  vec4 h=1.-abs(x)-abs(y);',
        '  vec4 b0=vec4(x.xy,y.xy);',
        '  vec4 b1=vec4(x.zw,y.zw);',
        '  vec4 s0=floor(b0)*2.+1.;',
        '  vec4 s1=floor(b1)*2.+1.;',
        '  vec4 sh=-step(h,vec4(0.));',
        '  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;',
        '  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;',
        '  vec3 p0=vec3(a0.xy,h.x);',
        '  vec3 p1=vec3(a0.zw,h.y);',
        '  vec3 p2=vec3(a1.xy,h.z);',
        '  vec3 p3=vec3(a1.zw,h.w);',
        '  vec4 norm=tIS(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));',
        '  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;',
        '  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);',
        '  m=m*m;',
        '  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));',
        '}',
        /* ---- Main ---- */
        'void main(){',
        '  vec3 n=normalize(aPos);',
        '  float noise=sn(n*uDen+uTime);',
        '  vec3 pos=aPos+n*noise*uStr;',
        '  gl_Position=uProj*uMV*vec4(pos,1.);',
        '}'
    ].join('\n');

    var FS = [
        'precision mediump float;',
        'uniform vec3 uCol;',
        'uniform float uAlpha;',
        'void main(){gl_FragColor=vec4(uCol,uAlpha);}'
    ].join('\n');

    function compile(type, src) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.warn('[sphere] shader error:', gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }

    var vs = compile(gl.VERTEX_SHADER, VS);
    var fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { container.style.display = 'none'; return; }

    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn('[sphere] link error:', gl.getProgramInfoLog(prog));
        container.style.display = 'none'; return;
    }
    gl.useProgram(prog);

    var loc = {
        aPos  : gl.getAttribLocation(prog, 'aPos'),
        uProj : gl.getUniformLocation(prog, 'uProj'),
        uMV   : gl.getUniformLocation(prog, 'uMV'),
        uTime : gl.getUniformLocation(prog, 'uTime'),
        uStr  : gl.getUniformLocation(prog, 'uStr'),
        uDen  : gl.getUniformLocation(prog, 'uDen'),
        uCol  : gl.getUniformLocation(prog, 'uCol'),
        uAlpha: gl.getUniformLocation(prog, 'uAlpha')
    };

    /* ================================================================
       GEOMETRIA — esfera UV wireframe (56 lon × 36 lat)
    ================================================================ */
    var W = 56, H = 36;
    var verts = [], idx = [];

    for (var j = 0; j <= H; j++) {
        for (var i = 0; i <= W; i++) {
            var phi   = (j / H) * Math.PI;
            var theta = (i / W) * Math.PI * 2;
            verts.push(
                Math.sin(phi) * Math.cos(theta),
                Math.cos(phi),
                Math.sin(phi) * Math.sin(theta)
            );
        }
    }
    for (var j = 0; j <= H; j++)
        for (var i = 0; i < W; i++)
            idx.push(j * (W + 1) + i, j * (W + 1) + i + 1);
    for (var j = 0; j < H; j++)
        for (var i = 0; i <= W; i++)
            idx.push(j * (W + 1) + i, (j + 1) * (W + 1) + i);

    var vbuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    var ibuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);

    var IC = idx.length;

    /* ================================================================
       MATRIZES 4×4 (column-major)
    ================================================================ */
    function mPersp(fov, asp, n, f) {
        var t = 1 / Math.tan(fov * 0.5), nf = 1 / (n - f);
        return new Float32Array([
            t/asp, 0, 0, 0,
            0,     t, 0, 0,
            0,     0, (f + n) * nf, -1,
            0,     0, 2 * f * n * nf, 0
        ]);
    }
    function mMul(a, b) {
        var o = new Float32Array(16);
        for (var c = 0; c < 4; c++)
            for (var r = 0; r < 4; r++) {
                var s = 0;
                for (var k = 0; k < 4; k++) s += a[r + k*4] * b[k + c*4];
                o[r + c*4] = s;
            }
        return o;
    }
    function mTrans(x, y, z) { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]); }
    function mRX(a) { var c=Math.cos(a),s=Math.sin(a); return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]); }
    function mRY(a) { var c=Math.cos(a),s=Math.sin(a); return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]); }
    function mScale(s) { return new Float32Array([s,0,0,0, 0,s,0,0, 0,0,s,0, 0,0,0,1]); }

    function lerp(a, b, t) { return a + (b - a) * t; }
    function smooth(t) { return t * t * (3 - 2 * t); }

    /* ================================================================
       WAYPOINTS — a esfera viaja de secção em secção, sempre nas
       zonas escuras laterais (nunca sobre texto central)
       xF: fração da largura do viewport (+ direita / − esquerda)
       sF: escala | aF: opacidade do wireframe | gF: opacidade do rasto
    ================================================================ */
    /* hero: direita | grupo: canto inf-esq | empresas: canto sup-dir
       faq: esquerda | stats: canto sup-dir | visão: esquerda
       fundador: canto inf-dir | contacto: canto inf-esq */
    var xF = [ 0.28, -0.38,  0.40, -0.42,  0.40, -0.40,  0.42, -0.40];
    var yF = [-0.06,  0.20, -0.25,  0.05, -0.25,  0.00,  0.32,  0.30]; // fração da altura
    var sF = [ 0.95,  0.45,  0.44,  0.40,  0.38,  0.46,  0.34,  0.36];
    var aF = [ 0.80,  0.50,  0.46,  0.46,  0.42,  0.50,  0.44,  0.44];
    var gF = [ 0.90,  0.60,  0.58,  0.55,  0.50,  0.62,  0.52,  0.52];

    var sections = [];
    var centers  = [];

    function measure() {
        sections = Array.prototype.slice.call(document.querySelectorAll('main > section'));
        centers = sections.map(function (el) {
            var top = 0, node = el;
            while (node) { top += node.offsetTop; node = node.offsetParent; }
            return top + el.offsetHeight / 2;
        });
    }
    measure();
    window.addEventListener('load', measure);

    /* Posição fraccionária entre waypoints, guiada pelo centro do viewport */
    function waypointPos() {
        var n = Math.min(centers.length, xF.length);
        if (n < 2) return 0;
        var yc = window.scrollY + window.innerHeight * 0.5;
        if (yc <= centers[0]) return 0;
        if (yc >= centers[n - 1]) return n - 1;
        for (var i = 0; i < n - 1; i++) {
            if (yc < centers[i + 1]) {
                var t = (yc - centers[i]) / (centers[i + 1] - centers[i]);
                return i + smooth(Math.max(0, Math.min(1, t)));
            }
        }
        return n - 1;
    }

    function wp(arr, p) {
        var i = Math.floor(p), t = p - i;
        var j = Math.min(i + 1, arr.length - 1);
        return lerp(arr[i], arr[j], t);
    }

    /* ================================================================
       ESTADO
    ================================================================ */
    var time = 0, lastTS = 0;
    var rotX = 0.35, rotY = 0.0, tRotX = 0.35, tRotY = 0.0;
    var posX = 0, posY = 0;           // posição suavizada (px, offset do centro)
    var glowX = 0, glowY = 0;         // rasto de luz — segue com atraso
    var dragX = 0, dragY = 0, tDragX = 0, tDragY = 0;
    var curAlpha = 0.78, curScale = 1, curGlow = 0.85;
    var isDrag = false, lx = 0, ly = 0;
    var hovering = false;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ================================================================
       RESIZE
    ================================================================ */
    function resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width  = (canvas.offsetWidth  || 1) * dpr;
        canvas.height = (canvas.offsetHeight || 1) * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
        measure();
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    /* ================================================================
       INTERACTIVIDADE
       — Hover: basta passar o cursor sobre a esfera (sem clicar)
       — Drag: clicar e arrastar desloca-a, com retorno suave
    ================================================================ */
    function inSphere(cx, cy) {
        var r = container.getBoundingClientRect();
        // círculo inscrito, ligeiramente maior para hover generoso
        var rx = r.left + r.width / 2, ry = r.top + r.height / 2;
        var rad = Math.max(r.width, r.height) * 0.5;
        var dx = cx - rx, dy = cy - ry;
        return (dx * dx + dy * dy) <= rad * rad * 1.1;
    }

    window.addEventListener('mousemove', function (e) {
        var inside = inSphere(e.clientX, e.clientY);

        if (isDrag) {
            var dx = e.clientX - lx, dy = e.clientY - ly;
            tRotY += dx * 0.008;
            tRotX  = Math.max(-1.4, Math.min(1.4, tRotX + dy * 0.008));
            tDragX = Math.max(-90, Math.min(90, tDragX + dx * 0.40));
            tDragY = Math.max(-70, Math.min(70, tDragY + dy * 0.40));
            lx = e.clientX; ly = e.clientY;
            return;
        }

        if (inside) {
            if (hovering) {
                // hover em movimento → a esfera roda a seguir o cursor
                var hdx = e.clientX - lx, hdy = e.clientY - ly;
                tRotY += hdx * 0.005;
                tRotX  = Math.max(-1.4, Math.min(1.4, tRotX + hdy * 0.005));
                // deriva subtil na direcção do cursor
                var r = container.getBoundingClientRect();
                var nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
                var ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
                tDragX = nx * 26;
                tDragY = ny * 20;
            }
            hovering = true;
            lx = e.clientX; ly = e.clientY;
        } else if (hovering) {
            hovering = false;
            tDragX = 0; tDragY = 0; // regressa suavemente
        }
    });

    window.addEventListener('mousedown', function (e) {
        if (e.target.closest('a,button,input,textarea')) return;
        if (inSphere(e.clientX, e.clientY)) {
            isDrag = true; lx = e.clientX; ly = e.clientY;
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        }
    });

    function endDrag() {
        if (!isDrag) return;
        isDrag = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        tDragX = 0; tDragY = 0;
    }
    window.addEventListener('mouseup', endDrag);

    window.addEventListener('touchstart', function (e) {
        var t = e.touches[0];
        if (inSphere(t.clientX, t.clientY)) { isDrag = true; lx = t.clientX; ly = t.clientY; }
    }, { passive: true });
    window.addEventListener('touchmove', function (e) {
        if (!isDrag) return;
        var t = e.touches[0];
        var dx = t.clientX - lx, dy = t.clientY - ly;
        tRotY += dx * 0.008;
        tRotX  = Math.max(-1.4, Math.min(1.4, tRotX + dy * 0.008));
        tDragX = Math.max(-90, Math.min(90, tDragX + dx * 0.40));
        tDragY = Math.max(-70, Math.min(70, tDragY + dy * 0.40));
        lx = t.clientX; ly = t.clientY;
    }, { passive: true });
    window.addEventListener('touchend', endDrag);

    /* ================================================================
       LOOP DE RENDER
    ================================================================ */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function render(ts) {
        requestAnimationFrame(render);

        var dt = Math.min((ts - lastTS) * 0.001, 0.05);
        lastTS = ts;
        time += dt;

        /* Alvos de posição a partir dos waypoints da secção actual */
        var p = waypointPos();
        var vw = window.innerWidth, vh = window.innerHeight;
        var tX = wp(xF, p) * vw;
        var tY = wp(yF, p) * vh;
        var tS = wp(sF, p);
        var tA = wp(aF, p);
        var tG = wp(gF, p);

        var easeP = reduced ? 1 : 0.055;
        var easeR = reduced ? 1 : 0.09;
        var easeD = reduced ? 1 : 0.07;

        if (!isDrag && !reduced) tRotY += 0.0022; // movimento contínuo, sem interacção

        posX  = lerp(posX,  tX, easeP);
        posY  = lerp(posY,  tY, easeP);
        rotX  = lerp(rotX,  tRotX,  easeR);
        rotY  = lerp(rotY,  tRotY,  easeR);
        dragX = lerp(dragX, tDragX, easeD);
        dragY = lerp(dragY, tDragY, easeD);
        curScale = lerp(curScale, tS, easeP);
        curAlpha = lerp(curAlpha, tA, easeP);
        curGlow  = lerp(curGlow,  tG, easeP);

        /* Rasto de luz — segue a esfera com atraso maior (deixa luz para trás) */
        glowX = lerp(glowX, posX + dragX, reduced ? 1 : 0.022);
        glowY = lerp(glowY, posY + dragY, reduced ? 1 : 0.022);

        container.style.transform =
            'translate3d(' + (posX + dragX).toFixed(1) + 'px,' + (posY + dragY).toFixed(1) + 'px,0)';

        if (glow) {
            glow.style.transform =
                'translate3d(' + glowX.toFixed(1) + 'px,' + glowY.toFixed(1) + 'px,0) scale(' + (curScale * 1.15).toFixed(3) + ')';
            glow.style.opacity = curGlow.toFixed(3);
        }

        /* Canvas size check */
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var cw = (canvas.offsetWidth  * dpr) | 0;
        var ch = (canvas.offsetHeight * dpr) | 0;
        if (canvas.width !== cw || canvas.height !== ch) {
            canvas.width = cw; canvas.height = ch;
            gl.viewport(0, 0, cw, ch);
        }
        var asp = canvas.width / Math.max(canvas.height, 1);

        /* Flutuação vertical subtil */
        var bob = reduced ? 0 : Math.sin(time * 0.6) * 0.06;

        var proj = mPersp(1.05, asp, 0.1, 100);
        var mv   = mMul(mTrans(0, bob, -3.3),
                   mMul(mScale(curScale),
                   mMul(mRY(rotY), mRX(rotX))));

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(prog);
        gl.uniformMatrix4fv(loc.uProj, false, proj);
        gl.uniformMatrix4fv(loc.uMV,   false, mv);
        gl.uniform1f(loc.uTime,  time * 0.32);
        gl.uniform1f(loc.uStr,   0.22);
        gl.uniform1f(loc.uDen,   1.85);
        gl.uniform3f(loc.uCol,   0.988, 0.639, 0.067); /* #FCA311 */
        gl.uniform1f(loc.uAlpha, curAlpha);

        gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
        gl.enableVertexAttribArray(loc.aPos);
        gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
        gl.drawElements(gl.LINES, IC, gl.UNSIGNED_SHORT, 0);
    }

    requestAnimationFrame(render);

}());
