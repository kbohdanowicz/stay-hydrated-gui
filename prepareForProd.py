import os
import json

try:
    os.remove("./resources/images/notification.png")
except:
   pass


FILENAME = "./settings/settings.json"

with open(FILENAME, "r") as file:
    data = json.load(file)
    data["trayIcon"] = "None"
    data["soundCue"] = "None"
    data["soundsDirectory"] = "None"
    data["imagesDirectory"] = "None"
    data["notification"]["image"] = "None"
    data["notification"]["enabled"] = False
    data["isFirstRun"] = True
with open(FILENAME, "w") as file:
    json.dump(data, file, indent=2)

print("App prepared for production")