import os
from PIL import Image

# input_folder_path = "./www/misc/backgrounds/"
# output_folder_path = "./www/misc/backgrounds/"

input_folder_path = "./www/misc/items180/"
output_folder_path = "./www/misc/items80/"

image_paths = os.listdir(input_folder_path)

# size = 1920, 1080
size = 80, 80

for path in image_paths:
    original_image = Image.open(input_folder_path + path)
    resized_image = original_image.resize(size, Image.LANCZOS)
    resized_image.save(output_folder_path + path)