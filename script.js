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

const shopMenu = document.querySelector("#shopMenu");
const shopItems = document.querySelector("#shopItems");
const closeShopButton = document.querySelector("#closeShop");
const map = document.querySelector("#map");




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
    maxCapacity: 60
};

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
buyButton.addEventListener("click", () => {
    openShop();
});
closeShopButton.addEventListener("click", () => {
    closeShop();
});

shopItems.addEventListener("click", function(event){
    const selectedShopItem = event.target.closest(".shop-item");

    if (!selectedShopItem){
        return;
    }
    
    const machineIndex = Number(selectedShopItem.dataset.machineIndex);

    const selectedMachine = machines[machineIndex];

    buy(selectedMachine);
    closeShop();
});

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
        inputs: {},
        outputs: {},
        active: true,
        efficiency: 1,
        stageRequired: 1,
        steamRequired: 0,
        steamAllocated: 0,
        steamBonus: 10
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
        storageBonus: 15,
        bought: false,
        placed: false,
        active: true
    }
    
]

const builtMachines = [];

const unplacedMachines = [];
let nextMachineId = 1;

var play = true;

//resource incrementing
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function timePass() {
    while (play == true) {
        builtMachines.forEach(machine => {
            runMachine(machine);
        });

        loadResource();
        stageUp();
        loadTerraformProgress();
        loadStage();
        checkWin();

        if (!resourceInfo.hidden) {
            loadStorageInfo();
        }
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

    if (
        machine.steamRequired > 0 &&
        !isConnectedToBoiler(machine)
    ) {
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

function loadUnplacedMachineMenu(){
    unplacedMachineList.innerHTML = "";

    if (unplacedMachines.length === 0){
        unplacedMachineList.innerHTML = "<p>No unplaced machines</p>";

        return;
    }
    unplacedMachines.forEach(machine => {
        const machineButton = document.createElement("button");
            
        machineButton.classList.add("unplaced-machine");

        machineButton.dataset.machineId = machine.id;

        machineButton.innerHTML = `
            <span>
                ${formatMachineName(machine.name)}
            </span>

            <img
                src="images/${machine.name}.png"
                alt="${formatMachineName(machine.name)}"
            >
        `;

        unplacedMachineList.appendChild(machineButton);
    });
}

function placeUnplacedMachine(machineId){
    const selectedTile = document.querySelector("#map .tile.selected");

    if (!selectedTile){
        return;
    }

    if(selectedTile.dataset.occupied === "true"){
        return;
    }

    const machineIndex = unplacedMachines.findIndex(machine => machine.id === machineId);

    if (machineIndex === -1){
        return;
    }

    const machine = unplacedMachines[machineIndex];

    selectedTile.innerHTML = `
        <img class="machine-img"
         src="images/${machine.name}.png"
         alt="${formatMachineName(machine.name)}">
    `;

    selectedTile.dataset.occupied = "true";

    machine.location = selectedTile;
    machine.placed = true;
    checkNeighbors(selectedTile);

    unplacedMachines.splice(machineIndex, 1);
    builtMachines.push(machine);

    if (machine.name === "Boiler") {
        steam.capacity = Math.min(steam.capacity + 10, 30);
    }

    if (machine.name === "Warehouse") {
        storage.capacity = Math.min(
            storage.capacity + machine.storageBonus,
            storage.maxCapacity
        );
    }

    loadResource();

    console.log(`${machine.name} placed on ${selectedTile.id}`);
}


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

    tile.innerHTML = `
        <img class="machine-img"
         src="images/${machine.name}.png"
         alt="${machine.name}">
    `;
    
    tile.dataset.occupied = "true";

    machine.location = tile;
    machine.placed = true;
    checkNeighbors(tile);

    builtMachines.push(machine);

    machineToPlace = null;

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

function removeSelectedMachine(){
    const selectedTile = document.querySelector("#map .tile.selected");

    if (!selectedTile){
        console.log("Select a tile before removing a machine");
        return;
    }

    const machine = builtMachines.find(machine =>
        machine.location === selectedTile &&
        machine.placed ===true
    );

    if (!machine){
        console.log("There is no machine on this tile");
        return;
    }
    
    selectedTile.innerHTML = "";

    delete selectedTile.dataset.occupied;

    machine.location = null;
    machine.placed = false;

    const machineIndex = builtMachines.indexOf(machine);

    if (machineIndex !== -1){
        builtMachines.splice(machineIndex, 1);
    }

    console.log(`${machine.name} removed from ${selectedTile.id}`);
}

function openShop(){
    loadShop();
    shopMenu.hidden = false;
}

function closeShop(){
    shopMenu.hidden = true;
}

function loadShop(){
    shopItems.innerHTML = "";

    machines.forEach((machine, index) => {
        const hasEnoughResources = 
            resources[machine.costType] >= machine.cost;

        const stageRequirementMet = 
            isUnlocked(machine);

        const machineAvailable = 
            hasEnoughResources &&
            stageRequirementMet;

        const machineEntry = document.createElement("button");

        machineEntry.classList.add("shop-item");
        machineEntry.dataset.machineIndex = index;
        machineEntry.disabled = !machineAvailable;

        machineEntry.innerHTML = `
            <div class="shop-details">
                <h3>${formatMachineName(machine.name)}</h3>
                <p>Cost: ${machine.cost} ${machine.costType}</p>
                <p>Stage required: ${machine.stageRequired}</p>
            </div>

            <div class="shop-image">
                <img
                    src="images/${machine.name}.png"
                    alt="${formatMachineName(machine.name)}"
                    >
            </div>
        `;

        shopItems.appendChild(machineEntry);
    });
}

function formatMachineName(machineName){
    return machineName.replace(/([a-z])([A-Z])/g, "$1 $2");
}
//PIPES ---------------------------------------------------------------------
//STEAM ---------------------------------------------------------------------
function getEfficiency(machine) {
    if (machine.steamRequired === 0) {
        return 1;
    }

    return machine.steamAllocated / machine.steamRequired;
}

function getAllocatedSteam() {
    let total = 0;

    builtMachines.forEach(machine => {
        total += machine.steamAllocated;
    });

    return total;
}

function allocateSteam(machine, amount) {
    if (!machine.bought || !machine.active) {
        return false;
    }

    if (amount < 0 || amount > machine.steamRequired * 2) {
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

    builtMachines.forEach(machine => {
        if (!machine.bought || machine.steamRequired === 0) {
            return;
        }

        const container = document.createElement("div");

        container.innerHTML = `
            <h3>${machine.name}</h3>

            <input
                type="range"
                min="0"
                max="${machine.steamRequired * 2}"
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
    steamMenu.hidden = false;
});

closeSteam.addEventListener("click", () => {
    steamMenu.hidden = true;
});


//STORAGE -------------------------------------------------------------------
function getStorageUsed() {
    return (
        resources.water +
        resources.metal +
        resources.ore +
        resources.oxygen
    );
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
    loadStorageInfo();
}

const discWater = document.querySelector("#water");
const discOre = document.querySelector("#ore");
const discMetal = document.querySelector("#metal");
const discOxygen = document.querySelector("#oxygen");
const resourceButton = document.querySelector("#resourceButton");
const resourceInfo = document.querySelector("#resourceMenu");
const closeResource = document.querySelector("#closeResource")
resourceButton.addEventListener("click", () => {
    loadStorageInfo();
    resourceInfo.hidden = false;
});

closeResource.addEventListener("click", () => {
    resourceInfo.hidden = true;
});

function loadStorageInfo() {
    const storageInfo = document.querySelector("#storageInfo");

    storageInfo.textContent =
        `Storage: ${getStorageUsed().toFixed(1)} / ${storage.capacity}`;
}

discOre.addEventListener("click", () => {
    discardResource("ore", 10);
})
discOxygen.addEventListener("click", () => {
    discardResource("oxygen", 10);
})
discMetal.addEventListener("click", () => {
    discardResource("metal", 10);
})
discWater.addEventListener("click", () => {
    discardResource("water", 10);
})


//SPENDING ------------------------------------------------------------------
function canAfford(machine) {
    return (
        machine &&
        Number.isFinite(resources[machine.costType]) &&
        Number.isFinite(machine.cost) &&
        resources[machine.costType] >= machine.cost
    );
}

function buy(machine) {
    if (!machine) {
        return;
    }

    if (!isUnlocked(machine)) {
        return;
    }

    if (resources[machine.costType] < machine.cost) {
        return;
    }
    
    resources[machine.costType] -= machine.cost;

    const purchasedMachine = createMachineInstance(machine);

    unplacedMachines.push(purchasedMachine);
    
    loadResource();
}

function createMachineInstance(machineType) {
    return {
        ...machineType,

        id: nextMachineId++,
        location: null,
        bought: true,
        placed: false,
        steamAllocated: 0,

        inputs: {
            ...machineType.inputs
        },

        outputs: {
            ...machineType.outputs
        }
    };
}

function isBought(name) {
    return builtMachines.some(machine =>
        machine.name === name &&
        machine.bought &&
        machine.placed
    );
}

function isUnlocked(machine) {
    return gameStage >= machine.stageRequired;
}




//Stages ----------------------------------------------------------------
const objectives = {
    1: "Build an Ice Extractor, Boiler, and Mine",
    2: "Build another Boiler, Warehouse, and collect 20 metal",
    3: "Reach 25% terraforming",
    4: "Reach 100% terraforming",
    5: "Keep a stable environment for 1 minute"
};

function stageUp() {
    const previousStage = gameStage;
    const progress = getTerraformProgress();

    // Stage 2
    if (
        gameStage === 1 &&
        isBought("IceExtractor") &&
        isBought("Boiler") &&
        isBought("Mine")
    ) {
        gameStage = 2;
    }

    // Stage 3
    if (
        gameStage === 2 &&
        resources.metal >= 20 &&
        steam.capacity >= 20
    ) {
        gameStage = 3;
    }

    // Stage 4
    if (
        gameStage === 3 &&
        progress >= 25
    ) {
        gameStage = 4;
    }

    // Stage 5
    if (
        gameStage === 4 &&
        progress >= 100
    ) {
        gameStage = 5;
    }

    // Only execute when the stage changes
    if (gameStage !== previousStage) {
        map.style.backgroundImage =
            `url("images/stage_${gameStage}.png")`;

        showAlert(
            `Stage ${gameStage} Unlocked!`,
            objectives[gameStage]
        );
    }
}

function loadStage() {
    const stageDisplay = document.querySelector("#stageDisplay");

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
    showAlert(
        "Victory!",
        "Mars has been successfully terraformed!"
    );
}


//DISPLAY PIPES ----------------------------------------------------------
function checkNeighbors(tile) {
    const tiles = [...document.querySelectorAll("#map .tile")];

    const index = tiles.indexOf(tile);
    const columns = 5;

    const neighbors = {
        top: index - columns,
        bottom: index + columns,
        left: index % columns !== 0 ? index - 1 : -1,
        right: index % columns !== columns - 1 ? index + 1 : -1
    };

    for (let direction in neighbors) {
        const neighborIndex = neighbors[direction];

        if (neighborIndex < 0 || neighborIndex >= tiles.length) {
            continue;
        }

        const neighbor = tiles[neighborIndex];

        // Check whether neighboring tile contains a machine image
        if (neighbor.dataset.occupied === "true") {
            createPipe(tile, direction);
        }
    }
}

function createPipe(tile, direction) {
    // Prevent duplicate pipes
    if (tile.querySelector(`.pipe-${direction}`)) {
        return;
    }

    const pipe = document.createElement("img");

    pipe.src = "images/pipe.png";
    pipe.className = `pipe pipe-${direction}`;

    tile.appendChild(pipe);
}

function getNeighbors(tile) {
    const tiles = [...document.querySelectorAll("#map .tile")];
    const index = tiles.indexOf(tile);
    const columns = 5;

    if (index === -1) return [];

    const neighbors = [];

    // Above
    if (index >= columns) {
        neighbors.push(tiles[index - columns]);
    }

    // Below
    if (index + columns < tiles.length) {
        neighbors.push(tiles[index + columns]);
    }

    // Left
    if (index % columns !== 0) {
        neighbors.push(tiles[index - 1]);
    }

    // Right
    if (index % columns !== columns - 1) {
        neighbors.push(tiles[index + 1]);
    }

    return neighbors;
}

function isConnectedToBoiler(machine) {
    if (!machine.location || !machine.placed) {
        return false;
    }

    const visited = new Set();
    const queue = [machine.location];

    while (queue.length > 0) {
        const currentTile = queue.shift();

        if (visited.has(currentTile)) {
            continue;
        }

        visited.add(currentTile);

        // Check whether this tile contains a Boiler
        const currentMachine = builtMachines.find(m =>
            m.location === currentTile &&
            m.placed
        );

        if (currentMachine?.name === "Boiler") {
            return true;
        }

        // Check neighboring tiles
        const neighbors = getNeighbors(currentTile);

        for (const neighbor of neighbors) {
            if (
                neighbor.dataset.occupied === "true" &&
                !visited.has(neighbor)
            ) {
                queue.push(neighbor);
            }
        }
    }

    return false;
}

//ALERTS ----------------------------------------------------
const gameAlert = document.querySelector("#gameAlert");
const alertTitle = document.querySelector("#alertTitle");
const alertMessage = document.querySelector("#alertMessage");
const alertClose = document.querySelector("#alertClose");

function showAlert(title, message) {
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    gameAlert.hidden = false;
}

function closeAlert() {
    gameAlert.hidden = true;
}

alertClose.addEventListener("click", closeAlert);



//GAME START ---------------------------------------------------
function startGame() {
    showAlert("Welcome to Mars!", "Your mission is to transform Mars into a habitable planet. Good luck!");
}

//game runs
startGame();
timePass();