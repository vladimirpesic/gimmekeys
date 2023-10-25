import axios from 'axios'
import * as gimmekeysTypes from 'gimmekeys-types'
import Env from '../config/env.config'

/**
 * Create a User.
 *
 * @param {gimmekeysTypes.CreateUserPayload} data
 * @returns {Promise<number>}
 */
export const create = (data: gimmekeysTypes.CreateUserPayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/create-user`,
      data,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Sign up.
 *
 * @param {gimmekeysTypes.SignUpPayload} data
 * @returns {Promise<number>}
 */
export const signup = (data: gimmekeysTypes.SignUpPayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/admin-sign-up/ `,
      data
    )
    .then((res) => res.status)

/**
 * Check a validation token.
 *
 * @param {string} userId
 * @param {string} email
 * @param {string} token
 * @returns {Promise<number>}
 */
export const checkToken = (userId: string, email: string, token: string): Promise<number> =>
  axios
    .get(
      `${Env.API_HOST}/api/check-token/${Env.APP_TYPE}/${encodeURIComponent(userId)}/${encodeURIComponent(email)}/${encodeURIComponent(token)}`
    )
    .then((res) => res.status)

/**
 * Delete validation tokens.
 *
 * @param {string} userId
 * @returns {Promise<number>}
 */
export const deleteTokens = (userId: string): Promise<number> =>
  axios
    .delete(
      `${Env.API_HOST}/api/delete-tokens/${encodeURIComponent(userId)}`
    )
    .then((res) => res.status)

/**
 * Resend a forgotten password or activation email.
 *
 * @param {?string} [email]
 * @param {boolean} [reset=false]
 * @param {string} [appType=gimmekeysTypes.AppType.Backend]
 * @returns {Promise<number>}
 */
export const resend = (email?: string, reset = false, appType: string = gimmekeysTypes.AppType.Backend): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/resend/${appType}/${encodeURIComponent(email || '')}/${reset}`
    )
    .then((res) => res.status)

/**
 * Activate an account.
 *
 * @param {gimmekeysTypes.ActivatePayload} data
 * @returns {Promise<number>}
 */
export const activate = (data: gimmekeysTypes.ActivatePayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/activate/ `,
      data,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Validate an email.
 *
 * @param {gimmekeysTypes.ValidateEmailPayload} data
 * @returns {Promise<number>}
 */
export const validateEmail = (data: gimmekeysTypes.ValidateEmailPayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/validate-email`,
      data
    )
    .then((exist) => exist.status)

/**
 * Sign in.
 *
 * @param {gimmekeysTypes.SignInPayload} data
 * @returns {Promise<{ status: number, data: gimmekeysTypes.User }>}
 */
export const signin = (data: gimmekeysTypes.SignInPayload): Promise<{ status: number, data: gimmekeysTypes.User }> =>
  axios
    .post(
      `${Env.API_HOST}/api/sign-in/${Env.APP_TYPE}`,
      data,
      { withCredentials: true }
    )
    .then((res) => {
      localStorage.setItem('gk-user', JSON.stringify(res.data))
      return { status: res.status, data: res.data }
    })

/**
 * Sign out.
 *
 * @param {boolean} [redirect=true]
 */
export const signout = async (redirect = true) => {
  const deleteAllCookies = () => {
    const cookies = document.cookie.split('')

    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie
      document.cookie = `${name}=expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
  }

  sessionStorage.clear()
  localStorage.removeItem('gk-user')
  deleteAllCookies()

  await axios.post(
    `${Env.API_HOST}/api/sign-out`,
    null,
    { withCredentials: true }
  )

  if (redirect) {
    window.location.href = '/sign-in'
  }
}

/**
 * Validate autentication access token.
 *
 * @returns {Promise<number>}
 */
export const validateAccessToken = (): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/validate-access-token`,
      { backend: true },
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Confirm an email.
 *
 * @param {string} email
 * @param {string} token
 * @returns {Promise<number>}
 */
export const confirmEmail = (email: string, token: string): Promise<number> => (
  axios
    .post(
      `${Env.API_HOST}/api/confirm-email/${encodeURIComponent(email)}/${encodeURIComponent(token)}`
    )
    .then((res) => res.status)
)

/**
 * Resend validation email.
 *
 * @param {gimmekeysTypes.ResendLinkPayload} data
 * @returns {Promise<number>}
 */
export const resendLink = (data: gimmekeysTypes.ResendLinkPayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/resend-link`,
      data,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Get current language.
 *
 * @returns {string}
 */
export const getLanguage = (): string => {
  const user = JSON.parse(localStorage.getItem('gk-user') ?? 'null')

  if (user && user.language) {
    return user.language as string
  }
  const lang = localStorage.getItem('gk-language')
  if (lang && lang.length === 2) {
    return lang
  }
  return Env.DEFAULT_LANGUAGE
}

/**
 * Get language from query strings.
 *
 * @returns {(string | null)}
 */
export const getQueryLanguage = (): string | null => {
  const params = new URLSearchParams(window.location.search)
  if (params.has('l')) {
    return params.get('l') ?? ''
  }
  return ''
}

/**
 * Update language.
 *
 * @param {gimmekeysTypes.UpdateLanguagePayload} data
 * @returns {Promise<number>}
 */
export const updateLanguage = (data: gimmekeysTypes.UpdateLanguagePayload) =>
  axios
    .post(
      `${Env.API_HOST}/api/update-language`,
      data,
      { withCredentials: true }
    )
    .then((res) => {
      if (res.status === 200) {
        const user = JSON.parse(localStorage.getItem('gk-user') ?? 'null')
        user.language = data.language
        localStorage.setItem('gk-user', JSON.stringify(user))
      }
      return res.status
    })

/**
 * Set language.
 *
 * @param {string} lang
 */
export const setLanguage = (lang: string) => {
  localStorage.setItem('gk-language', lang)
}

/**
 * Get current User.
 *
 * @returns {gimmekeysTypes.User|null}
 */
export const getCurrentUser = (): gimmekeysTypes.User | null => {
  const user = JSON.parse(localStorage.getItem('gk-user') ?? 'null')
  return user
}

/**
 * Get User by ID.
 *
 * @param {string} id
 * @returns {Promise<gimmekeysTypes.User|null>}
 */
export const getUser = (id?: string): Promise<gimmekeysTypes.User | null> => {
  if (id) {
    return axios
      .get(
        `${Env.API_HOST}/api/user/${encodeURIComponent(id)}`,
        { withCredentials: true }
      )
      .then((res) => res.data)
  }
  return new Promise((resolve) => {
    resolve(null)
  })
}

/**
 * Get customers.
 *
 * @param {string} keyword
 * @param {number} page
 * @param {number} size
 * @returns {Promise<gimmekeysTypes.Result<gimmekeysTypes.User>>}
 */
export const getDrivers = (keyword: string, page: number, size: number): Promise<gimmekeysTypes.Result<gimmekeysTypes.User>> =>
  axios
    .post(
      `${Env.API_HOST}/api/users/${page}/${size}/?s=${encodeURIComponent(keyword)}`,
      { types: [gimmekeysTypes.RecordType.User] },
      { withCredentials: true }
    )
    .then((res) => res.data)

/**
 * Get Users.
 *
 * @param {gimmekeysTypes.GetUsersBody} payload
 * @param {string} keyword
 * @param {number} page
 * @param {number} size
 * @returns {Promise<gimmekeysTypes.Result<gimmekeysTypes.User>>}
 */
export const getUsers = (
  payload: gimmekeysTypes.GetUsersBody,
  keyword: string,
  page: number,
  size: number
): Promise<gimmekeysTypes.Result<gimmekeysTypes.User>> =>
  axios
    .post(
      `${Env.API_HOST}/api/users/${page}/${size}/?s=${encodeURIComponent(keyword)}`,
      payload,
      { withCredentials: true }
    )
    .then((res) => res.data)

/**
 * Update a User.
 *
 * @param {gimmekeysTypes.UpdateUserPayload} data
 * @returns {Promise<number>}
 */
export const updateUser = (data: gimmekeysTypes.UpdateUserPayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/update-user`,
      data,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Update email notifications flag.
 *
 * @param {gimmekeysTypes.UpdateEmailNotificationsPayload} data
 * @returns {Promise<number>}
 */
export const updateEmailNotifications = (data: gimmekeysTypes.UpdateEmailNotificationsPayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/update-email-notifications`,
      data,
      { withCredentials: true }
    )
    .then((res) => {
      if (res.status === 200) {
        const user = getCurrentUser()
        if (user) {
          user.enableEmailNotifications = data.enableEmailNotifications
          localStorage.setItem('gk-user', JSON.stringify(user))
        }
      }
      return res.status
    })

/**
 * Create a temporary avatar.
 *
 * @param {Blob} file
 * @returns {Promise<string>}
 */
export const createAvatar = (file: Blob): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)

  return axios
    .post(
      `${Env.API_HOST}/api/create-avatar`,
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      },
    )
    .then((res) => res.data)
}

/**
 * Update Avatar.
 *
 * @param {string} userId
 * @param {Blob} file
 * @returns {Promise<number>}
 */
export const updateAvatar = (userId: string, file: Blob): Promise<number> => {
  const formData = new FormData()
  formData.append('image', file)

  return axios
    .post(
      `${Env.API_HOST}/api/update-avatar/${encodeURIComponent(userId)}`,
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      },
    )
    .then((res) => res.status)
}

/**
 * Delete Avatar.
 *
 * @param {string} userId
 * @returns {Promise<number>}
 */
export const deleteAvatar = (userId: string): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/delete-avatar/${encodeURIComponent(userId)}`,
      null,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Delete temporary Avatar.
 *
 * @param {string} avatar
 * @returns {Promise<number>}
 */
export const deleteTempAvatar = (avatar: string): Promise<number> => (
  axios
    .post(
      `${Env.API_HOST}/api/delete-temp-avatar/${encodeURIComponent(avatar)}`,
      null,
      { withCredentials: true }
    )
    .then((res) => res.status)
)

/**
 * Check Password.
 *
 * @param {string} id
 * @param {string} pass
 * @returns {Promise<number>}
 */
export const checkPassword = (id: string, pass: string): Promise<number> =>
  axios
    .get(
      `${Env.API_HOST}/api/check-password/${encodeURIComponent(id)}/${encodeURIComponent(pass)}`,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Change Password.
 *
 * @param {gimmekeysTypes.ChangePasswordPayload} data
 * @returns {Promise<number>}
 */
export const changePassword = (data: gimmekeysTypes.ChangePasswordPayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/change-password/ `,
      data,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Delete Users.
 *
 * @param {string[]} ids
 * @returns {Promise<number>}
 */
export const deleteUsers = (ids: string[]): Promise<number> => (
  axios
    .post(
      `${Env.API_HOST}/api/delete-users`,
      ids,
      { withCredentials: true }
    )
    .then((res) => res.status)
)
