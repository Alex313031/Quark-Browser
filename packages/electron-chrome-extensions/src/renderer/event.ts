import { ipcRenderer } from 'electron'

const formatIpcName = (name: string) => `crx-${name}`

const listenerMap = new Map<string, Function[]>()

export const addExtensionListener = (extensionId: string, name: string, callback: Function) => {
  let listeners = listenerMap.get(name)

  if (listeners == undefined) {
    // TODO: should these IPCs be batched in a microtask?
    ipcRenderer.send('crx-add-listener', extensionId, name)
    listeners = []
    listenerMap.set(name, listeners)
  }

  listeners.push(callback)

  ipcRenderer.addListener(formatIpcName(name), function (event, ...args) {
    if (process.env.NODE_ENV === 'development') {
      console.log(name, '(result)', ...args)
    }
    callback(...args)
  })
}

export const removeExtensionListener = (extensionId: string, name: string, callback: any) => {
  const listeners = listenerMap.get(name);

  if (listeners !== undefined) {
    const callbackIndex = listeners.findIndex((element) => element == callback);
    if (callbackIndex !== undefined && callbackIndex > -1) {
      listeners.splice(callbackIndex, 1);
    }

    if (listeners.length == 0) {
      ipcRenderer.send('crx-remove-listener', extensionId, name)
    }
  }

  ipcRenderer.removeListener(formatIpcName(name), callback)
}

export const hasExtensionListener = (extensionId: string, name: string, callback: Function): boolean => {
  const listeners = listenerMap.get(name);
  let foundListener = false;
  if (listeners !== undefined) {
    const callbackIndex = listeners.findIndex((element) => element == callback);
    if (callbackIndex !== undefined && callbackIndex > -1) {
      foundListener = true;
    }
  }

  return foundListener;
}
