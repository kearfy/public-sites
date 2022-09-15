import { Rable } from './rable.js';

const app = new Rable({
    data: {
        input: '',
        output: '',

        translate() {
            this.output = this.input.replaceAll(/([a-zA-Z0-9]+)/gm, 'daap');
        }
    }
});

app.mount('#app');