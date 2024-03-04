
var navbar = document.getElementById("navbar");

var modal = document.getElementById("contactModal");

var btn = document.getElementById("contactLink");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  gsap.to(modal, {autoAlpha: 1, scale: 1, duration: 1});
}

span.onclick = function() {
  gsap.to(modal, {autoAlpha: 0, scale: 0.8, duration: 1});
}

window.onclick = function(event) {
  if (event.target == modal) {
    gsap.to(modal, {autoAlpha: 0, scale: 0.8, duration: 1});
  }
}

function App() {
  const conf = {
    nx: 40,
    ny: 100,
    cscale: chroma.scale(['red', '#B22222', '#7B3F00', '#404040', '#1C1C1C', '#000000']).mode('lch'),
    darken: -1,
    angle: Math.PI / 3,
    timeCoef: 0.1
  };

  let renderer, scene, camera;
  let width, height;
  const { randFloat: rnd } = THREE.Math;

  const uTime = { value: 0 }, uTimeCoef = { value: conf.timeCoef };
  const polylines = [];

  init();

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
    camera = new THREE.PerspectiveCamera();

    updateSize();
    window.addEventListener('resize', updateSize, false);
    document.body.addEventListener('click', initRandomScene);

    initScene();
    requestAnimationFrame(animate);
  }
}
