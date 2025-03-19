export class PlayButton {
    constructor(container, initialState, onClick) {
        this.container = container;

        if (!onClick) {
            onClick = function () {};
        }

        this.onClick = onClick;
        this.bind();

        this.update(initialState !== undefined ? initialState : false);
    }

    update(isPlaying) {
        this.isPlaying = isPlaying;
        this.render();
    }

    bind() {
        this.container.onclick = () => {
            this.update(!this.isPlaying);
            this.onClick(this.isPlaying);
        }
    }

    render() {
        if (this.isPlaying) {
            this.container.innerHTML = "Pause";
        } else {
            this.container.innerHTML = "Play";
        }
    }
}
