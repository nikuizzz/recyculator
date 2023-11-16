import data from "./recycling.json" assert { type: 'json' }

export var rItems = data
export var rKeys = Object.keys(data)

// console.log(rItems)
// console.log(rKeys)

// Delete??
export function sumItems(items) {
    // Searching for duplicated ressources, summing amounts
    console.log(items)
    for(let i = 0; i < items.length; i++) {
        let name = items[i][0]

        for(let j = i; j < items.length - 1; j++) {
            let compare_name = items[j+1][0]

            if(name === compare_name) {
                items[i][1] += items[j+1][1]

                // Each duplicated item in items array is set to ["", 0]
                // so we can remove duplicates easily after
                items[j+1] = ["", 0]
            }
        }
    }

    // console.log(items)
    // Removing duplicates with Set
    // items = Array.from(new Set(items))

    // // Removing last ["", 0]
    // items.pop(items.findIndex( (element) => {
    //     return element == ["", 0]
    // }))

    return items
}

export function recycle(item, amount) {
    let result = {}
    let isRecyclable 

    // Veryfiying if item can be recycled
    if(rKeys.includes(item)) {
        if(rItems[item]["recyclable"]) {
            let resources = Object.entries(rItems[item]["resources"])

            // Adding recycled materials to result
            for(let i = 0; i < resources.length; i++) {

                let resourceName = resources[i][0]
                let recycleAmount = resources[i][1][0]
                let chance = resources[i][1][1]

                let value = recycleAmount * (chance / 100) * amount

                result[resourceName] = value;
            }

            return result
        }
    }
    // If item is not in rItems
    result[item] = amount
    return result
}

export function recycleAll(items, fullRecycle) {
    // items -> { "Cloth": 10, "Rope": 3}...
    let result = {}

    Object.keys(items).forEach(key => {
        let recycled = recycle(key, items[key]) // key -> name of item, items[key] -> amount to recycle
        
        Object.keys(recycled).forEach(recycledKey => {
            if(recycledKey in result) {
                result[recycledKey] += recycled[recycledKey]
            } else {
                result[recycledKey] = recycled[recycledKey]
            }
        })
    });

    if(fullRecycle) {
        let isFullyRecycled = false
        let keys = Object.keys(result)

        while(!isFullyRecycled) {


            for(let i = 0; i < keys.length; i++) {
                let resourceName = keys[i]

                if(rKeys.includes(resourceName)) {
                    if(rItems[resourceName]["recyclable"]) {
                        result = recycleAll(result, true)
                        break
                    }
                }
            }

            isFullyRecycled = true
        }
    }

    return result
}

// console.log("result recycling : ")
console.log(recycleAll({"Sewing Kit": 3, "Rope": 10, "Tarp": 3, "Gears": 3, "Electric Fuse": 4}, true))