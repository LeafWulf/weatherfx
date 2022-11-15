import { MODULE, playlistName } from "./const.js"

let DEBUG = true

export function generatePlaylist(playlistName) {
    return new Promise(async (resolve, reject) => {
        let playlist = game.playlists?.contents.find((p) => p.name === playlistName);
        let playlistExists = playlist ? true : false;
        if (playlistExists) {
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

export async function addSound(trackName, fileName = '') {
    let playlist = game.playlists?.contents.find((p) => p.name === playlistName);
    await playlist.createEmbeddedDocuments(
        'PlaylistSound',
        [{ name: trackName, path: fileName, repeat: true, volume: 0.8 }],
        {},
    );
}