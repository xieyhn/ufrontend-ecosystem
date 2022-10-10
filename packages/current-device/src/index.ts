/**
 * Fork from https://github.com/matthewhudson/current-device
 */

const { documentElement } = window.document
const userAgent = window.navigator.userAgent.toLowerCase()

const includes = (haystack: string, needle: string) => haystack.indexOf(needle) !== -1

const find = (needle: string) => includes(userAgent, needle)

const hasClass = (className: string) => documentElement.className.match(new RegExp(className, 'i'))

const addClass = (className: string) => {
  if (!hasClass(className)) {
    const currentClassNames = documentElement.className.replace(/^\s+|\s+$/g, '')
    documentElement.className = `${currentClassNames} ${className}`
  }
}

const removeClass = (className: string) => {
  if (hasClass(className)) {
    documentElement.className = documentElement.className.replace(
      ` ${className}`,
      '',
    )
  }
}

export const macos = () => find('mac')

export const ios = () => iphone() || ipod() || ipad()

export const iphone = () => !windows() && find('iphone')

export const ipod = () => find('ipod')

export const ipad = () => {
  const iPadOS13Up = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return find('ipad') || iPadOS13Up
}

export const android = () => !windows() && find('android')

export const androidPhone = () => android() && find('mobile')

export const androidTablet = () => android() && !find('mobile')

export const blackberry = () => find('blackberry') || find('bb10')

export const blackberryPhone = () => blackberry() && !find('tablet')

export const blackberryTablet = () => blackberry() && find('tablet')

export const windows = () => find('windows')

export const windowsPhone = () => windows() && find('phone')

export const windowsTablet = () => windows() && (find('touch') && !windowsPhone())

export const fxos = () => (find('(mobile') || find('(tablet')) && find(' rv:')

export const fxosPhone = () => fxos() && find('mobile')

export const fxosTablet = () => fxos() && find('tablet')

export const meego = () => find('meego')

export const mobile = () => (
  androidPhone()
  || iphone()
  || ipod()
  || windowsPhone()
  || blackberryPhone()
  || fxosPhone()
  || meego()
)

export const tablet = () => (
  ipad()
  || androidTablet()
  || blackberryTablet()
  || windowsTablet()
  || fxosTablet()
)

export const desktop = () => !tablet() && !mobile()

export const portrait = () => window.innerWidth <= 900

export const web = () => !portrait()

if (ios()) {
  if (ipad()) {
    addClass('ios ipad tablet')
  } else if (iphone()) {
    addClass('ios iphone mobile')
  } else if (ipod()) {
    addClass('ios ipod mobile')
  }
} else if (macos()) {
  addClass('macos desktop')
} else if (android()) {
  if (androidTablet()) {
    addClass('android tablet')
  } else {
    addClass('android mobile')
  }
} else if (blackberry()) {
  if (blackberryTablet()) {
    addClass('blackberry tablet')
  } else {
    addClass('blackberry mobile')
  }
} else if (windows()) {
  if (windowsTablet()) {
    addClass('windows tablet')
  } else if (windowsPhone()) {
    addClass('windows mobile')
  } else {
    addClass('windows desktop')
  }
} else if (fxos()) {
  if (fxosTablet()) {
    addClass('fxos tablet')
  } else {
    addClass('fxos mobile')
  }
} else if (meego()) {
  addClass('meego mobile')
} else if (desktop()) {
  addClass('desktop')
}

function handleResize() {
  if (web()) {
    removeClass('portrait')
    addClass('web')
  } else {
    removeClass('web')
    addClass('portrait')
  }
}

window.addEventListener('resize', handleResize)
handleResize()
