<template>
 <div>
   <div ref="container" style="height: 100%; width: 100%">
    <div ref="olBackgroundMap"
      style="position: fixed;
      display: block;
      zIndex: -10;
      visibility: hidden;
      width: 1000px;
      height: 500px;"
      />
     </div>
 </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import View from 'ol/View';
import Map from 'ol/Map';

export default {
  props: {
    indicator: Object,
    baseLayers: Array,
  },
  mounted() {
    this.initGlobe();
  },
  methods: {
    initGlobe() {
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      const { container } = this.$refs;
      // to do: fix this temporary workaround
      const width = container.parentNode.parentNode.clientWidth;
      const height = container.parentNode.parentNode.clientHeight;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0, 0, 0);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
      hemiLight.position.set(0, 100, 0);
      hemiLight.matrixAutoUpdate = false;
      hemiLight.updateMatrix();

      dirLight.position.set(3, 10, 1000);
      dirLight.castShadow = false;

      scene.add(hemiLight);
      scene.add(dirLight);

      const camera = new THREE.OrthographicCamera(
        -width / 4,
        width / 4,
        height / 4,
        -height / 4,
        1,
        1000,
      );
      camera.zoom = 0.7;
      camera.updateProjectionMatrix();

      // default is (0, 0, 100), consider this for intersections
      camera.position.set(450, 90, 100);

      const controls = new OrbitControls(camera, renderer.domElement);

      controls.enablePan = false;
      controls.enableZoom = true;
      controls.maxZoom = 3;
      controls.minZoom = 0.5;
      controls.enableDamping = false;
      controls.target.set(0, 0, 0);
      controls.update();

      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(90, 64, 64),
        new THREE.MeshPhongMaterial(),
      );

      scene.add(globe);

      this.$refs.container.appendChild(renderer.domElement);

      function animate() {
        requestAnimationFrame(() => {
          animate();
        });
        renderer.render(scene, camera);
      }
      animate();

      const baseLayers = this.baseLayers.map((l) => new TileLayer({
        extent: [-180, -90, 180, 90],
        visible: l.visible,
        className: 'olGlobeLayer',
        source: new XYZ({
          crossOrigin: 'anonymous',
          url: l.url,
        }),
      }));

      const view = new View({
        projection: 'EPSG:4326',
        extent: [-180, -90, 180, 90],
        center: [0, 0],
        zoom: 2,
      });

      const dataLayer = new TileLayer({
        opacity: this.indicator.display.opacity,
        className: 'olGlobeLayer',
        source: new XYZ({
          crossOrigin: 'anonymous',
          url: '//obs.eu-nl.otc.t-systems.com/s5p-pal-nl-l3-external/maps/s5p-l3-co/3day/2022/02/nrt-20220208-20220210-20220211/{z}/{x}/{-y}.png',
        }),
      });
      const map = new Map({
        layers: [
          ...baseLayers,
          dataLayer,
        ],
        target: this.$refs.olBackgroundMap,
        view,
      });
      const mapCanvas = document.createElement('canvas');
      map.on('rendercomplete', () => {
        const size = map.getSize();

        [mapCanvas.width, mapCanvas.height] = size;

        const mapContext = mapCanvas.getContext('2d');
        Array.prototype.forEach.call(
          // set classname `olGlobeLayer` to each layer of the globe
          document.querySelectorAll('.olGlobeLayer canvas'),
          (canvas) => {
            if (canvas.width > 0) {
              const { opacity } = canvas.parentNode.style;
              mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
              const { transform } = canvas.style;

              const matrix = transform
                .match(/^matrix\(([^(]*)\)$/)[1]
                .split(',')
                .map(Number);

              CanvasRenderingContext2D.prototype.setTransform.apply(
                mapContext,
                matrix,
              );
              mapContext.drawImage(canvas, 0, 0);
            }
          },
        );

        const texture = new THREE.CanvasTexture(mapCanvas);
        globe.material.map = texture;
        globe.material.needsUpdate = true;
      });

      let currentWidth = 1000;

      controls.addEventListener('end', () => {
        const { olBackgroundMap } = this.$refs;
        switch (Math.floor(camera.zoom)) {
          case 1:
            olBackgroundMap.style.width = '1000px';
            olBackgroundMap.style.height = '500px';
            if (currentWidth !== 1000) {
              map.updateSize();
              view.setResolution(0.36);
              currentWidth = 1000;
            }
            break;
          case 2:
            olBackgroundMap.style.width = '2000px';
            olBackgroundMap.style.height = '1000px';
            if (currentWidth !== 2000) {
              map.updateSize();
              view.setResolution(0.225);
              currentWidth = 2000;
            }
            break;
          case 3:
            olBackgroundMap.style.width = '4000px';
            olBackgroundMap.style.height = '2000px';
            if (currentWidth !== 4000) {
              map.updateSize();
              view.setResolution(0.18);
              currentWidth = 4000;
            }
            break;
          default:
            break;
        }
      });
    },
  },
};
</script>

<style>

</style>
