const THREE = require('three');
const $ = require('jquery');
const state = {};

const vertexShader = `
varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const splitFragmentShader = `
varying vec2 vUV;
uniform sampler2D tex;

void main() {
  gl_FragColor = texture2D(tex, vUV);
}

`;

function getRT(width, height, fragmentShader) {
  const r1 = {};
  r1.rt = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      //minFilter: THREE.NearestFilter,
      //magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
  });
  r1.scene = new THREE.Scene();
  r1.geo = new THREE.PlaneBufferGeometry(2, 2);
  r1.uniforms = {
      "time": { value: 1.0 },
      "aspect": { value: width / height },
      "frameCounter": { value: 0 },
      "tex": { value: null },
      "res": { value: new THREE.Vector2(width, height) }
  };
  r1.material = new THREE.ShaderMaterial({
      uniforms: r1.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
  });
  r1.mesh = new THREE.Mesh(r1.geo, r1.material);
  r1.scene.add(r1.mesh);

  return r1;
}

function init() {
    const width = window.innerWidth;
    const height = width; // window.innerHeight;
    container = document.getElementById('container');
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    scene = new THREE.Scene();

    state.frameCounter = 0;

    state.r1 = getRT(width, height, splitFragmentShader);

    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    uniforms = {
        "time": { value: 1.0 },
        "aspect": { value: width / height },
        "res": { value: new THREE.Vector2(width, height) },
        "tex": { value: state.r1.rt.texture}
    };
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.getContext().getExtension("OES_texture_float");
    renderer.getContext().getExtension("OES_texture_float_linear");
    container.appendChild(renderer.domElement);
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
    renderer.setSize(width, height);
    renderer.domElement.width = width;
    renderer.domElement.height = height;
    state.width = width;
    state.height = height;
}

$(init);