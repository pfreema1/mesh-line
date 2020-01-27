import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';


export default class RenderTri {
    constructor(bgScene) {
        this.bgScene = bgScene;
        this.numLines = 300;

        this.init();
    }

    async init() {
        await this.loadTexture();
        this.createLines();
        this.setupAnimTriggers();
        this.setupKeys();

    }

    setupAnimTriggers() {
        this.speedMult = {
            value: 1.0
        };


    }

    triggerBgTween() {
        TweenMax.fromTo(document.body.style, 0.5, {
            'backgroundColor': '#541B95'
        }, {
            'backgroundColor': '#181329'
        })
    }

    triggerSpin() {
        TweenMax.fromTo(this.speedMult, 1.0, {
            value: 8.0,
            ease: Power4.easeOut
        }, {
            value: 1.0
        })
    }

    setupKeys() {


        document.addEventListener('keydown', (e) => {
            if (e.keyCode == 32) {
                // left

            } else if (e.keyCode == 38) {
                // up
                console.log('positive z');
            } else if (e.keyCode == 39) {
                // right
                console.log('positive x')
            } else if (e.keyCode == 40) {
                // down
                console.log('negative z');
            }
        });
    }

    lerpColor(a, b, amount) {
        const ar = a >> 16,
            ag = a >> 8 & 0xff,
            ab = a & 0xff,

            br = b >> 16,
            bg = b >> 8 & 0xff,
            bb = b & 0xff,

            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

        return (rr << 16) + (rg << 8) + (rb | 0);
    }

    createLines() {
        this.meshes = [];
        const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
        const radiusVal = {
            min: 0.05,
            max: 1.5
        };
        const speedVal = {
            min: -0.02,
            max: 0.02
        };
        const widthVal = {
            min: 0.01,
            max: 0.2
        };
        const baseColors = [
            0xFFED28,
            0xFF2F54,
            0x471898,
            0x18132A
        ];
        const colors = [
            this.lerpColor(baseColors[0], baseColors[1], 0.0),
            this.lerpColor(baseColors[0], baseColors[1], 0.25),
            this.lerpColor(baseColors[0], baseColors[1], 0.5),
            this.lerpColor(baseColors[0], baseColors[1], 0.75),
            this.lerpColor(baseColors[0], baseColors[1], 1.0),
            this.lerpColor(baseColors[1], baseColors[2], 0.0),
            this.lerpColor(baseColors[1], baseColors[2], 0.25),
            this.lerpColor(baseColors[1], baseColors[2], 0.5),
            this.lerpColor(baseColors[1], baseColors[2], 0.75),
            this.lerpColor(baseColors[1], baseColors[2], 1.0),
            this.lerpColor(baseColors[2], baseColors[3], 0.0),
            this.lerpColor(baseColors[2], baseColors[3], 0.25),
            this.lerpColor(baseColors[2], baseColors[3], 0.5),
            this.lerpColor(baseColors[2], baseColors[3], 0.75),
            this.lerpColor(baseColors[2], baseColors[3], 1.0),
        ];

        for (let i = 0; i < this.numLines; i++) {
            const geometry = new THREE.Geometry();
            let r = Math.random() * radiusVal.max + radiusVal.min;
            let speed = this.returnSpeed(speedVal);

            let width = THREE.Math.mapLinear(Math.random(), 0, 1, widthVal.min, widthVal.max);
            let colorNum = Math.floor(THREE.Math.mapLinear(r, radiusVal.min, radiusVal.max, 0, colors.length)) + ~~this.randomInRange(-5, 5);
            colorNum = THREE.Math.clamp(colorNum, 0, colors.length - 1);

            for (let i = 0; i < Math.PI * 0.5; i += 2 * Math.PI / 50) {
                let v = new THREE.Vector3(r * Math.cos(i), r * Math.sin(i), 0);
                geometry.vertices.push(v);
            }

            const line = new MeshLine();
            line.setGeometry(geometry);

            const material = new MeshLineMaterial({
                map: this.strokeTexture,
                useMap: true,
                // color: new THREE.Color(colors[~~this.randomInRange(0, colors.length)]),
                color: new THREE.Color(colors[colorNum]),
                lineWidth: width,
                transparent: true,
                depthTest: false,
                opacity: 0.5,
                resolution: resolution,
                // blending: THREE.AdditiveBlending
            });

            const mesh = new THREE.Mesh(line.geometry, material);
            mesh.speed = speed;
            this.meshes.push(mesh);

            this.bgScene.add(mesh);
        }
    }

    returnSpeed(speedVal) {
        let val = THREE.Math.mapLinear(Math.random(), 0, 1, speedVal.min, speedVal.max);

        if (val < 0.001 && val > -0.001) {
            val += 0.003;
        }

        return val;
    }

    loadTexture() {
        return new Promise((res, rej) => {
            let loader = new THREE.TextureLoader();

            loader.load('./stroke.png', (texture) => {
                this.strokeTexture = texture;
                res();
            })
        });
    }

    randomInRange(min, max) {
        return min + Math.random() * (max - min);
    }

    update() {
        if (this.meshes) {

            for (let i = 0; i < this.numLines; i++) {
                this.meshes[i].rotation.z += this.meshes[i].speed * this.speedMult.value;
            }
        }
    }
}