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

// converts 2D array to CSV and downloads it
function arrayToCSV(arr) {
    let csvContent = 'data:text/csv;charset=utf-8,';
    arr.forEach(row => {
        csvContent += row.join(',') + '\r\n';
    });

    const URI  = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', URI);
    link.setAttribute('download', 'dataset.csv');
    document.body.appendChild(link);
    link.click();
}

window.addEventListener('load', () => {
    const display  = document.querySelector('#display');
    const canvas   = document.querySelector('#canvas');
    const ctx      = canvas.getContext('2d');
    const startBtn = document.querySelector('#start');
    const stopBtn  = document.querySelector('#stop');
    const HEIGHT   = 100;
    const WIDTH    = 100;

    let dataset = [];
    let recordInterval;

    // write webcam to #display
    navigator.getUserMedia({video: { width: WIDTH, height: HEIGHT }},
        stream => display.srcObject = stream,
        err => alert('Something went terribly wrong! :('));

    startBtn.addEventListener('click', () => {
        // starts writing webcam to dataset @ 30fps
        recordInterval = setInterval(() => {
            ctx.drawImage(display, 0, 0, WIDTH, HEIGHT);
            const image      = ctx.getImageData(0, 0, WIDTH, HEIGHT);
            const grayscaled = grayscale(image);
            const channel    = channelToArray(grayscaled, 0);

            dataset.push(channel);
            console.log(channel);

            ctx.putImageData(grayscaled, 0, 0);
        }, 1000 / 30);
    });

    stopBtn.addEventListener('click', () => {
        // stops writing webcam to datset and downloads dataset as CSV
        clearInterval(recordInterval);
        arrayToCSV(dataset);
    });
});