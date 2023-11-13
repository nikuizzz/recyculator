import data from "./recycling.json" assert { type: 'json' }

var rItems = data
var rKeys = Object.keys(data)

// console.log(rItems)
// console.log(rKeys)

function sumItems(items) {
    itemsToDelete = []

    // Searching for duplicated ressources, summing amounts
    for(let i = 0; i < items.length; i++) {
        let name = items[i][0]

        for(let j = i; j < items.length - 1; j++) {
            let compare_name = items[j+1][0]

            if(name === compare_name) {
                items[i][1] += items[j+1][1]

                // Each duplicated item in items array is set to ["", 0]
                // so we can remove duplicates easily after
                items[j+1] = ["", 0]

                itemsToDelete.push(j+1)
            }
        }
    }

    // Removing duplicates with Set
    items = Array.from(new Set(items))


    // Removing last ["", 0]
    items.pop(items.findIndex( (element) => {
        return element == ["", 0]
    }))

    return items
}

function recycle(resource, amount) {
    let result = {}
    let item = resource

    // Veryfiying if item can be recycled
    if(rKeys.includes(item)) {
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
    // If item is not in rItems
    else {
        result[item] = amount
        return result
    }
}

function recycleAll(items, fullRecycle) {
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
                    result = recycleAll(result, true)
                    break
                }
            }

            isFullyRecycled = true
        }
    }

    return sumItems(result)
}

console.log(recycleAll({"Sewing Kit": 1, "Gears": 10, "Rope": 5, "Assault Rifle": 2, "Auto Turret": 3}, false))