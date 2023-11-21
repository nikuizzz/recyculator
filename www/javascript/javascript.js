// Import variables and functions from recycler
// I have to put "export" before the variable/function inside of 
// recycler.js so it can be imported there
import { rItems, rKeys, recycle, recycleAll} from "./recycler.js"

const test = document.getElementById("test-p")

const fullRecycleCheckbox = document.getElementById("full-recycle-checkbox")
const clearButton = document.getElementById("clear-button")
const allItemsContainer = document.getElementById("all-items-container")
const inputItemsContainer = document.getElementById("input-items-container")
const outputItemsContainer = document.getElementById("output-items-container")
const search = document.getElementById("items-search")

var fullRecycle = fullRecycleCheckbox.checked

// Used to simplify searching 
// Each key is the name of the item in lowercase, without any spaces
// Each value is the original name of the item, which is its key inside allItems
const sKeys = {}
rKeys.forEach( original_key => {
    let simplified_key = original_key.toLowerCase()
    simplified_key = simplified_key.replace(/\s/g, "")
    sKeys[simplified_key] = original_key
})

// Dict with all items HTML boxes
const allItems = {}
rKeys.forEach( key => { allItems[key] = getItemBox({type: "default", item: key}) })

var currentlyDisplayedItems = {}
var inputItems = {}
var outputItems = {}

function getElement(type, attributes) {
    let element = document.createElement(type)

    Object.keys(attributes).forEach( key => {
        element.setAttribute(key, attributes[key])
    })

    return element
}

// Get itemBox 
function getItemBox(arg) {
    let type = arg.type || "default"
    let item = arg.item || ""
    let count = arg.count || -1
    let quality = arg.quality || 80

    let box = getElement("div", {class: "item-box"})

    // Init empty box
    if(type === "empty") {
        box.classList.add("empty")
        return box
    }

    let path = `./misc/items${quality}/${rItems[item]["path"]}`
    let img = getElement("img", {src: path, alt: item, title: item})
    box.appendChild(img)

    // INSIDE OF ITEMS CONTAINER
    // adds items to input container on click, and recycles it
    if(type === "default") {
        box.addEventListener("click", () => {
            if(Object.keys(inputItems).includes(item)) {
                if(inputItems[item] < 999) {
                    inputItems[item] += 1
                }
            }
            else {
                inputItems[item] = 1
            }
            
            renderInput()
        })
    }
    // INSIDE OF INPUT CONTAINER
    // ?
    else if(type === "input") {
        let mouseDownEvents = ["mousedown", "touchstart"]
        let mouseUpEvents = ["mouseup", "touchend"]
        let wrapper = getElement("div", {class: "item-count-input-wrapper"})
        let deleteBackground = getElement("div", {class: "deleting-background"})
        let span = getElement("span", {})
        let input = getElement("input", {class: "item-count-input", type: "number", value: 1})
        let hold = false
        
        if(count >= 1) {
            span.innerHTML = "x"
            input.value = count
        }
        else {
            span.innerHTML = ""
            input.value = ""
        }

        box.addEventListener("click", () => {
            input.focus()
        })

        let timer

        mouseDownEvents.forEach( event => {
            box.addEventListener(event, () => {
                deleteBackground.style.right = "0"
                timer = setTimeout(() => {
                    delete inputItems[item]
                    renderInput()
                }, 700)
            })
        })

        mouseUpEvents.forEach( event => {
            box.addEventListener(event, () => {
                clearTimeout(timer)
                deleteBackground.style.right = "100%"
            })
        })
        
        input.addEventListener("input", () => {

            if(input.value >= 1) {
                if(input.value >= 1000) {
                    input.value = 999
                }
                inputItems[item] = parseInt(input.value)
                input.style.width = input.value.length + "ch"
            }
            else {
                if(input.value <= -1) {
                    input.value = 1
                    input.style.width = input.value.length + "ch"
                } 
                else {
                    delete inputItems[item]
                    input.style.width = "1ch"
                    input.addEventListener("focusout", () => {
                        renderInput()
                    })
                }
            }
            renderOutput()
        })

        input.addEventListener("focusin", () => {
            box.classList.add("focused")
        })

        input.addEventListener("focusout", () => {
            box.classList.remove("focused")
        })

        wrapper.appendChild(span)
        wrapper.appendChild(input)
        input.style.width = input.value.length + "ch"
        box.appendChild(wrapper)
        box.appendChild(deleteBackground)
    }
    // INSIDE OF OUTPUT CONTAINER
    // no interactions, just display items + count
    else if(type === "output") {
        let span = getElement("span", {class: "item-counter"})
        span.innerHTML = "x" + count
        box.appendChild(span)
    }

    return box
}

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

        Object.values(currentlyDisplayedItems).forEach( item => {
            allItemsContainer.appendChild(item)
        })
    }
}

// Render selected items
function renderInput() {
    inputItemsContainer.innerHTML = ""

    let items = Object.keys(inputItems)

    items.forEach( item => {
        inputItemsContainer.appendChild(getItemBox({type: "input", item: item, count: inputItems[item]}))
    })

    // Rendering items
    if(items.length <= 12) {
        for(let i = 0; i < 12 - items.length; i++) {
            inputItemsContainer.appendChild(getItemBox({type: "empty"}))
        }
    }
    else {
        let remainingBoxes = 6 - items.length % 6
        for(let i = 0; i < remainingBoxes; i++) {
            inputItemsContainer.appendChild(getItemBox({type: "empty"}))
        }
    }
    inputItemsContainer.scrollBy({top: inputItemsContainer.offsetHeight})

    renderOutput()
}

// Render recycled items
function renderOutput() {
    outputItems = recycleAll(inputItems, fullRecycle)

    outputItemsContainer.innerHTML = ""

    let items = Object.keys(outputItems)

    // Adding recycling items to the output container
    items.forEach( item => {
        let count = outputItems[item]
        outputItemsContainer.appendChild(getItemBox({type: "output", item: item, count: count}))
    })

    // Rendering items
    if(items.length <= 12) {
        for(let i = 0; i < 12 - items.length; i++) {
            outputItemsContainer.appendChild(getItemBox({type: "empty"}))
        }
    }
    else {
        let remainingBoxes = 6 - items.length % 6
        if(remainingBoxes != 0) {
            for(let i = 0; i < remainingBoxes; i++) {
                outputItemsContainer.appendChild(getItemBox({type: "empty"}))
            }
        }
    }
    outputItemsContainer.scrollBy({top: outputItemsContainer.offsetHeight})
}

// Search
search.addEventListener("input", () => {
    let needle = search.value
    renderItems(needle)
})

// Clear Input
clearButton.addEventListener("click", () => {
    inputItems = {}
    renderInput()
})

// Enable / Disable full recycle
fullRecycleCheckbox.addEventListener("change", () => {
    fullRecycle = fullRecycleCheckbox.checked
    renderInput()
})


// Init page
renderItems("")
renderInput()
