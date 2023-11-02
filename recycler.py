import json
import pprint
import colors

class Recycler:
    rItems = json.load(open("./recycling.json", "r"))
    rKeys = rItems.keys()

    @staticmethod
    def sumItems(items: list):
        
        itemsToDelete = []
        for i in range(len(items)):
            resource_name = items[i][0]

            for j in range(i, len(items)-1):
                resource_name_compare = items[j+1][0]

                if resource_name == resource_name_compare:
                    items[i][1] += items[j+1][1] # summing amounts
                    items[j+1] = ["",0] # deleting current element
                    itemsToDelete.append(j+1)
        
        # Removing duplicates ( ["", 0])
        items = set(tuple(item) for item in items)
        
        # Converting back to a list of lists ( instead of a list of tuples )
        items = [list(item) for item in items]
        
        # Removing last ["", 0]
        if ["",0] in items:
            items.pop(items.index(["", 0]))

        return items

    @staticmethod
    def recycleAll(items: list, fullRecycle: bool):
        """
        Gets a list of items as arguments and returns a list of the
        recycled items
        fullRecycling means that the item will be fully recycled
        until there's only raw materials
        """
        result = []

        # Cycling trough every item in the argument list
        for item in items:
            resource_name = item[0]
            resource_amount = item[1]
        
            recycledItems = Recycler.recycle(resource_name, resource_amount)
            
            for recycledItem in recycledItems:
                result.append(recycledItem)
        
        if fullRecycle:
            isFullyRecycled = False

            while not isFullyRecycled:
                for item in result:
                    resource_name = item[0]
                    if resource_name in Recycler.rKeys:
                        result = Recycler.recycleAll(result, True)
                        break

                isFullyRecycled = True

        return Recycler.sumItems(result)



    @staticmethod
    def recycle(item: str, amount: int) -> list:
        """
        Takes an item as argument and return its recycled value as a list of item
        fullRecycling means that the item will be fully recycled
        until there's only raw materials
        """

        result = []
        # Checking if item is valid
        if item in Recycler.rKeys:
            resources = Recycler.rItems[item]["resources"]

            # Adding raw materials
            for key, value in zip(resources.keys(), resources.values()): 
                resource_name = key
                resource_value = int(value[0]) * ( int(value[1]) / 100 ) * amount

                result.append([resource_name, resource_value])
            return result
      
        else:
            return [[item, amount]]
        

items_to_recycle = [
    ["Bed", 1.0],
    ["Sewing Kit", 1.0]
]

recycled = Recycler.recycleAll(items_to_recycle, True)
print(recycled)

final = Recycler.sumItems(recycled)
print(final)

# print(Recycler.recycle("Metal Fragments", 2))

# test = [0,1,2,3,4,5,6]
# print(test[:1] + test[2:])