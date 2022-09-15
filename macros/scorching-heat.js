let effectCondition = 'Scorching Heat'
let hasSound = false
let filtersName = ['color'] //order: 'color', 'bloom'
let effectsArray = [{
    "name": effectCondition,
    "type": "clouds",
    "options": {
        "scale": 1,
        "direction": 90,
        "speed": 0.5,
        "lifetime": 2,
        "density": 0.003,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}]
let filtersArray = [{
    "color": {
        "apply": true,
        "value": "#fef486"
    },
    "saturation": 1,
    "contrast": 1,
    "brightness": 1.2,
    "gamma": 1,
    "red":0.996078431372549,"green":0.9568627450980393,"blue":0.5254901960784314
}]

let getObject = (t, path) =>
    path.split(".").reduce((r, k) => r?.[k], t)

function weatherEffects(effectCondition, hasSound = false, filtersName = [], effectsArray, filtersArray) {
    let item = game.actors.getName('Weather Effects').items.find(i => i.name === effectCondition)
    let pathToObject = 'scene.data.flags.fxmaster.effects.' + effectCondition
    let object = canvas
    let fx = {}

    for (let i = 0; i < effectsArray.length; i++) {
        Hooks.call('fxmaster.switchWeather', effectsArray[i])
    }

    for (let i = 0; i < filtersArray.length; i++) {
        FXMASTER.filters.switch(effectCondition + i, filtersName[i], filtersArray[i])
    }

    if (hasSound) {
        let playlist = game.playlists.getName("Weather");
        let sound = playlist.sounds.getName(effectCondition);
        if (sound.playing) {
            sound.update({ volume: 0.30 });
            playlist.stopSound(sound);
        } else {
            sound.update({ volume: 1.00 });
            playlist.playSound(sound);
        }
    }

    if (canvas.scene.getFlag("fxmaster", "effects") === undefined) {
        return weatherRoll(item);
    } else if (getObject(object, pathToObject) === undefined) {
        return weatherRoll(item);
    } else {
        ui.notifications.info('Condições do tempo zeradas')
    }
}

function weatherRoll(item) {
    let lastTodaysWeather = game.messages.filter(i => i.alias == `Today's Weather:`).sort((a, b) => b.data.timestamp - a.data.timestamp)[0];
    item.roll();
    if (lastTodaysWeather == undefined)
        ui.notifications.info(`Condição do tempo: <b>${item.name}</b>`);
    else {
        let contentMsg = lastTodaysWeather.data.content
        ui.notifications.info(contentMsg)
        ChatMessage.create({ speaker: { alias: 'Alerta Tempo: ' }, content: `<h3><img src='${item.data.img}' width='32' style='border:none'> ${contentMsg}</h3>` })
    }
}

weatherEffects(effectCondition, hasSound, filtersName, effectsArray, filtersArray);