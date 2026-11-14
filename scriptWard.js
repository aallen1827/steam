const grid = document.querySelector("#map");
const tileMenu = document.querySelector("#tile-menu-popup");

const unplacedMachineMenu = document.querySelector("#unplaced-machine-menu");
const unplacedMachineList = document.querySelector("#unplaced-machine-list");

let selectedTileId = null;

//select tile
grid.addEventListener("click", function(event){
    const clickedTile = event.target.closest(".tile");

    if(!clickedTile){
        return;
    }

    selectTile(clickedTile)
});

unplacedMachineList.addEventListener("click", function(event){
    const clickedMachine = event.target.closest(".unplaced-machine");

    if (!clickedMachine){
        return;
    }

    const machineId = Number(clickedMachine.dataset.machineId);

    placeUnplacedMachine(machineId);
    closeTileMenu();
});

function selectTile(tileElement){
    const previousTile = grid.querySelector(".tile.selected");

    if (previousTile){
        previousTile.classList.remove("selected");
    }

    tileElement.classList.add("selected")

    selectedTileId = Number(tileElement.dataset.tileId)

    if (tileElement.dataset.occupied === "true"){
        showTileMenu(tileElement);  
    }else{
        showUnplacedMachineMenu(tileElement);
    }
    
}

function showUnplacedMachineMenu(tileElement){
    tileMenu.classList.remove("visible");

    loadUnplacedMachineMenu();

    unplacedMachineMenu.classList.add("visible");

    positionMenu(unplacedMachineMenu, tileElement);
}

// place popup next to tile
function positionMenu(menuElement, tileElement){
    const tilePosition = tileElement.getBoundingClientRect();
    const gap = 8;

    menuElement.classList.add("visible");

    const menuWidth = menuElement.offsetWidth;
    const menuHeight = menuElement.offsetHeight;

    let menuX = tilePosition.right + gap;
    let menuY = tilePosition.top;

    if (menuX + menuWidth > window.innerWidth - gap){
        menuX = tilePosition.left - menuWidth - gap;
    }

    if(menuX < gap){
        menuX = gap;
    }

    if (menuY < gap){
        menuY = gap;
    }

    if (menuY + menuHeight > window.innerHeight - gap){
        menuY = window.innerHeight - menuHeight - gap;
    }

    menuElement.style.left = `${menuX}px`
    menuElement.style.top = `${menuY}px`
}

function showTileMenu(tileElement) {
    unplacedMachineMenu.classList.remove("visible");

    updateMachineMenuButton(tileElement);

    tileMenu.classList.add("visible");

    positionMenu(tileMenu, tileElement);
}

window.addEventListener("resize", function() {
    const selectedTile = grid.querySelector(".tile.selected");

    if (selectedTile) {
        if (selectedTile.dataset.occupied === "true") {
            showTileMenu(selectedTile);
        } else {
            showUnplacedMachineMenu(selectedTile);
        }
    }
});

window.addEventListener("scroll", function() {
    const selectedTile = grid.querySelector(".tile.selected");

    if (selectedTile) {
        if (selectedTile.dataset.occupied === "true") {
            showTileMenu(selectedTile);
        } else {
            showUnplacedMachineMenu(selectedTile);
        }
    }
});

//Popup Menu Button Actions
tileMenu.addEventListener("click", function(event){
    const clickedButton = event.target.closest("button");

    if (!clickedButton){
        return;
    }

    const action = clickedButton.dataset.action;

    if (action === "toggle-production") {
        toggleMachineProduction();

        const selectedTile =grid.querySelector(".tile.selected");

        if (selectedTile) {
            updateMachineMenuButton(selectedTile);
    }

    return;
}

    if(action === "close"){
        closeTileMenu();
        return;
    }

    if (action === "remove") {
    const removed =
        removeSelectedMachine();

    if (removed) {
        loadUnplacedMachineMenu();
    }

    closeTileMenu();
    return;
    }
    
})

//menu action button functions
function inspectSelectedTile(){
    if(selectedTileId === null){
        return;
    }

    console.log(`Inspecting tile ${selectedTileId}`)
}

//stop/start production
function updateMachineMenuButton(tileElement) {
    const machine = builtMachines.find(machine =>
        machine.location === tileElement &&
        machine.placed === true
    );

    const toggleButton =
        tileMenu.querySelector("#toggle-production-button");

    if (!machine || !toggleButton) {
        return;
    }

    if (
        machine.name === "Boiler" ||
        machine.name === "Warehouse"
    ) {
        toggleButton.hidden = true;
        return;
    }

    toggleButton.hidden = false;

    toggleButton.textContent =
        machine.active
            ? "Stop Production"
            : "Start Production";
}

//close popup menu
function closeTileMenu(){
    tileMenu.classList.remove("visible");
    unplacedMachineMenu.classList.remove("visible");

    const selectedTile = grid.querySelector(".tile.selected");

    if(selectedTile){
        selectedTile.classList.remove("selected");
    }

    selectedTileId = null;
}

//click elsewhere to close menu
document.addEventListener("click", function(event){
    const clickedTile = event.target.closest(".tile");

    const clickedMenu = event.target.closest("#tile-menu-popup");

    const clickedUnplacedMenu = event.target.closest("#unplaced-machine-menu");
    
    if (!clickedTile && !clickedMenu && !clickedUnplacedMenu){
        closeTileMenu();
    }
});

//escape key can also close 
document.addEventListener("keydown", function (event){
    if (event.key === "Escape"){
        closeTileMenu();
    }
});

