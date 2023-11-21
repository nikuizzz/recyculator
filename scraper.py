from bs4 import BeautifulSoup
from pprint import pprint
import requests
import json
from colors import Colors

headers={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0","Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}
resp = requests.get("https://rustlabs.com/entity/recycler#tab=recyclelist", headers=headers)

if not resp.ok:
    print(Colors.CRED + "REQUESTS FAILED" + Colors.CEND)
    exit()

bs = BeautifulSoup(resp.text, 'html.parser')
items = {}

# Cycling through each table row to get every recyclable item name
for cell in bs.findAll('tr')[1::]:
    links = cell.findAll("a")
    path = cell.find("img")['src'].split("/")[-1].replace("%","")

    # Getting the name of the item
    name = links[0].text

    isRecyclable = True
    
    category = cell.findAll("td")[-1].text

    item = {
        "name": name,
        "recyclable": isRecyclable,
        "link": links,
        "path": path,
    }

    items[name] = item

for key in list(items.keys()).copy():
    element = items[key]
    name = element["name"] 
    isRecyclable = element["recyclable"] 
    path = element["path"] 
    links = element["link"]

    # Cycling through each recycle result
    # Getting recycle results and chances 
    resources = {}
    for link in links[1::]:
        resource_name = link.find("img")['title']

        # Adding the resource in the items dict if it is not already inside of it
        # It allows to get every raw material that we can get from recycling items
        if resource_name not in items.keys():
            r_path = link.find("img")['src'].split("/")[-1].replace("%", "")

            item = {
                "name": resource_name,
                "recyclable": False,
                "resources": {},
                "category": "Resource",
                "path": r_path,
            }

            items[resource_name] = item

        resource_count = link.find("span", {"class": "text-in-icon"}).text
        probability = "100"

        if len(resource_count) == 0:
            resource_count = "1"
        else:
            # Ropes
            if "ft" in resource_count:
                resource_count = resource_count.split(" ft")[0]
            # Recycle with probabilty
            elif "%" in resource_count:
                probability = resource_count[:-1]
                resource_count = "1"
            # All other cases ("x")
            else:
                resource_count = resource_count[1::]

        resource_count = resource_count.replace(",", "")
        resources[resource_name] = [resource_count, probability]

    # Getting category
    category = cell.findAll("td")[-1].text

    if name == "Low Grade Fuel":
        isRecyclable = False

    item = {
        "name": name,
        "recyclable": isRecyclable,
        "resources": resources,
        "category": category,
        "path": path,
    }

    items[name] = item


# with open("./www/javascript/recycling.json", "w") as file: 
#     json.dump(items, file, indent=4)

with open("./recycling.json", "w") as file: 
    json.dump(items, file, indent=4)