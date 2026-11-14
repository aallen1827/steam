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
        inputType: null,
        inputAmount: 0,
        outputType: "water",
        outputAmount: 2,
        active: true,
        efficiency: 1
    },
    {
        name: "Boiler",
        costType: "water",
        cost: 20,
        location: a1,
        bought: false,
        nextBuy: "Mine",
        inputType: "water",
        inputAmount: 1,
        outputType: "steam",
        outputAmount: 4,
        active: true,
        efficiency: 1
    },
    {
        name: "Mine",
        costType: "metal",
        cost: 10,
        location: a2,
        bought: false,
        nextBuy: "Smelter",
        inputType: "steam",
        inputAmount: 1,
        outputType: "metal",
        outputAmount: 2,
        active: true,
        efficiency: 1
    },
    {
        name: "Smelter",
        costType: "metal",
        cost: 20,
        location: a3,
        bought: false,
        nextBuy: "Greenhouse",
        inputType: "metal",
        inputAmount: 1,
        outputType: "metal",
        outputAmount: 2,
        active: true,
        efficiency: 1
    },
    {
        name: "Greenhouse",
        costType: "metal",
        cost: 20,
        location: a4,
        bought: false,
        nextBuy: "Something",
        inputType: "steam",
        inputAmount: 2,
        outputType: "oxygen",
        outputAmount: 2,
        active: true,
        efficiency: 1
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
    if (resources[machine.outputType] >= max) {
        return;
    }

    if (machine.inputType !== null) {
        if (resources[machine.inputType] < machine.inputAmount) {
            return;
        }
        resources[machine.inputType] -= machine.inputAmount;
    }
    resources[machine.outputType] = Math.min(
        resources[machine.outputType] + machine.outputAmount,
        max
    )
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


