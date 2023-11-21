import data from "./recycling.json" assert { type: 'json' }

export var rItems = data
export var rKeys = Object.keys(data)

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