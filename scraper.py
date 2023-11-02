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

for cell in bs.findAll('tr')[1::]:
    links = cell.findAll("a")

    # Getting the name of the item
    name = links[0].text

    # Getting recycle results and chances 
    resources = {}
    for link in links[1::]:
        resource_name = link.find("img")['title']
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

        resources[resource_name] = [resource_count, probability]

    # Getting category
    category = cell.findAll("td")[-1].text

    item = {
        "name": name,
        "resources": resources,
        "category": category,
    }

    items[name] = item

with open("recycling.json", "w") as file: 
    json.dump(items, file, indent=4)