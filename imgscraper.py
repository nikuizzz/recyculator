from pprint import pprint
import requests
import shutil
import json
from colors import Colors
import os

# metal.fragments.png
global_path = "./www/misc/items/"
global_url = "https://rustlabs.com/img/items40/" 

file = open("./www/javascript/recycling.json", "r")
data = json.load(file)
file.close()

items_names = data.keys()
items_count = len(items_names)

for index, item in enumerate(items_names):
    img_name = data[item]["path"]

    if img_name in os.listdir(global_path):
        continue

    print(f"Downloading {Colors.CYELLOW + img_name + Colors.CEND} ( {index}/{items_count} )")
    url = global_url + img_name
    res = requests.get(url, stream = True)

    save_path = global_path + img_name
    if res.status_code == 200:
        with open(save_path,'wb') as f:
            shutil.copyfileobj(res.raw, f)
    else:
        print(f'Error getting {img_name} image')



