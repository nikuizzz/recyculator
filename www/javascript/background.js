var isCycleBackground = false

var current_bg = ""
var next_bg = ""

var current_bg_cont = document.getElementById("current-bg")
var next_bg_cont = document.getElementById("next-bg")

let backgrounds = {
    "Arctic Labs": "arcticlabs.png",
    "Mountain" : "mountain.png",
    "Boat Village": "boatvillage1.png",
    "Scrap Heli": "scrapheli.png",
    "Desert": "desert.png",
    "Forest": "forest.png",
    "Outpost": "outpost.png",
    "Supermarket": "supermarket.png",
    "Swamp": "swamp.png",
    "Underwater Labs" : "underwaterlabs.png",
}

function cycleBackground(next_bg) {
    if(next_bg === "") {
        current_bg = getRandomBackground(current_bg)
        setBackground(getPath(current_bg))
    }

    if(isCycleBackground) {
        // Updating next background
        setNextBackground(getPath(next_bg))

        // Fading out current background
        current_bg_cont.style.opacity = "0"

        // Fading in next background
        next_bg_cont.style.opacity = "1"

        // Permutation of objects 
        let temp = current_bg_cont
        current_bg_cont = next_bg_cont
        next_bg_cont = temp

        next_bg = getRandomBackground(next_bg)
    } else {
        next_bg = current_bg
    }
    
    setTimeout(() => {
        cycleBackground(next_bg)
    }, 1500)
}

function getRandomBackground(background) {
    // Returns a random background, different from the background given in parameters
    let bg = Object.keys(backgrounds)[Math.floor(Math.random() * Object.keys(backgrounds).length)]
    
    while(bg === background) {
        bg = Object.keys(backgrounds)[Math.floor(Math.random() * Object.keys(backgrounds).length)]
    }
    
    return bg
}
function getPath(bg) {
    return `./misc/backgrounds/${backgrounds[bg]}`
}
function setBackground(path) {
    current_bg_cont.style.backgroundImage = `url("${path}")`
}
function setNextBackground(path) {
    next_bg_cont.style.backgroundImage = `url("${path}")`
}

// setBackground(getPath(Object.keys(backgrounds)[4]))

cycleBackground("")


// Frontend fix
let rightSideContent = document.getElementById("right-side-container")
let leftSideContent = document.getElementById("left-side-container")

let heightDifference = leftSideContent.offsetHeight - rightSideContent.offsetHeight

// Adding margin to input-items-container so the ITEMS side and the RECYCLER side are same height
document.getElementById("recycler-wrapper").style.gap = `${heightDifference}px`