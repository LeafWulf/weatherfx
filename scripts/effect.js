import {blizzardSound, rainSound, thunderstormSound, heavyRainSound, applyWeatherTo} from "./settings.js";

class Effect {
    constructor(name, type, hasSound, sound, effectsArray, filtersArray) {
        this.name = name
        this.type = type
        this.hasSound = hasSound
        this.sound = sound
        this.effectsArray = effectsArray
        this.filtersArray = filtersArray
    }
}

export function createEffect(effectName) {
    let effectCondition = {};
    switch (effectName) {
        case 'rain': return effectCondition = new Effect(effectName, 'Rain', true, eval(effectName + 'Sound'), [moderateRain, grayClouds, lightFog], [])
        case 'heavyRain': return effectCondition = new Effect(effectName, 'Heavy Rain', true, eval(effectName + 'Sound'), [heavyRain, heavyClouds, moderateFog], [darkClimate])
        case 'freezingRain': return effectCondition = new Effect(effectName, 'Freezing Cold', false, '', [moderateRain, grayClouds, lightFog], [coldClimate])
        case 'thunderstorm': return effectCondition = new Effect(effectName, 'Thunderstorm', true, eval(effectName + 'Sound'), [heavyRain, heavyClouds, moderateFog], [darkClimate, lightning])
        case 'fireyRain': return effectCondition = new Effect(effectName, 'Scorching Heat', false, '', [], [])
        case 'snowFall': return effectCondition = new Effect(effectName, 'Snow', false, '', [snowFall, snowClouds, snowFog], [coldClimate])
        case 'lightSnow': return effectCondition = new Effect(effectName, 'Snow', false, '', [lightSnow, snowClouds, snowFog], [])
        case 'blizzard': return effectCondition = new Effect(effectName, 'Blizzard', true, eval(effectName + 'Sound'), [blizzard, snowClouds, snowFog], [coldClimate])
        case 'ashfall': return effectCondition = new Effect(effectName, 'Ashfall', false, '', [ashes, grayFog], [])
        case 'sunAsh': return effectCondition = new Effect(effectName, 'Ashfall', false, '', [ashes, grayFog], [darkClimate])
        case 'clearSky': return effectCondition = new Effect(effectName, 'Clear Skies', false, '', [], [])
        case 'darkSky': return effectCondition = new Effect(effectName, 'Heavy Clouds', false, '', [heavyClouds], [darkClimate])
        case 'scatteredClouds': return effectCondition = new Effect(effectName, 'Light Clouds', false, '', [moderateClouds], [])
        case 'overcastFreezing': return effectCondition = new Effect(effectName, 'Heavy Clouds', false, '', [lightRain, grayClouds], [coldClimate])
        case 'overcastDrizzle': return effectCondition = new Effect(effectName, 'Heavy Clouds', false, '', [lightRain, grayClouds], [])
        case 'overcastSnow': return effectCondition = new Effect(effectName, 'Freezing Cold', false, '', [lightSnow, snowClouds], [coldClimate])
        case 'drought': return effectCondition = new Effect(effectName, '', false, '', [], [hotClimate])
    }
}

const ashes = {
    "type": "leaves",
    "options": {
        "scale": 0.4,
        "speed": 1,
        "lifetime": 1,
        "density": 0.4,
        "tint": {
            "apply": true,
            "value": "#000000"
        }
    }
}
const grayFog = {
    "type": "fog",
    "options": {
        "scale": 1,
        "speed": 1,
        "lifetime": 1,
        "density": 0.05,
        "tint": {
            "apply": true,
            "value": "#8f8f8f"
        }
    }
}
const blizzard = {
    "type": "snowstorm",
    "options": {
        "scale": 0.7,
        "direction": 180,
        "speed": 3,
        "lifetime": 0.7,
        "density": 0.5,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const snowClouds = {
    "type": "clouds",
    "options": {
        "scale": 3,
        "direction": 180,
        "speed": 2,
        "lifetime": 1,
        "density": 0.02,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const snowFog = {
    "type": "fog",
    "options": {
        "scale": 0.7,
        "speed": 2,
        "lifetime": 0.7,
        "density": 0.08,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const hotClimate = {
    "type": "color",
    "options": {
        "color": {
            "apply": true,
            "value": "#fef486"
        },
        "saturation": 1,
        "contrast": 1,
        "brightness": 1.2,
        "gamma": 1,
        "red": 0.996078431372549, "green": 0.9568627450980393, "blue": 0.5254901960784314
    }
}
const coldClimate = {
    "type": "color",
    "options": {
        "color": {
            "apply": true,
            "value": "#95dcea"
        },
        "saturation": 1,
        "contrast": 1,
        "brightness": 1,
        "gamma": 1
    }
}
const heavyRain = {
    "type": "raintop",
    "options": {
        "scale": 1.3,
        "speed": 1.8,
        "lifetime": 1.2,
        "density": 2,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const heavyClouds = {
    "type": "clouds",
    "options": {
        "scale": 3,
        "direction": 180,
        "speed": 1.5,
        "lifetime": 2,
        "density": 0.05,
        "tint": {
            "apply": true,
            "value": "#787878"
        }
    }
}
const moderateFog = {
    "type": "fog",
    "options": {
        "scale": 1,
        "speed": 1,
        "lifetime": 1,
        "density": 0.01,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const darkClimate = {
    "type": "color",
    "options": {
        "color": {
            "apply": true,
            "value": "#d1d1d1"
        },
        "saturation": 0.8,
        "contrast": 1,
        "brightness": 1,
        "gamma": 1,
        "red": 0.8196078431372549, "green": 0.8196078431372549, "blue": 0.8196078431372549
    }
}
const moderateRain = {
    "type": "raintop",
    "options": {
        "scale": 1.3,
        "speed": 1.8,
        "lifetime": 1.2,
        "density": 0.5,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const grayClouds = {
    "type": "clouds",
    "options": {
        "scale": 3,
        "direction": 180,
        "speed": 1,
        "lifetime": 2,
        "density": 0.03,
        "tint": {
            "apply": true,
            "value": "#5e5e5e"
        }
    }
}
const lightFog = {
    "type": "fog",
    "options": {
        "scale": 1,
        "speed": 1,
        "lifetime": 1,
        "density": 0.01,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const snowFall = {
    "type": "snow",
    "options": {
        "scale": 1,
        "direction": 65,
        "speed": 0.1,
        "lifetime": 0.5,
        "density": 0.5,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const lightSnow = {
    "type": "snow",
    "options": {
        "scale": 1,
        "direction": 65,
        "speed": 0.1,
        "lifetime": 0.5,
        "density": 0.025,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const lightRain = {
    "type": "raintop",
    "options": {
        "scale": 1.3,
        "speed": 1.8,
        "lifetime": 1.2,
        "density": 0.025,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const moderateClouds = {
    "type": "clouds",
    "options": {
        "scale": 1,
        "direction": 180,
        "speed": 1,
        "lifetime": 1,
        "density": 0.03,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const lightning = {
    "type": "lightning",
    "options": {
        "frequency": 1000,
        "spark_duration": 500,
        "brightness": 1.3
    }
}