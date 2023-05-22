import { userStore } from './stores'

let _apiUrl =
  localStorage.getItem('apiUrl') ??
  `${window.location.protocol}//${window.location.host}/api`

let _jwt = localStorage.getItem('jwt')

export const setApiUrl = (url: string) => {
  _apiUrl = url
  localStorage.setItem('apiUrl', url)
  return localStorage.getItem('apiUrl')
}

export const setJWT = (key: string) => {
  _jwt = key
  localStorage.setItem('jwt', key)
  return localStorage.getItem('jwt')
}

export const checkApiUrl = async (count: number = 0) => {
  if (count > 3) {
    return false
  }
  try {
    const res = await fetch(`${_apiUrl}/status`).then((res) => res.json())
    if (res.status === 'OK') {
      if (count > 0) {
        location.reload()
      }
      return true
    }
  } catch (e) {
    console.error(e)
  }
  setApiUrl(prompt('API URL', _apiUrl))
  return checkApiUrl(count + 1)
}

export const me = async () => {
  try {
    const res = await fetch(`${_apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${_jwt}`,
      },
    })

    if (res.status === 200) {
      const user = await res.json()
      userStore.set(user)
      return user
    }
  } catch (e) {
    console.error(e)
  }
  throw new Error('Unauthorized')
}

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${_apiUrl}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  })
  if (res.ok) {
    const { access_token } = await res.json()
    setJWT(access_token)
    await me()
    return true
  }
  throw new Error('Failed to signup')
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${_apiUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  if (res.ok) {
    const { access_token } = await res.json()
    setJWT(access_token)
    await me()
    return true
  }
  throw new Error('Failed to login')
}

export const logout = async () => {
  setJWT(null)
  location.reload()
  return true
}

export const getLights = async () => {
  const res = await fetch(`${_apiUrl}/lights`, {
    headers: {
      Authorization: `Bearer ${_jwt}`,
    },
  })
  if (res.ok) {
    return res.json()
  }
  throw new Error('Failed to fetch lights')
}

export const getPlugs = async () => {
  const res = await fetch(`${_apiUrl}/plugs`, {
    headers: {
      Authorization: `Bearer ${_jwt}`,
    },
  })
  if (res.ok) {
    return res.json()
  }
  throw new Error('Failed to fetch plugs')
}

export const getLight = async (id: string) => {
  const res = await fetch(`${_apiUrl}/lights/${id}`, {
    headers: {
      Authorization: `Bearer ${_jwt}`,
    },
  })
  if (res.ok) {
    return res.json()
  }
  throw new Error('Failed to fetch light')
}

export const getPlug = async (id: string) => {
  const res = await fetch(`${_apiUrl}/plugs/${id}`, {
    headers: {
      Authorization: `Bearer ${_jwt}`,
    },
  })
  if (res.ok) {
    return res.json()
  }
  throw new Error('Failed to fetch plug')
}

export const setLight = async (id: string, state: LightInput) => {
  const res = await fetch(`${_apiUrl}/lights/${id}/state`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${_jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state),
  })
  if (res.ok) {
    return res.json()
  }
  throw new Error('Failed to set light')
}

export const setPlug = async (id: string, state: PlugInput) => {
  const res = await fetch(`${_apiUrl}/plugs/${id}/state`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${_jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state),
  })
  if (res.ok) {
    return res.json()
  }
  throw new Error('Failed to set plug')
}

export const hueConfig = async (ip: string) => {
  const res = await fetch(`${_apiUrl}/hue/config/add`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${_jwt}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ host: ip }),
  })
  if (res.ok) {
    return await res.json()
  }
  throw new Error('Failed to set config')
}

export const hueDelete = async (bridgeId: string) => {
  const res = await fetch(`${_apiUrl}/hue/config/${bridgeId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${_jwt}`,
      'Content-Type': 'application/json',
    },
  })
  if (res.ok) {
    return true
  }
  throw new Error('Failed to delete config')
}

export const hueInit = async (bridgeId: string) => {
  const res = await fetch(`${_apiUrl}/hue/init/${bridgeId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${_jwt}`,
      'Content-Type': 'application/json',
    },
  })
  if (res.ok) {
    return res.json()
  }
  throw new Error('Failed to init hue')
}

export const setProfilePicture = async (file: File) => {
  const res = await fetch(`${_apiUrl}/user/profile_pic`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${_jwt}`,
    },
    body: file,
  })
  if (res.ok) {
    return true
  }
  throw new Error('Failed to set profile picture')
}

export const getProfilePicture = async () => {
  const res = await fetch(`${_apiUrl}/user/profile_pic`, {
    headers: {
      Authorization: `Bearer ${_jwt}`,
    },
  })
  if (res.ok) {
    return res.blob()
  }
  throw new Error('Failed to get profile picture')
}

export const connectWebSocket = () => {
  const ws = new WebSocket(
    _apiUrl.replace('http://', 'ws://').replace('/api', '/ws') +
      `?token=${_jwt}`
  )
  ws.addEventListener('open', () => {
    console.log('WebSocket connected')
  })
  ws.addEventListener('close', () => {
    console.log('WebSocket disconnected')
  })
  return ws
}
