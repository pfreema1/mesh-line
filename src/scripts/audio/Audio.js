/*
    starter code from here: https://codepen.io/jakealbaugh/pen/qxjPMM/
*/

import * as Tone from "tone";

export default class Audio {
    constructor(webGLView) {
        this.webGLView = webGLView;
        this.init();
    }

    async init() {
        this.userGestureFix();
        this.initTone();
    }

    initTone() {
        const synths = [
            new Tone.Synth(),
            new Tone.Synth(),
            new Tone.Synth()
        ];

        synths[0].oscillator.type = 'triangle';
        synths[1].oscillator.type = 'sine';
        synths[2].oscillator.type = 'sawtooth';

        const gain = new Tone.Gain(0.6);
        gain.toMaster();

        synths.forEach(synth => synth.connect(gain));

        const $rows = document.querySelectorAll('.sequencer-row-container');
        const notes = ['G5', 'E4', 'C3'];
        let index = 0;

        Tone.Transport.scheduleRepeat(repeat.bind(this), '8n');
        Tone.Transport.start();

        function repeat(time) {
            let step = index % 8;
            for (let i = 0; i < $rows.length; i++) {
                let synth = synths[i],
                    note = notes[i],
                    $row = $rows[i],
                    $input = $row.querySelector(`input:nth-child(${step + 1})`);

                console.log($input.checked);

                if ($input.checked) {
                    // console.log(this.webGLView);
                    if (this.webGLView) {

                        this.webGLView.lines.triggerSpin();
                    }
                    synth.triggerAttackRelease(note, '8n', time);
                }
            }
            index++;
        }
    }

    userGestureFix() {
        document.documentElement.addEventListener('mousedown', () => {
            if (Tone.context.state !== 'running') Tone.context.resume();
        });
    }
}