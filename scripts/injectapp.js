import { weatherApp } from "./app.js"

export async function injectApp(app, html, data){

    weatherApp.toggleAppVis('initial')
}