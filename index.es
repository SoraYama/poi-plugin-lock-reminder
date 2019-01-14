import reminder from './reminder'

export const pluginDidLoad = () => {
  window.reminder = reminder
  window.addEventListener('game.response', reminder.handler)
}

export const pluginWillUnload = () => {
  window.removeEventListener('game.response', reminder.handler)
}

export settingsClass from './settings-class'

export reactClass from './views/index'

export { reducer } from './redux'
