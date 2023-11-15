from pprint import pprint
import requests
import shutil
import json
from colors import Colors
import os

headers={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0","Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}

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
    res = requests.get(url, stream = True, headers=headers)

    save_path = global_path + img_name
    if res.status_code == 200:
        with open(save_path,'wb') as f:
            shutil.copyfileobj(res.raw, f)
    else:
        print(f'Error getting {Colors.CRED + img_name + Colors.CEND} image, code {Colors.CRED + str(res.status_code) + Colors.CEND}')



