// import { removeTags, getTemp } from "./util.js"
import { createEffect } from "./effect.js"

function weatherEffects(effectCondition) {
    console.log('🐺******** effectCondition: ', effectCondition);
    let item = game.actors.getName('Weather Effects').items.find(i => i.name === effectCondition.type)
    let pathToObject = 'scene.flags.fxmaster.effects.' + effectCondition.type
    let object = canvas

    Hooks.call('fxmaster.updateParticleEffects', []);
    FXMASTER.filters.setFilters([]);


    if (effectCondition.effectsArray.length > 0)
        Hooks.call('fxmaster.updateParticleEffects', effectCondition.effectsArray)

    if (effectCondition.filtersArray.length > 0) {
        FXMASTER.filters.setFilters(effectCondition.filtersArray)
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

    if (effectCondition.type = '')
        return;
    else
        return weatherRoll(item);
}

function weatherRoll(item) {
    item.use();
}

// Hooks.once('init', async function() {
//     console.log('🐺 ==== hook init')
// });

Hooks.once('ready', async function () {
    console.log('🐺 ==== hook ready')
});

Hooks.on('createChatMessage', async function (message) {
    let msgString = message.content.toLowerCase()

    if (message.speaker.alias == `Today's Weather:`) {
        // let temp = getTemp(removeTags(message.content))
        // if (temp > 37)
        //     
        // else if (temp < -2)
        //     
        // else
        //     

        if (msgString.includes('rain')) {
            if (msgString.includes('heavy') || msgString.includes('monsoon') || msgString.includes('flooding')) {
                return weatherEffects(createEffect('heavyRain'));
            }
            else if (msgString.includes('firey')) {
                return console.log('🐺******** Preciso fazer ainda: FIERY');
            }
            else if (msgString.includes('freezing')) {
                return weatherEffects(createEffect('freezingRain'));
            }
            else if (msgString.includes('torrential')) {
                return weatherEffects(createEffect('thunderstorm'));
            }
            else
                return weatherEffects(createEffect('rain'));
        }

        else if (msgString.includes('overcast')) {
            switch (true) {
                case msgString.includes('freezing'): return weatherEffects(createEffect('overcastFreezing'));
                case msgString.includes('drizzles'): return weatherEffects(createEffect('overcastDrizzle'));
                case msgString.includes('snow'): return weatherEffects(createEffect('overcastSnow'));
            }
        }

        else if (msgString.includes('snow')) {
            switch (true) {
                case msgString.includes('Large amount'): return weatherEffects(createEffect('snowFall'));
                case msgString.includes('A light to moderate'): return weatherEffects(createEffect('lightSnow'));
            }
        }
        else if (msgString.includes('blizzard'))
            return weatherEffects(createEffect('blizzard'));

        else if (msgString.includes('clear sky'))
            return weatherEffects(createEffect('clearSky'));

        else if (msgString.includes('dark'))
            return weatherEffects(createEffect('darkSky'));

        else if (msgString.includes('scattered clouds'))
            return weatherEffects(createEffect('scatteredClouds'));

        else if (msgString.includes('sun') || msgString.includes('volcano'))
            return weatherEffects(createEffect('sunAsh'));

        else if (msgString.includes('ashfall') || msgString.includes('ashen'))
            return weatherEffects(createEffect('ashfall'));

        else if (msgString.includes('drought'))
            return weatherEffects(createEffect('drought'));

    }
});