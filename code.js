let cities = [];
let order = [];
let num = 0;
let popSize = 1000;
let population = [];
let recordDistance = Infinity;
let fitness = [];
let bestEver = [];
let fitness_record = 0;
let num_cities = 10;

function preload() {
    file = 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/static/0,0,1/1024x512'
            + '?access_token=pk.eyJ1Ijoiem9vbWllMTMyZSIsImEiOiJjamh3enl0dzcwM2xnM2xueXJia2xlaTliIn0.yd2puN3k_63G-UsaLxxJ6Q';
    map_img = loadImage(file);
}
function setup () {
    // frameRate(10);
    createCanvas(1024, 512);
    translate(width/2, height/2);
    imageMode(CENTER);  
    image(map_img, 0, 0);
    // frameRate(1);
}

function mouseClicked() {
    let n = createVector(mouseX - (1024/2), mouseY - (512/2));
    cities.push(n);
    order.push(num);
    // console.log(order)
    num += 1;
    if (num == num_cities) {
        // console.log('pressed 6 times')
        for (var i = 0; i < popSize; i++) {
            population[i] = shuffle(order);
        }
    }
    if (num == num_cities + 1) {
        noLoop();
    }

}

function draw() {
    // createCanvas(1024, 512);
    translate(width/2, height/2);
    imageMode(CENTER);  
    image(map_img, 0, 0);

    if ( cities.length < num_cities) {
        stroke(255, 0, 0);
        strokeWeight(1);
        // noFill();
        beginShape();
        for (let i = 0; i < cities.length; i++) {
            ellipse(cities[i].x, cities[i].y, 10,);
        }
        endShape();
    }

    if (cities.length == num_cities) {
        stroke(255);
        strokeWeight(1);
        noFill();
        beginShape();
        let temp_order = population[floor(random()*popSize)];
        // console.log(temp_order);
        for (let i = 0; i < cities.length; i++) {
            let temp_num = temp_order[i]
            ellipse(cities[i].x, cities[i].y, 10, 10);
            vertex(cities[temp_num].x, cities[temp_num].y);
        }
        endShape();
    

        fitness, recordDistance = calculateFitness(cities, population, recordDistance, fitness);
        console.log('the fitness is:')
        console.log(fitness.reduce((a, b) => a + b, 0))
        fitness = normalizeFitness(fitness);
        population = nextGeneration(population, fitness);
    
        stroke(50, 255, 50);
        strokeWeight(4);
        noFill();
        beginShape();
        for (let i = 0; i < cities.length; i++) {
            vertex(cities[bestEver[i]].x, cities[bestEver[i]].y);
        }
        endShape();
    }

}

function calculateFitness(cities, population, recordDistance, fitness) {
    // let currentRecord = Infinity;
    // console.log('in func')
    for (let i = 0; i < population.length; i++) {
        // console.log('in loop')
        let d = calcDistance(cities, population[i]);
        // console.log('the value of d')
        // console.log(d)
        if (d < recordDistance) {
            // console.log('this has been hit, Best Ever:')
            recordDistance = d;
            bestEver = population[i];
            console.log(bestEver);
        }
        // fitness[i] = 1 / (pow(d, 8) + 1);
        fitness[i] = d;
    }
    return fitness, recordDistance;
}

function calcDistance(points, order) {
    var sum = 0;
    for (var i = 0; i < order.length - 1; i++) {
      var cityAIndex = order[i];
      var cityA = points[cityAIndex];
      var cityBIndex = order[i + 1];
      var cityB = points[cityBIndex];
      var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
      sum += d;
    }
    return sum;
}

function normalizeFitness(fitness) {
    let sum = 0;
    for (let i = 0; i < fitness.length; i++) {
      sum += fitness[i];
    }
    for (let i = 0; i < fitness.length; i++) {
      fitness[i] = fitness[i] / sum;;
    }
    return fitness;
  }

function nextGeneration(population, fitness) {
    let newPopulation = [];
    for (let i = 0; i < population.length; i++) {
        let orderA = pickOne(population, fitness);
        let orderB = pickOne(population, fitness);
        let order = crossOver(orderA, orderB);
        // mutate(order, 0.01);
        newPopulation[i] = order;
    }
    population = newPopulation;
    return population;
}
  
function pickOne(list, prob) {
    let index = 0;
    let r = random(1);

    while (r > 0) {
        r = r - prob[index];
        index++;
    }
    index--;
    return list[index].slice();
}
  
function crossOver(orderA, orderB) {
    let start = floor(random(orderA.length));
    let end = floor(random(start + 1, orderA.length));
    let neworder = orderA.slice(start, end);
    // var left = totalCities - neworder.length;
    for (let i = 0; i < orderB.length; i++) {
        let city = orderB[i];
        if (!neworder.includes(city)) {
        neworder.push(city);
        }
    }
    return neworder;
}

function mutate(order, mutationRate) {
    for (let i = 0; i < totalCities; i++) {
        if (random(1) < mutationRate) {
        let indexA = floor(random(order.length));
        let indexB = (indexA + 1) % totalCities;
        swap(order, indexA, indexB);
        }
    }
    return order;
}

function swap(a, i, j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  