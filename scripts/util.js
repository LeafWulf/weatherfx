import { MODULE_DIR, JSON_ITEM } from "./const.js";

export function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
}/*  */

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

export async function weatherRoll(item) {
    // item.use();
    let weatherArray = await jsonItem();
    let weather = weatherArray.find(i => i.name === item)
    let saveButton = ''
    if (weather.save.dc != null) {
        saveButton = `<div class="card-buttons">
                    <button data-action="save" data-ability=${weather.save.ability}>
                        Saving Throw DC ${weather.save.dc} ${weather.save.ability}
                    </button>
                    </div>`
    }
    let msgContent = `<div class="dnd5e chat-card item-card">
                    <header class="card-header flexrow">
                        <img src="" title=${weather.name} width="36" height="36">
                        <h3 class="item-name">${weather.name}</h3>
                    </header>
                    <div class="card-content">${weather.description}
                    </div>
                    ${saveButton}    
                    <footer class="card-footer">
                    </footer>
                    </div>`
    ChatMessage.create({ speaker: { alias: 'Weather Effects: ' }, content: msgContent })
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

async function jsonItem() {
    let file = await fetch(JSON_ITEM);
    let array = await file.json();
    return array;
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
