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
    oxygen: 0
}

const environment = {
    temperature: 0,
    pressure: 0,
    oxygen: 0,
    biosphere: 0
}

var max = 20;


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
            water: 2
        },
        active: true,
        efficiency: 1,
        unlocked: true
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
            steam: 2
        },
        active: true,
        efficiency: 1,
        unlocked: true
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
            ore: 2
        },
        active: true,
        efficiency: 1,
        unlocked: true
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
            metal: 2
        },
        active: true,
        efficiency: 1,
        unlocked: false
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
            oxygen: 2
        },
        active: true,
        efficiency: 1,
        unlocked: false
    },
    {
        name: "Atmospheric Processor",
        costType: "metal",
        cost: 30,
        location: a4,
        bought: false,
        nextBuy: "Heating Tower",
        inputs: {
            oxygen: 3,
            steam: 2
        },
        outputs: {
            oxygen: 0.2
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        unlocked: false
    },
    {
        name: "Heating Tower",
        costType: "metal",
        cost: 40,
        location: a4,
        bought: false,
        nextBuy: "Pressure Generator",
        inputs: {
            steam: 4
        },
        outputs: {
            temperature: 0.3
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        unlocked: false
    },
    {
        name: "Pressure Generator",
        costType: "metal",
        cost: 50,
        location: a4,
        bought: false,
        nextBuy: "Biospheric Dome",
        inputs: {
            steam: 3,
            water: 2
        },
        outputs: {
            pressure: 0.5
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        unlocked: false
    },
    {
        name: "Biospheric Dome",
        costType: "metal",
        cost: 60,
        location: a4,
        bought: false,
        nextBuy: "Something",
        inputs: {
            water: 2,
            oxygen: 3
        },
        outputs: {
            biosphere: 0.2
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        unlocked: false
    }
    
]
var machineOrder = 0;

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
        await delay(1000);
    }
}

function addResource(resource) {
    if (resources[resource] < max) {
        resources[resource] += 1;
    }
}

function runMachine(machine) {
    if (!machine.bought || !machine.active) {
        return;
    }

    // Check if output is full
    if (resources[machine.outputType] >= max) {
        return;
    }

    // Check if all input resources are available
    for (let resource in machine.inputs) {
        if (resources[resource] < machine.inputs[resource]) {
            return;
        }
    }

    // Consume all required resources
    for (let resource in machine.inputs) {
        resources[resource] -= machine.inputs[resource];
    }

    // Produce output
    resources[machine.outputType] = Math.min(
        resources[machine.outputType] + machine.outputAmount,
        max
    );
}

function loadResource() {
    resourceBar.innerHTML = `<h1>Water: ${resources.water}</h1> <h1>Steam: ${resources.steam}</h1> <h1>Metal: ${resources.metal}</h1> <h1>Oxygen: ${resources.oxygen}</h1>`;
}

timePass();

//place machine
function placeMachine(tile) {
    //change tile img src to match machine

}

//ice harvester



//greenhouse machine


//mine


//boiler


//PIPES ---------------------------------------------------------------------



//SPENDING ------------------------------------------------------------------
function buy(machine) {
    if (!machine || machine.bought) {
        return;
    }

    if (resources[machine.costType] >= machine.cost) {
        resources[machine.costType] -= machine.cost;

        machine.location.innerHTML = `<img src="images/${machine.name}.png">`;
        machine.bought = true;

        machineOrder += 1;

        if (machineOrder < machines.length) {
            let nextMachine = machines[machineOrder];

            buyButton.textContent = `Buy ${nextMachine.name} for ${nextMachine.cost} ${nextMachine.costType}`;
        } else {
            buyButton.textContent = "All machines purchased";
            buyButton.disabled = true;
        }

        loadResource();
    }
}

function isBought(name) {
    return machines.find(machine => machine.name === name)?.bought === true;
}


//Building

//Upgrading



//ENVIRONMENT ----------------------------------------------------------------

//Start

//lvl 2

//lvl 3

//lvl 4


