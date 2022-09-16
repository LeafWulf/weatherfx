import { MODULE } from "./const.js"

export let enableSound = false;
export let customSound = false;
export let blizzardSound = 'modules/michaelghelfi/ambience/Snowing.ogg';
export let rainSound = 'modules/soundfxlibrary/Nature/Loops/Rain/rain-1.mp3';
export let thunderstormSound  = 'modules/michaelghelfi/ambience/RainandThunder.ogg';
export let heavyRainSound = 'modules/ivan-duch-music-packs/audio/rain-sfx.ogg';
export let applyWeatherTo = 'activeScene';

export function registerSettings() {
    game.settings.register(MODULE, 'enableSound', {
        name: 'Enable sound',
        hint: `Play sound effects along with the visual weather effects (The default are sounds from the modules: Ivan Duch's Music Packs, Michael Ghelfi Studios Audio Pack, so you would need to install these modules as well or set your own custom sounds).`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        restricted: true
    });

    game.settings.register(MODULE, 'customSound', {
        name: 'Custom sounds effects',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        restricted: true
    });

    game.settings.register(MODULE, 'blizzardSound', {
        name: 'Custom sounds effects: Blizzard',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: String,
        filePicker: 'audio',
        default: 'modules/michaelghelfi/ambience/Snowing.ogg',
        restricted: true
    });

    game.settings.register(MODULE, 'rainSound', {
        name: 'Custom sounds effects: Rain',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: String,
        filePicker: 'audio',
        default: 'modules/soundfxlibrary/Nature/Loops/Rain/rain-1.mp3',
        restricted: true
    });

    game.settings.register(MODULE, 'thunderstormSound', {
        name: 'Custom sounds effects: Storm',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: String,
        filePicker: 'audio',
        default: 'modules/michaelghelfi/ambience/RainandThunder.ogg',
        restricted: true
    });

    game.settings.register(MODULE, 'heavyRainSound', {
        name: 'Custom sounds effects: Heavy Rain',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: String,
        filePicker: 'audio',
        default: 'modules/ivan-duch-music-packs/audio/rain-sfx.ogg',
        restricted: true
    });

    game.settings.register(MODULE, 'applyWeatherTo', {
        name: 'Would you rather have weather effects applied: ',
        hint: 'Either apply the weather effects on the current scene only or on all scenes.',
        scope: 'world',
        config: true,
        type: String,
        choices: {
            "activeScene": "Only for the active scene.",
            "allScene": "For all scenes."
        },
        default: 'activeScene',
        restricted: true
    });
}

export function cacheWfxSettings() {
    enableSound = game.settings.get(MODULE, 'enableSound');
    customSound = game.settings.get(MODULE, 'customSound');
    blizzardSound = game.settings.get(MODULE, 'blizzardSound');
    rainSound = game.settings.get(MODULE, 'rainSound');
    thunderstormSound = game.settings.get(MODULE, 'thunderstormSound');
    heavyRainSound = game.settings.get(MODULE, 'heavyRainSound');
    applyWeatherTo = game.settings.get(MODULE, 'applyWeatherTo');
}