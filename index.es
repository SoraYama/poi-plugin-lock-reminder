import reminder from './reminder'

export const pluginDidLoad = () => {
  window.reminder = reminder
  window.addEventListener('game.response', reminder.handler)
}

export const pluginWillUnload = () => {
  window.addEventListener('game.response', reminder.handler)
}
