//tile map a0-ice/harvest, a1 boiler, a2 metal mine
const a0 = document.querySelector("#tile1");
const a1 = document.querySelector("#tile2");
const a2 = document.querySelector("#tile3");
const a3 = document.querySelector("#tile4");
const a4 = document.querySelector("#tile5");
const b0 = document.querySelector("#tile6");
const b1 = document.querySelector("#tile7");
const b2 = document.querySelector("#tile8");
const b3 = document.querySelector("#tile9");
const b4 = document.querySelector("#tile10");
const c0 = document.querySelector("#tile11");
const c1 = document.querySelector("#tile12");
const c2 = document.querySelector("#tile13");
const c3 = document.querySelector("#tile14");
const c4 = document.querySelector("#tile15");
const d0 = document.querySelector("#tile16");
const d1 = document.querySelector("#tile17");
const d2 = document.querySelector("#tile18");
const d3 = document.querySelector("#tile19");
const d4 = document.querySelector("#tile20");
const resourceBar = document.querySelector("#resourceBar");
const buyButton = document.querySelector("#buy");





//level settings
const resources = {
    water: 10,
    metal: 10,
    steam: 0,
    oxygen: 0,
    ore: 0
}

const environment = {
    temperature: 0,
    pressure: 0,
    atmosphere: 0,
    biosphere: 0
}

var gameStage = 1;

var max = 20;

var machineToPlace = null;

//-------------------------------- Test Event Listeners ----------------------------
a1.addEventListener("click", () => {
    resources.water -= 5;
    loadResource();
})
buyButton.addEventListener("click", () => {
    buy(machines[machineOrder]);
})

//MACHINES -------------------------------------------------------------------
//machine array
machines = [
    {
        name: "IceExtractor",
        costType: "water",
        cost: 10,
        location: a0,
        bought: false,
        nextBuy: "Boiler",
        inputs: {},
        outputs: {
            water: 20
        },
        active: true,
        efficiency: 1,
        stageRequired: 1
    },
    {
        name: "Boiler",
        costType: "water",
        cost: 20,
        location: a1,
        bought: false,
        nextBuy: "Mine",
        inputs: {
            water: 1
        },
        outputs: {
            steam: 20
        },
        active: true,
        efficiency: 1,
        stageRequired: 1
    },
    {
        name: "Mine",
        costType: "metal",
        cost: 10,
        location: a2,
        bought: false,
        nextBuy: "Smelter",
        inputs: {
            steam: 1
        },
        outputs: {
            ore: 20
        },
        active: true,
        efficiency: 1,
        stageRequired: 1
    },
    {
        name: "Smelter",
        costType: "ore",
        cost: 20,
        location: a3,
        bought: false,
        nextBuy: "Greenhouse",
        inputs: {
            ore: 2,
            steam: 1
        },
        outputs: {
            metal: 20
        },
        active: true,
        efficiency: 1,
        stageRequired: 2
    },
    {
        name: "Greenhouse",
        costType: "metal",
        cost: 20,
        location: a4,
        bought: false,
        nextBuy: "Atmospheric Processor",
        inputs: {
            steam: 2
        },
        outputs: {
            oxygen: 20
        },
        active: true,
        efficiency: 1,
        stageRequired: 2
    },
    {
        name: "AtmosphericProcessor",
        costType: "metal",
        cost: 30,
        location: b0,
        bought: false,
        nextBuy: "Heating Tower",
        inputs: {
            oxygen: 3,
            steam: 2
        },
        outputs: {
            atmosphere: 20
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        stageRequired: 3
    },
    {
        name: "HeatingTower",
        costType: "metal",
        cost: 40,
        location: b1,
        bought: false,
        nextBuy: "Pressure Generator",
        inputs: {
            steam: 4
        },
        outputs: {
            temperature: 20
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        stageRequired: 3
    },
    {
        name: "PressureGenerator",
        costType: "metal",
        cost: 50,
        location: b2,
        bought: false,
        nextBuy: "Biospheric Dome",
        inputs: {
            steam: 3,
            water: 2
        },
        outputs: {
            pressure: 20
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        stageRequired: 4
    },
    {
        name: "BiosphericDome",
        costType: "metal",
        cost: 60,
        location: b3,
        bought: false,
        nextBuy: "Something",
        inputs: {
            water: 2,
            oxygen: 3
        },
        outputs: {
            biosphere: 20
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        stageRequired: 4
    }
    
]

const builtMachines = []
var machineOrder = 0;

updateBuyButton();

var play = true;

//resource incrementing
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function timePass() {
    //checks for machines []
    //resources increase/decrease [x]
    //timout [x]
    while (play == true) {
        machines.forEach(machine => {
            runMachine(machine);
        });
        loadResource();
        stageUp();
        loadTerraformProgress();
        loadStage();
        checkWin();
        await delay(1000);
    }
}

function addResource(resource) {
    if (resources[resource] < max) {
        resources[resource] += 1;
    }
}

function runMachine(machine) {
    if (!machine.bought || !machine.placed || !machine.active) {
        return;
    }

    const target = machine.outputTarget === "environment"
        ? environment
        : resources;

    // Check if all outputs are full
    const outputMax = machine.outputTarget === "environment" ? 100 : max;

    const outputsFull = Object.keys(machine.outputs).every(resource => {
        return target[resource] >= outputMax;
    })
    if (outputsFull) return;

    // Check all inputs
    for (let resource in machine.inputs) {
        if (resources[resource] < machine.inputs[resource]) {
            return;
        }
    }

    // Consume inputs
    for (let resource in machine.inputs) {
        resources[resource] -= machine.inputs[resource];
    }

    // Produce outputs
    for (let resource in machine.outputs) {
        const maxAmount = machine.outputTarget === "environment"
            ? 100
            : max;

        target[resource] = Math.min(
            target[resource] + machine.outputs[resource],
            maxAmount
        )
    }
}

function loadResource() {
    resourceBar.innerHTML = `<h1>Water: ${resources.water}</h1> <h1>Steam: ${resources.steam}</h1> <h1>Ore: ${resources.ore}</h1> <h1>Metal: ${resources.metal}</h1> <h1>Oxygen: ${resources.oxygen}</h1>`;
}

timePass();

//place machine
function placeMachine(tile) {
    //change tile img src to match machine
    if (!tile || !machineToPlace){
        console.log("There is no machine waiting to be placed.");
        return;
    }

    if(tile.dataset.occupied === "true"){
        console.log("That tile is already occupied");
        return;
    }

    const machine = machineToPlace;

    tile.innerHTML = `<img src="images/${machine.name}.png" alt="${machine.name}">`;
    
    tile.dataset.occupied = "true";

    machine.location = tile;
    machine.placed = true;

    builtMachines.push(machine);

    machineToPlace = null;

    machineOrder +=1;

    updateBuyButton();
    loadResource();

    console.log(`${machine.name} placed on ${tile.id}`);

}

function placeSelectedMachine(){
    const selectedTile = document.querySelector("#map .tile.selected");

    if (!selectedTile){
        console.log("Select a tile before placing a machine.");
        return;
    }

    placeMachine(selectedTile);
}


//PIPES ---------------------------------------------------------------------



//SPENDING ------------------------------------------------------------------
function buy(machine) {
    if (!machine || machine.bought || machineToPlace) {
        return;
    }

    if (resources[machine.costType] >= machine.cost) {
        resources[machine.costType] -= machine.cost;

        machine.bought = true;
        machine.placed = false;

        machineToPlace = machine;

        buyButton.textContent = `Place ${machine.name} on a tile`;
        buyButton.disabled = true;

        loadResource();
    }
}

function updateBuyButton(){
    if (machineOrder >= machines.length){
        buyButton.textContent = "All machines purchased";
        buyButton.disabled = true;
        return;
    }

    const nextMachine = machines[machineOrder];

    buyButton.textContent = `Buy ${nextMachine.name} for ${nextMachine.cost} ${nextMachine.costType}`;

    buyButton.disabled = false;
}

function isBought(name) {
    return machines.some(machine =>
        machine.name === name && machine.bought
    );
}

function isUnlocked(machine) {
    return gameStage >= machine.stageRequired;
}




//Stages ----------------------------------------------------------------

function stageUp() {
    const progress = getTerraformProgress();

    // Stage 2: Build the first three machines
    if (
        gameStage === 1 &&
        isBought("IceExtractor") &&
        isBought("Boiler") &&
        isBought("Mine")
    ) {
        gameStage = 2;
    }

    // Stage 3: Reach resource requirements
    if (
        gameStage === 2 &&
        resources.metal >= 20 &&
        resources.steam >= 15
    ) {
        gameStage = 3;
        max = 40;
    }

    // Stage 4: Reach 45% terraforming
    if (
        gameStage === 3 &&
        progress >= 25
    ) {
        gameStage = 4;
        max = 60;
    }

    // Stage 5: Reach 100% terraforming
    if (
        gameStage === 4 &&
        progress >= 100
    ) {
        gameStage = 5;
    }
}

function loadStage() {
    const stageDisplay = document.querySelector("#stageDisplay");

    const objectives = {
        1: "Build an Ice Extractor, Boiler, and Mine",
        2: "Collect 20 metal and 15 steam",
        3: "Reach 25% terraforming",
        4: "Reach 100% terraforming",
        5: "Keep a stable environment for 1 minute"
    };

    stageDisplay.innerHTML = `
        <h2>Stage ${gameStage}</h2>
        <p>${objectives[gameStage]}</p>
    `;
}

function getTerraformProgress() {
    let total = 0;

    for (let attribute in environment) {
        total += environment[attribute];
    }

    return total / Object.keys(environment).length;
}

function loadTerraformProgress() {
    const display = document.querySelector("#terraformProgress");

    display.innerHTML = `
        <h2>Terraforming: ${getTerraformProgress().toFixed(1)}%</h2>
        <p>Temperature: ${environment.temperature.toFixed(1)}%</p>
        <p>Pressure: ${environment.pressure.toFixed(1)}%</p>
        <p>Atmosphere: ${environment.atmosphere.toFixed(1)}%</p>
        <p>Biosphere: ${environment.biosphere.toFixed(1)}%</p>
    `;
}

let stabilityTime = 0;

function checkWin() {
    if (gameStage !== 5) return;

    const stable = Object.values(environment).every(
        value => value >= 100
    );

    if (stable) {
        stabilityTime++;
    } else {
        stabilityTime = 0;
    }

    if (stabilityTime >= 5) {
        winGame();
    }
}

function winGame() {
    play = false;
    alert("Mars has been successfully terraformed!");
}