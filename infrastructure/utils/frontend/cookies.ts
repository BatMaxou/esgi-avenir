export const getCookie = (name: string): string|null => {
  const cookies = document.cookie.split('; ')
  const value = cookies.find(cookie => cookie.startsWith(`${name}=`))?.split('=')[1]

  if (value === undefined) {
    return null
  }

  return decodeURIComponent(value)
}

export const setCookie = (name: string, value: string, expire: Date|null = null) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; ${expire ? `expires=${expire.toUTCString()};` : ''}`
}

export const eraseCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

