import { MODULE_DIR, JSON_ITEM } from "./const.js";

// roll to the chat the conditions, dnd 5e homebrew
export async function weatherRoll(item) {
    // item.use();
    let weatherArray = await jsonItem();
    let weather = weatherArray.find(i => i.name === item)
    let saveButton = ''
    if (weather.save.dc != null) {
        saveButton = `<div class="card-buttons">
                    <button data-action="save" data-ability=${weather.save.ability}>
                    Saving Throw DC ${weather.save.dc} ${weather.save.ability}
                    </button></div>`
    }
    let msgContent = `<div class="dnd5e chat-card item-card"><header class="card-header flexrow">
                    <img src='${MODULE_DIR}/${weather.img}' title=${weather.name} width="36" height="36">
                    <h3 class="item-name">${weather.name}</h3></header>
                    <div class="card-content">${weather.description}</div>
                    ${saveButton}<footer class="card-footer"></footer></div>`
    ChatMessage.create({
        speaker: { alias: 'Weather FX: ' }, content: msgContent,
        whisper: ChatMessage.getWhisperRecipients("GM")
    })
}

// Read the json weather 'item' file.
async function jsonItem() {
    let file = await fetch(JSON_ITEM);
    let array = await file.json();
    return array;
}