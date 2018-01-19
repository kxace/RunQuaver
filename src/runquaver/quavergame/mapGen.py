import random as rand
import json

map = [{
    'height' : 300,
    'width' : 200,
    'left' : 0
}]
marginLeft = map[0].get('width') + int(rand.random() * 25) * 2 + 20
for i in range(500):
    random = rand.random()
    height = 150 + int(random * 300 - 100)
    width = 100 + int(random * 100 - 50)
    map.append({
        'height' : height,
        'width': width,
        'left': marginLeft
    })
    marginLeft += width + int(rand.random() * 50) * 2 + int(random * 50)
print(json.dumps(map))
text_file = open("./templates/quavergame/map.json", "w")
text_file.write(json.dumps(map))
text_file.close()
