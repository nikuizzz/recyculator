import os
from PIL import Image

input_folder_path = "./www/misc/backgrounds/"
output_folder_path = "./www/misc/backgrounds/"

image_paths = os.listdir(input_folder_path)

size = 1920, 1080

for path in image_paths:
    original_image = Image.open(input_folder_path + path)
    resized_image = original_image.resize(size, Image.LANCZOS)
    resized_image.save(output_folder_path + path)