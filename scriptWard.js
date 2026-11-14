const grid = document.querySelector("#map");
const tileMenu = document.querySelector("#tile-menu-popup");

let selectedTileId = null;

//select tile
grid.addEventListener("click", function(event){
    const clickedTile = event.target.closest(".tile");

    if(!clickedTile){
        return;
    }

    selectTile(clickedTile)
});


function selectTile(tileElement){
    const previousTile = grid.querySelector(".tile.selected");

    if (previousTile){
        previousTile.classList.remove("selected");
    }

    tileElement.classList.add("selected")

    selectedTileId = Number(tileElement.dataset.tileId)

    showTileMenu(tileElement);
}

// place popup next to tile
function showTileMenu(tileElement){
    const tilePosition = tileElement.getBoundingClientRect();

    const gap = 8;

    tileMenu.classList.add("visible");

    const menuWidth = tileMenu.offsetWidth;
    const menuHeight = tileMenu.offsetHeight;

    let menuX = tilePosition.right + gap;
    let menuY = tilePosition.top;

    if (menuX + menuWidth > window.innerWidth){
        menuY = window.innerHeight - menuHeight - gap;
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

    tileMenu.style.left = `${menuX}px`
    tileMenu.style.top = `${menuY}px`
}

window.addEventListener("resize", function(){
    const selectedTile = grid.querySelector(".tile.selected");

    if(selectedTile){
        showTileMenu(selectedTile);
    }
});

window.addEventListener("scroll", function(){
    const selectedTile = grid.querySelector(".tile.selected");

    if (selectedTile){
        showTileMenu(selectedTile);
    }
});

//Popup Menu Button Actions
tileMenu.addEventListener("click", function(event){
    const clickedButton = event.target.closest("button");

    if (!clickedButton){
        return;
    }

    const action = clickedButton.dataset.action;

    if(action === "close"){
        closeTileMenu();
        return;
    }

    if(action === "place"){
        placeSelectedMachine();
    }

    if (action === "inspect"){
        inspectSelectedTile();
    }
})

//menu action button functions
function inspectSelectedTile(){
    if(selectedTileId === null){
        return;
    }

    console.log(`Inspecting tile ${selectedTileId}`)
}

//close popup menu
function closeTileMenu(){
    tileMenu.classList.remove("visible");
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

    if (!clickedTile && !clickedMenu){
        closeTileMenu();
    }
});

//escape key can also close 
document.addEventListener("keydown", function (event){
    if (event.key === "Escape"){
        closeTileMenu();
    }
})