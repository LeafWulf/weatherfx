import { MODULE, MODULE_DIR, JSON_ITEM } from "./const.js"; //import the const variables

export function removeTags(str) { //function to remove html tags from the message string
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
}

export function getTemp(string) { //function to get the temperature from the message string, currently not been used.
    let input = ''
    for (var i = 0; i < string.length; i++) {
        if (string[i] === " ") {
            return parseFloat(input);
        } else {
            input += string[i];
        }
    }
}

//function to generate a json from an actual in-game item inside a particular actor called 'Weather Effects', could be reused in future.
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