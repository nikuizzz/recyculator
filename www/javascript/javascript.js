// Import variables and functions from recycler
// I have to put "export" before the variable/function inside of 
// recycler.js so it can be imported there
import { rItems, rKeys, recycle, recycleAll} from "./recycler.js"

var fullRecycle = true

const allItemsContainer = document.getElementById("all-items-container")
const inputItemsContainer = document.getElementById("input-items-container")
const outputItemsContainer = document.getElementById("output-items-container")
const search = document.getElementById("items-search")

// Used to simplify searching 
// Each key is the name of the item in lowercase, without any spaces
// Each value is the original name of the item, which is its key inside allItems
const sKeys = {}

rKeys.forEach( original_key => {
    let simplified_key = original_key.toLowerCase()
    simplified_key = simplified_key.replace(/\s/g, "")
    sKeys[simplified_key] = original_key
})

// Create itemBox
function createBox(item_name="", quality = 80) {
    let box = document.createElement("div")
    box.classList.add("item-box")

    // Init empty box
    if(item_name === "") {
        return box
    }

    let path = `./misc/items${quality}/${rItems[item_name]["path"]}`
    // console.log(path)

    let img = document.createElement("img")
    img["src"] = path
    img["item"] = item_name
    img["alt"] = item_name

    box.appendChild(img)

    box.addEventListener("click", () => {
        if(Object.keys(inputItems).includes(item_name)) {
            inputItems[item_name] += 1
        }
        else {
            if(Object.keys(inputItems).length < 12) {
                inputItems[item_name] = 1
            }
            else {
                alert("Max")
            }
        }

        renderInput()
    })

    return box
}

// Dict with all items HTML boxes
const allItems = {}

rKeys.forEach( key => { allItems[key] = createBox(key) })

// Search needle
search.addEventListener("input", () => {
    let needle = search.value
    renderItems(needle)
})

var currentlyDisplayedItems = {}

function renderItems(needle) {
    allItemsContainer.innerHTML = ""
    currentlyDisplayedItems = {}

    // If no search parameter is set, rendering all items
    if(needle === "") {
        Object.keys(allItems).forEach( key => {
            if(rItems[key]["recyclable"]) {
                allItemsContainer.appendChild(allItems[key])
            }
        })
    }
    // Else -> Searching for corresponding items 
    else {
        // console.log("searching for item '" + needle + "'")
        let search_keys = Object.keys(sKeys)
        needle = needle.toLowerCase()

        // Searching for multiple needles
        if(needle.includes(" ")) {
            let needles = needle.split(" ")

            search_keys.forEach( search_key => {
                let display_this_item = true

                for(let i = 0; i < needles.length; i++) {
                    let needle = needles[i]

                    if(!search_key.includes(needle)) {
                        display_this_item = false
                        break
                    }
                }

                if(display_this_item) {
                    let item_name = sKeys[search_key]
                    if(rItems[item_name]["recyclable"]) {
                        currentlyDisplayedItems[item_name] = allItems[item_name]
                    }
                }
            })
        }
        // Searching for a single needle
        else {
            search_keys.forEach( search_key => {
                if(search_key.includes(needle)) {
                    let item_name = sKeys[search_key]
                    if(rItems[item_name]["recyclable"]) {
                        currentlyDisplayedItems[item_name] = allItems[item_name]
                    }
                }
            })
        }
        

        // console.log("Found items for : " + needle)
        // console.log(currentlyDisplayedItems)

        Object.values(currentlyDisplayedItems).forEach( item => {
            allItemsContainer.appendChild(item)
        })
    }
}

// First call on page load
renderItems("")

var inputItems = {}
var outputItems = {}

// Render selected items
function renderInput() {
    // console.log("input")
    // console.log(inputItemsBoxes)

    inputItemsContainer.innerHTML = ""

    Object.keys(inputItems).forEach( item_name => {
        inputItemsContainer.appendChild(createBox(item_name))
    })

    for(let i = 0; i < 12 - Object.keys(inputItems).length; i++) {
        inputItemsContainer.appendChild(createBox())
    }

    renderOutput()
}

// Render recycled items
function renderOutput() {
    // console.log(inputItems)
    outputItems = recycleAll(inputItems, fullRecycle)
    // console.log(outputItems)

    outputItemsContainer.innerHTML = ""

    // Adding recycling items to the output container
    Object.keys(outputItems).forEach( item_name => {
        console.log("adding this item container : " + item_name)
        outputItemsContainer.appendChild(createBox(item_name))
    })

    for(let i = 0; i < 12 - Object.keys(outputItems).length; i++) {
        outputItemsContainer.appendChild(createBox())
    }

    // Filling the remaining boxes

    // Object.keys(inputItems).forEach( item_name => {
    //     inputItemsContainer.appendChild(createBox(item_name))
    // })

    // for(let i = 0; i < 12 - Object.keys(inputItems).length; i++) {
    //     inputItemsContainer.appendChild(createBox())
    // }
}


renderInput()

