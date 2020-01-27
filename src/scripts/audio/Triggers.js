
export default class Triggers {
    constructor(numRows, beatSubdivision) {
        this.numRows = numRows;
        this.beatSubdivision = beatSubdivision;

        this.init();
    }

    createRowContainers() {
        this.rows = [];

        for (let i = 0; i < this.numRows; i++) {
            let rowEl = document.createElement('div');
            rowEl.classList.add('row');
            rowEl.triggers = [];
            this.rows.push(rowEl);
        }
    }

    handleTriggerClick(e) {
        e.target.data.isTriggered = !e.target.data.isTriggered;

        if (e.target.data.isTriggered) {
            e.target.classList.add('is-on');
        } else {
            e.target.classList.remove('is-on');
        }

        console.log(e.target.data);
    }

    setupClearClickHandler() {
        document.querySelector('#clear').addEventListener('click', e => {
            this.clearAllTriggers();
        });
    }

    clearAllTriggers() {
        console.log('clearing all triggers!');

        for (let i = 0; i < this.rows.length; i++) {
            for (let j = 0; j < this.rows[i].triggers.length; j++) {
                this.rows[i].triggers[j].data.isTriggered = false;
                this.rows[i].triggers[j].classList.remove('is-on');
            }
        }
    }

    createTriggers() {
        // create triggers
        for (let i = 0; i < this.numRows * this.beatSubdivision; i++) {
            let rowIndex = parseInt(i / this.beatSubdivision);
            let triggerEl = document.createElement('div');
            triggerEl.classList.add('trigger');
            triggerEl.data = {
                row: rowIndex,
                beat: i % this.beatSubdivision,
                isTriggered: false
            };

            triggerEl.addEventListener('click', this.handleTriggerClick);

            // append trigger to rowEl array
            this.rows[rowIndex].triggers.push(triggerEl);

            // append trigger to DOM
            this.rows[rowIndex].appendChild(triggerEl);
        }
    }

    addRowsToContainer() {
        for (let i = 0; i < this.numRows; i++) {
            this.containerEl.appendChild(this.rows[i]);
        }
    }

    init() {
        this.containerEl = document.createElement('div');
        this.containerEl.id = 'sequencerContainer';

        this.createRowContainers();

        this.createTriggers();

        this.addRowsToContainer();

        this.appendTriggersToDOM();

        this.setupClearClickHandler();
    }

    appendTriggersToDOM() {
        document.querySelector('.container').appendChild(this.containerEl);
    }
}