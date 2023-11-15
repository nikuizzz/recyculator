from pprint import pprint
import requests
import shutil
import json
from colors import Colors
import os

# metal.fragments.png
global_path_40 = "./www/misc/items40/"
global_url_40 = "https://rustlabs.com/img/items40/" 

global_path_180 = "./www/misc/items180/"
global_url_180 = "https://rustlabs.com/img/items180/" 

file = open("./www/javascript/recycling.json", "r")
data = json.load(file)
file.close()

items_names = data.keys()
items_count = len(items_names)

# Choose between 40 and 180 ( > better quality )
quality = "180"

if quality == "40":
    global_path = global_path_40
    global_url = global_url_40
elif quality == "180":
    global_path = global_path_180
    global_url = global_url_180
else:
    print(Colors.CRED + "Error getting image quality" + Colors.CEND)

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



