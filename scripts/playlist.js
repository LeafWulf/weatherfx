import { MODULE } from "./const.js"

let DEBUG = true
let playlistName = 'Weather FX Playlist'
let playlist = game.playlists?.contents.find((p) => p.name === playlistName);

export function generatePlaylist(playlistName) {
    return new Promise(async (resolve, reject) => {
        let playlist = game.playlists?.contents.find((p) => p.name === playlistName);
        let playlistExists = playlist ? true : false;
        if (playlistExists) {
            // const shouldOverridePlaylist = game.settings?.get(CONSTANTS.MODULE_NAME, 'shouldOverridePlaylist');
            // if (shouldOverridePlaylist) {
            //     await playlist.delete();
            // }
            // playlistExists = false;
            if (DEBUG) console.log(`Weather FX: playlist ${playlistName} already exist.`);
        }
        if (!playlistExists) {
            try {
                playlist = await Playlist.create({
                    name: playlistName,
                    permission: {
                        default: 0,
                    },
                    flags: {},
                    sounds: [],
                    mode: 0,
                    playing: false,
                });
                await playlist?.setFlag(MODULE, 'playlist', true);
                if (DEBUG) console.log(`Weather FX: Successfully created playlist: ${playlistName}`);
                resolve(true);
            } catch (error) {
                reject(false);
            }
        }
        resolve(false);
    });
}

export async function addSound(trackName, fileName) {
    await playlist.createEmbeddedDocuments(
        'PlaylistSound',
        [{ name: trackName, path: fileName, repeat: true }],
        {},
    );
}