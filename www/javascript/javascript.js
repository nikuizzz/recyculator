// Import variables and functions from recycler
// I have to put "export" before the variable/function inside of 
// recycler.js so it can be imported there
import { rItems, rKeys, recycle, recycleAll} from "./recycler.js"

const allItemsContainer = document.getElementById("all-items-container")
const inputItemsContainer = document.getElementById("input-items-container")
const outputItemsContainer = document.getElementById("output-items-container")

// console.log(recycle("Rope", 5))


// Adding elements to ITEMS section
function createBox(item_name, quality = 180) {
    let path = `./misc/items${quality}/${rItems[item_name]["path"]}`
    console.log(path)

    let box = document.createElement("div")
    box.classList.add("item-box")

    let img = document.createElement("img")
    img["src"] = path
    img["item"] = item_name
    img["alt"] = item_name

    box.appendChild(img)

    return box
}

rKeys.forEach( item => {
    allItemsContainer.appendChild(createBox(item))
})

// allItemsContainer.appendChild(createBox("Rope"))