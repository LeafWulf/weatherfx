import { MODULE } from "./const.js"

export let autoApply = true;
export let enableSound = false;
export let blizzardSound = 'modules/michaelghelfi/ambience/Snowing.ogg';
export let rainSound = 'modules/ivan-duch-music-packs/audio/rain-sfx.ogg';
export let thunderstormSound  = 'modules/michaelghelfi/ambience/RainandThunder.ogg';
export let heavyRainSound = 'modules/ivan-duch-music-packs/audio/rain-sfx.ogg';

export function registerSettings() {
    game.settings.register(MODULE, 'autoApply', {
        name: 'Automatic Apply',
        hint: `Check this option if you would like to have weather effects automatic applied to the current scene.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: () => {
            cacheWfxSettings();
        },
    });

    game.settings.register(MODULE, 'enableSound', {
        name: 'Enable sound',
        hint: `Play sound effects along with the visual weather effects (The default are sounds from the modules: Ivan Duch's Music Packs and Michael Ghelfi Studios Audio Pack, so you would need to install these modules as well or set your own custom sounds).`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        restricted: true,
        onChange: () => {
            cacheWfxSettings();
        },
    });

    game.settings.register(MODULE, 'blizzardSound', {
        name: 'Custom sounds effects: Blizzard',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: String,
        filePicker: 'audio',
        default: 'modules/michaelghelfi/ambience/Snowing.ogg',
        restricted: true,
        onChange: () => {
            cacheWfxSettings();
        },
    });

    game.settings.register(MODULE, 'rainSound', {
        name: 'Custom sounds effects: Rain',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: String,
        filePicker: 'audio',
        default: 'modules/ivan-duch-music-packs/audio/rain-sfx.ogg',
        restricted: true,
        onChange: () => {
            cacheWfxSettings();
        },
    });

    game.settings.register(MODULE, 'thunderstormSound', {
        name: 'Custom sounds effects: Storm',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: String,
        filePicker: 'audio',
        default: 'modules/michaelghelfi/ambience/RainandThunder.ogg',
        restricted: true,
        onChange: () => {
            cacheWfxSettings();
        },
    });

    game.settings.register(MODULE, 'heavyRainSound', {
        name: 'Custom sounds effects: Heavy Rain',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: String,
        filePicker: 'audio',
        default: 'modules/ivan-duch-music-packs/audio/rain-sfx.ogg',
        restricted: true,
        onChange: () => {
            cacheWfxSettings();
        },
    });
}

// function that get the settings options and assign to the variables
export function cacheWfxSettings() {
    enableSound = game.settings.get(MODULE, 'enableSound');
    blizzardSound = game.settings.get(MODULE, 'blizzardSound');
    rainSound = game.settings.get(MODULE, 'rainSound');
    thunderstormSound = game.settings.get(MODULE, 'thunderstormSound');
    heavyRainSound = game.settings.get(MODULE, 'heavyRainSound');
    autoApply = game.settings.get(MODULE, 'autoApply');
}