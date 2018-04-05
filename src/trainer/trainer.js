const brain = require('brain.js');
const fs    = require('fs');

function readCSV(path) {
    const content = fs.readFileSync(path, 'utf8');
    let arr       = [];

    content.split('\n').forEach(line => {
        arr.push(line.split(',').map(n => parseInt(n, 10)));
    });

    return arr;
}

// read obstacle and no_obstacle dataset seperately and convert to brain.js format
obstacle   = readCSV('./dataset/obstacle.csv');
noObstacle = readCSV('./dataset/no_obstacle.csv');

inputData = [];
obstacle.forEach(image => inputData.push({input: image, output: [0]}));
noObstacle.forEach(image => inputData.push({input: image, output: [1]}));

// train the network
console.time('training');
const net = new brain.NeuralNetwork({
    activation: 'sigmoid',
    hiddenLayers: [1000, 100],
    learningRate: 0.6
});
net.train(inputData);
console.timeEnd('training');

// write the model
fs.writeFileSync('./model/model.json', JSON.stringify(net.toJSON()));

console.log('0 =>', net.run(obstacle[0])) // 0