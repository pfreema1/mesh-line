import WebGLView from './webgl/WebGLView';
import Audio from './audio/Audio';

export default class App {

	constructor() {

	}

	init() {
		this.initWebGL();
		this.initAudio();
		this.addListeners();
		this.animate();
		this.resize();
	}

	initAudio() {
		this.audio = new Audio(this.webgl);
	}

	initWebGL() {
		this.webgl = new WebGLView(this);
		document.querySelector('.container').appendChild(this.webgl.renderer.domElement);
	}

	addListeners() {
		this.handlerAnimate = this.animate.bind(this);

		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('keyup', this.keyup.bind(this));
	}

	animate() {
		this.update();
		this.draw();

		this.raf = requestAnimationFrame(this.handlerAnimate);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (this.webgl) this.webgl.update();
	}

	draw() {
		if (this.webgl) this.webgl.draw();
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (this.webgl) this.webgl.resize();
	}

	keyup(e) {

		// r
		if (e.keyCode == 82) { if (this.webgl.trackball) this.webgl.trackball.reset(); }
	}
}
