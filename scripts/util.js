import { MODULE, MODULE_DIR, JSON_ITEM } from "./const.js";

export function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
}

export function getTemp(string) {
    let input = ''
    for (var i = 0; i < string.length; i++) {
        if (string[i] === " ") {
            return parseFloat(input);
        } else {
            input += string[i];
        }
    }
}

export function getItemDesc() {
    let itemCollection = game.actors.getName('Weather Effects').items
    let itemDescArray = []
    let itemDesc, fileJson

    itemCollection.contents.forEach(function (item) {
        itemDesc = item.system.description.value;
        itemDescArray.push({
            name: item.name,
            description: itemDesc,
            save: {
                dc: item.system.save.dc,
                ability: item.system.save.ability
            }
        });
    });
    fileJson = JSON.stringify(itemDescArray)
    var blob = new Blob([fileJson], { type: 'text/plain' });
    var file = new File([blob], 'weather-item.json', { type: "text/plain" });
    FilePicker.upload('data', MODULE_DIR, file, {}, { notify: true })
}

// class itemWeather {
//     constructor(name, description) {
//         this.name = name
//         this.description = description
//         this.save = {
//             dc: item.system.save.dc,
//             ability: item.system.save.ability
//         }
//     }
// }
