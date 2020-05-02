import Controller from '@ember/controller';
import { set } from '@ember/object';

import { Color, Vector3 } from 'three';
import { TimelineLite } from 'gsap';
import Engine from 'my-portfolio/utils/engine';
import LineGenerator from 'my-portfolio/objects/LineGenerator';
import Stars from 'my-portfolio/objects/Stars';
import getRandomFloat from 'my-portfolio/utils/getRandomFloat';

export default class ApplicationController extends Controller {
  constructor() {
    super(...arguments);
    
    class CustomEngine extends Engine {
      constructor(props) {
        super(window.innerWidth, window.innerHeight, props);

        // Put automaticaly the canvas in background
        this.dom.style.position = 'absolute';
        this.dom.style.top = '0';
        this.dom.style.left = '0';
        this.dom.style.zIndex = '-1';

        this.dom.style.width = '100vw';
        this.dom.style.height = window.innerHeight;
        document.body.appendChild(this.dom);
    
        this.resize = this.resize.bind(this);
    
        window.addEventListener('resize', this.resize);
        window.addEventListener('orientationchange', this.resize);
        this.resize();

        const cameraAmpl = { x: 2, y: 3 };
        const velocity = 0.05;
        const lookAt = new Vector3()
        this.cameraAmpl = cameraAmpl;
        this.cameraVelocity = velocity;
        this.lookAt = lookAt;

        this.mousePosition = { x: 0, y: 0 };
        this.normalizedOrientation = new Vector3();

        this.update = this.update.bind(this);
      }

      resize() {
        super.resize(window.innerWidth, window.innerHeight);
      }

      update() {
        super.update();

        this.camera.position.x += (this.normalizedOrientation.x - this.camera.position.x) * this.cameraVelocity;
        this.camera.position.y += (this.normalizedOrientation.y - this.camera.position.y) * this.cameraVelocity;
        this.camera.lookAt(this.lookAt);
      }
    }

    const engine = new CustomEngine();

    const STATIC_PROPS = {
      width: 0.05,
      nbrOfPoints: 1,
      turbulence: new Vector3(),
      orientation: new Vector3(-1, -1, 0),
      color: new Color('#e6e0e3'),
    };
    
    class CustomLineGenerator extends LineGenerator {
      addLine() {
        super.addLine({
          length: getRandomFloat(5, 10),
          visibleLength: getRandomFloat(0.05, 0.2),
          speed: getRandomFloat(0.01, 0.02),
          position: new Vector3(
            getRandomFloat(-4, 8),
            getRandomFloat(-3, 5),
            getRandomFloat(-2, 5),
          ),
        });
      }
    }
    const lineGenerator = new CustomLineGenerator({ frequency: 0.04 }, STATIC_PROPS);
    engine.add(lineGenerator);
    set(this, 'lineGenerator', lineGenerator);

    const stars = new Stars();
    engine.add(stars);

    engine.start();

    const tlShow = new TimelineLite({ delay: 0.2, onStart: () => {}});
    set(this, 'tlShow', tlShow);
    
    tlShow.to('.overlay', 2, { opacity: 0 });
    tlShow.to('.background', 2, { y: -300 }, 0);
    tlShow.fromTo(engine.lookAt, 2, { y: -8 }, { y: 0, ease: Power2.easeOut }, 0);
  }
}