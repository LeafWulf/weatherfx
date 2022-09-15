import { ashfall, blizzard, freezingCold, scorchingHeat, heavyRain, clearSkies, rain, thunderstorm, snow } from "./weather-config.js"
import { removeTags, getTemp } from "./util.js"
//heavyClouds,  lightClouds,

function getObject(t, path) {
    return path.split(".").reduce((r, k) => r?.[k], t);
}

function weatherEffects(effectCondition) {
    let item = game.actors.getName('Weather Effects').items.find(i => i.name === effectCondition.name)
    let pathToObject = 'scene.flags.fxmaster.effects.' + effectCondition.name
    let object = canvas

    Hooks.call('fxmaster.updateParticleEffects', []);
    FXMASTER.filters.setFilters([]);


    if (effectCondition.effects)
        Hooks.call('fxmaster.updateParticleEffects', effectCondition.effectsArray)

    if (effectCondition.filtersArray.length > 0) {
        for (let i = 0; i < effectCondition.filtersArray.length; i++) {
            FXMASTER.filters.addFilter(effectCondition.name + i, effectCondition.filters[i], effectCondition.filtersArray[i])
        }
    }

    if (effectCondition.hasSound) {
        let playlist = game.playlists.getName("Weather");
        let sound = playlist.sounds.getName(effectCondition.name);
        if (sound.playing) {
            sound.update({ volume: 0.30 });
            playlist.stopSound(sound);
        } else {
            sound.update({ volume: 1.00 });
            playlist.playSound(sound);
        }
    }

    return weatherRoll(item);

/*     if (canvas.scene.getFlag("fxmaster", "effects") === undefined) {
        return weatherRoll(item);
    } else if (getObject(object, pathToObject) === undefined) {
        return weatherRoll(item);
    } else {
        ui.notifications.info(`Climate condition: <b>${item.name}</b> passed.`)
    } */
}

function weatherRoll(item) {
    // let lastTodaysWeather = game.messages.filter(i => i.alias == `Today's Weather:`).sort((a, b) => b.timestamp - a.timestamp)[0];
    item.use();
    // if (lastTodaysWeather == undefined)
    //     ui.notifications.info(`Climate condition: <b>${item.name}</b>`);
    // else {
    //     let contentMsg = lastTodaysWeather.content
    //     ui.notifications.info(contentMsg)
    //     ChatMessage.create({ speaker: { alias: 'Weather Alert: ' }, content: `<h3><img src='${item.img}' width='32' style='border:none'> ${contentMsg}</h3>` })
    // }
}

// Hooks.once('init', async function() {
//     console.log('🐺 ==== hook init')
// });

Hooks.once('ready', async function () {
    console.log('🐺 ==== hook ready')
});

function tempFilter(effectCondition = {}, itemUse = false) {
    FXMASTER.filters.setFilters([]);
    if (effectCondition = {})
        return;
    if (effectCondition.filters.length > 0) {
        for (let i = 0; i < effectCondition.filtersArray.length; i++) {
            FXMASTER.filters.addFilter(effectCondition.name + i, effectCondition.filters[i], effectCondition.filtersArray[i])
        }
    }

    return

}

Hooks.on('createChatMessage', async function (message) {
    //let msgArray = game.messages.contents
    //let lastMsg = msgArray[msgArray.length - 1]
    let msgString = message.content.toLowerCase()

    if (message.speaker.alias == `Today's Weather:`) {
        // let temp = getTemp(removeTags(message.content))
        // if (temp > 37)
        //     tempFilter(scorchingHeat);
        // else if (temp < -2)
        //     tempFilter(freezingCold);
        // else
        //     tempFilter();

        if (msgString.includes('rain')) {
            if (msgString.includes('heavy') || msgString.includes('monsoon') || msgString.includes('flooding')) {
                return weatherEffects(heavyRain);
            }
            else if (msgString.includes('fiery')) {
                return console.log('🐺******** Preciso fazer ainda: FIERY');
            }
            else if (msgString.includes('freezing')) {
                return weatherEffects(freezingRain);
            }
            else if(msgString.includes('torrential')){
                return weatherEffects(thunderstorm);
            }
            else
                return weatherEffects(rain);
        }

        if (msgString.includes('snow')) {
            return weatherEffects(snow);;
        }
        if (msgString.includes('blizzard')) {
            return weatherEffects(blizzard);
        }

        if (msgString.includes('ash')) {
            return weatherEffects(ashfall);
        }
        /* 
        else if (msgString.includes('fiery')){
            return console.log('🐺******** Preciso fazer ainda: FIERY');
        }
        else if (msgString.includes('fiery')){
            return console.log('🐺******** Preciso fazer ainda: FIERY');
        } */

    }


});

//Hooks.on("renderChatMessage", async (message) => {
    //if(!game.user.isGM) return;
    //if(!message.content.includes("Success!")) return;
    //if (lastMsg.speaker.alias == `Today's Weather:`)
        //console.log('🐺 so far so good')
/* your code here */
  //});