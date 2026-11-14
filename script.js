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
const steamDisplay = document.querySelector("#steam");





//level settings
const resources = {
    water: 10,
    metal: 10,
    oxygen: 0,
    ore: 0
}

const steam = {
    capacity: 0,
    allocated: 0,
};

const storage = {
    capacity: 30,
    allocated: 0
};

const environment = {
    temperature: 0,
    pressure: 0,
    atmosphere: 0,
    biosphere: 0
}

var gameStage = 1;

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
        stageRequired: 1,
        steamRequired: 0,
        steamAllocated: 0
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
        stageRequired: 1,
        steamRequired: 0,
        steamAllocated: 0
    },
    {
        name: "Mine",
        costType: "metal",
        cost: 10,
        location: a2,
        bought: false,
        nextBuy: "Smelter",
        inputs: {},
        outputs: {
            ore: 2
        },
        active: true,
        efficiency: 1,
        stageRequired: 1,
        steamRequired: 1,
        steamAllocated: 0
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
        },
        outputs: {
            metal: 2
        },
        active: true,
        efficiency: 1,
        stageRequired: 2,
        steamRequired: 1,
        steamAllocated: 0
    },
    {
        name: "Greenhouse",
        costType: "metal",
        cost: 20,
        location: a4,
        bought: false,
        nextBuy: "Atmospheric Processor",
        inputs: {},
        outputs: {
            oxygen: 2
        },
        active: true,
        efficiency: 1,
        stageRequired: 2,
        steamRequired: 2,
        steamAllocated: 0
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
        },
        outputs: {
            atmosphere: 20
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        stageRequired: 3,
        steamRequired: 2,
        steamAllocated: 0
    },
    {
        name: "HeatingTower",
        costType: "metal",
        cost: 40,
        location: b1,
        bought: false,
        nextBuy: "Pressure Generator",
        inputs: {},
        outputs: {
            temperature: 20
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        stageRequired: 3,
        steamRequired: 4,
        steamAllocated: 0
    },
    {
        name: "PressureGenerator",
        costType: "metal",
        cost: 50,
        location: b2,
        bought: false,
        nextBuy: "Biospheric Dome",
        inputs: {
            water: 2
        },
        outputs: {
            pressure: 20
        },
        outputTarget: "environment",
        active: true,
        efficiency: 1,
        stageRequired: 4,
        steamRequired: 3,
        steamAllocated: 0
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
        stageRequired: 4,
        steamRequired: 0,
        steamAllocated: 0
    },
    {
        name: "Warehouse",
        costType: "metal",
        cost: 10,
        inputs: {},
        outputs: {},
        steamRequired: 0,
        steamAllocated: 0,
        stageRequired: 2,
        storageBonus: 15
    }
    
]

const builtMachines = []
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
    if (!machine.bought || !machine.active) {
        return;
    }

    const efficiency = getEfficiency(machine);

    if (efficiency <= 0) return;

    const target = machine.outputTarget === "environment"
    ? environment
    : resources;

    // Stop if all environmental outputs are at 100%
    if (
        machine.outputTarget === "environment" &&
        Object.keys(machine.outputs).every(
            resource => target[resource] >= 100
        )
    ) {
        return;
    }
    // Check whether all inputs are available
    

    for (let resource in machine.inputs) {
        const requiredAmount = machine.inputs[resource] * efficiency;

        if (resources[resource] < requiredAmount) {
            return;
        }
    }

    // Calculate how much storage the machine will use
    if (machine.outputTarget !== "environment") {
        const totalInput = Object.entries(machine.inputs).reduce(
            (total, [resource, amount]) => {
                return total + amount * efficiency;
            },
            0
        );

        const totalOutput = Object.values(machine.outputs).reduce(
            (total, amount) => total + amount * efficiency,
            0
        );

        const storageAfterProduction =
            getStorageUsed() - totalInput + totalOutput;

        if (storageAfterProduction > storage.capacity) {
            return;
        }
    }

    // Consume inputs
    for (let resource in machine.inputs) {
        resources[resource] -= machine.inputs[resource] * efficiency;
    }

    // Produce outputs
    for (let resource in machine.outputs) {
        if (machine.outputTarget === "environment") {
            environment[resource] = Math.min(
                environment[resource] + machine.outputs[resource] * efficiency,
                100
            );
        } else {
            resources[resource] += machine.outputs[resource] * efficiency;
        }
    }
}

function loadResource() {
    resourceBar.innerHTML = `<h1>Water: ${resources.water}</h1> <h1>Ore: ${resources.ore}</h1> <h1>Metal: ${resources.metal}</h1> <h1>Oxygen: ${resources.oxygen}</h1>`;
    steamDisplay.innerHTML = `<h2>Warehouse: ${getStorageUsed()} / ${storage.capacity}</h2>
        <p>Available: ${getStorageAvailable().toFixed(1)}</p>`;
}

timePass();

//place machine
function placeMachine(tile) {
    //change tile img src to match machine

}


//PIPES ---------------------------------------------------------------------
function getEfficiency(machine) {
    if (machine.steamRequired === 0) {
        return 1;
    }

    return machine.steamAllocated / machine.steamRequired;
}

function getAllocatedSteam() {
    let total = 0;

    machines.forEach(machine => {
        if (machine.bought) {
            total += machine.steamAllocated;
        }
    });

    return total;
}

function allocateSteam(machine, amount) {
    if (!machine.bought || !machine.active) {
        return false;
    }

    if (amount < 0 || amount > machine.steamRequired) {
        return false;
    }

    const currentlyAllocated = getAllocatedSteam();

    const newTotal =
        currentlyAllocated - machine.steamAllocated + amount;

    if (newTotal > steam.capacity) {
        return false;
    }

    machine.steamAllocated = amount;

    return true;
}

//steam button function
const steamButton = document.querySelector("#steamButton");
const steamMenu = document.querySelector("#steamMenu");
const steamControls = document.querySelector("#steamControls");
const steamDisplayer = document.querySelector("#steamDisplay");
const closeSteam = document.querySelector("#closeSteam");

function loadSteamMenu() {
    steamControls.innerHTML = "";

    machines.forEach(machine => {
        if (!machine.bought || machine.steamRequired === 0) {
            return;
        }

        const container = document.createElement("div");

        container.innerHTML = `
            <h3>${machine.name}</h3>

            <input
                type="range"
                min="0"
                max="${machine.steamRequired}"
                step="1"
                value="${machine.steamAllocated}"
            >

            <span>${machine.steamAllocated} / ${machine.steamRequired}</span>
        `;

        const slider = container.querySelector("input");

        slider.addEventListener("input", () => {
            const amount = Number(slider.value);

            if (allocateSteam(machine, amount)) {
                loadSteamMenu();
            } else {
                slider.value = machine.steamAllocated;
            }
        });

        steamControls.appendChild(container);
    });

    steamDisplayer.textContent =
        `Steam: ${steam.capacity - getAllocatedSteam()} / ${steam.capacity}`;
}

steamButton.addEventListener("click", () => {
    loadSteamMenu();
    steamMenu.style.display = "block";
});

closeSteam.addEventListener("click", () => {
    steamMenu.style.display = "none";
});


//STORAGE -------------------------------------------------------------------
function getStorageUsed() {
    return Object.values(resources).reduce (
        (total, amount) => total + amount, 0
    )
}

function getStorageAvailable() {
    return Math.max(0, storage.capacity - getStorageUsed());
}

//discard resources
function discardResource(resource, amount) {
    resources[resource] = Math.max(
        0,
        resources[resource] - amount
    );
    loadResource();
}

const discWater = document.querySelector("#water");
const discOre = document.querySelector("#ore");
const discMetal = document.querySelector("#metal");
const discOxygen = document.querySelector("#oxygen");
const resourceButton = document.querySelector("#resourceButton");
const resourceInfo = document.querySelector("#resourceMenu");
const closeResource = document.querySelector("#closeResource")
resourceButton.addEventListener("click", () => {
    resourceInfo.style.display = "block";
})

closeResource.addEventListener("click", () => {
    resourceInfo.style.display = "none";
})

discWater.addEventListener("click", () => {
    discardResource("water", 10);
})


//SPENDING ------------------------------------------------------------------
function buy(machine) {
    if (!machine || machine.bought) {
        return;
    }

    if (resources[machine.costType] >= machine.cost) {
        resources[machine.costType] -= machine.cost;

        machine.location.innerHTML = `<img src="images/${machine.name}.png">`;
        machine.bought = true;
        if (steamMenu.style.display === "block") {
            loadSteamMenu();
        }

        machineOrder += 1;

        if (machineOrder < machines.length) {
            let nextMachine = machines[machineOrder];

            buyButton.textContent = `Buy ${nextMachine.name} for ${nextMachine.cost} ${nextMachine.costType}`;
        } else {
            buyButton.textContent = "All machines purchased";
            buyButton.disabled = true;
        }
        if (machine.name == "Boiler") {
            steam.capacity += 10;
        }
        if (machine.name === "Warehouse") {
            storage.capacity = Math.min(
                storage.capacity + machine.storageBonus,
                storage.maxCapacity
            );
        }

        loadResource();
    }
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