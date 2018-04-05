// fethes the model using AJAX
function loadModel(net) {
    fetch('../model/model.json')
        .then(res => res.json())
        .then(json => net.fromJSON(json));

    return net;
}

// initialize and load the model
function initModel() {
    const net = new brain.NeuralNetwork({
        activation: 'sigmoid',
        hiddenLayers: [1000, 100],
        learningRate: 0.6
    });

    const model = loadModel(net);
    return model;
}

// grayscales ImageData object
function grayscale(image) {
    let pixels = image.data;
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = pixels[i + 1] = pixels[i + 2] =
        0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
    }

    return image;
}

// converts a given channel of an ImageData object to array
function channelToArray(image, channelID) {
    let pixels = image.data;
    let channel = [];

    for (let i = 0; i < pixels.length; i += 4) {
        channel.push(pixels[i + channelID]);
    }

    return channel;
}

// if obstacle -> 1 else -> 0
function predict(net, image) {
    const input = channelToArray(grayscale(image), 0);
    return net.run(input) <= 0.5;
}

window.addEventListener('load', () => {
    const display  = document.querySelector('#display');
    const canvas   = document.querySelector('#canvas');
    const ctx      = canvas.getContext('2d');
    const model    = initModel();
    const HEIGHT   = 100;
    const WIDTH    = 100;

    // write webcam to #display
    navigator.getUserMedia({video: { width: WIDTH, height: HEIGHT }},
        stream => display.srcObject = stream,
        err => alert('Something went terribly wrong! :('));

    // predict and update @ 30fps
    setInterval(() => {
        ctx.drawImage(display, 0, 0, WIDTH, HEIGHT);

        const image = ctx.getImageData(0, 0, WIDTH, HEIGHT);
        document.body.style.backgroundColor = (predict(model, image) ? 'red' : 'green'); // if obstacle -> red else -> green
    }, 1000 / 30);
});