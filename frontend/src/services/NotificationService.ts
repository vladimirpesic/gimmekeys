import axios from 'axios'
import * as gimmekeysTypes from 'gimmekeys-types'
import Env from '../config/env.config'

/**
 * Get NotificationCounter by UserID.
 *
 * @param {string} userId
 * @returns {Promise<gimmekeysTypes.NotificationCounter>}
 */
export const getNotificationCounter = (userId: string): Promise<gimmekeysTypes.NotificationCounter> => (
  axios
    .get(
      `${Env.API_HOST}/api/notification-counter/${encodeURIComponent(userId)}`,
      { withCredentials: true }
    )
    .then((res) => res.data)
)

/**
 * Mark Notifications as read.
 *
 * @param {string} userId
 * @param {string[]} ids
 * @returns {Promise<number>}
 */
export const markAsRead = (userId: string, ids: string[]): Promise<number> => (
  axios
    .post(
      `${Env.API_HOST}/api/mark-Notifications-as-read/${encodeURIComponent(userId)}`,
      { ids },
      { withCredentials: true }
    )
    .then((res) => res.status)
)

/**
 * Mark Notifications as unread.
 *
 * @param {string} userId
 * @param {string[]} ids
 * @returns {Promise<number>}
 */
export const markAsUnread = (userId: string, ids: string[]): Promise<number> => (
  axios
    .post(
`${Env.API_HOST}/api/mark-Notifications-as-unread/${encodeURIComponent(userId)}`,
      { ids },
      { withCredentials: true }
    )
    .then((res) => res.status)
)

/**
 * Delete Notifications.
 *
 * @param {string} userId
 * @param {string[]} ids
 * @returns {Promise<number>}
 */
export const deleteNotifications = (userId: string, ids: string[]): Promise<number> => (
  axios
    .post(
      `${Env.API_HOST}/api/delete-Notifications/${encodeURIComponent(userId)}`,
      { ids },
      { withCredentials: true }
)
    .then((res) => res.status)
)

/**
 * Get Notifications.
 *
 * @param {string} userId
 * @param {number} page
 * @returns {Promise<gimmekeysTypes.Result<gimmekeysTypes.Notification>>}
 */
export const getNotifications = (userId: string, page: number): Promise<gimmekeysTypes.Result<gimmekeysTypes.Notification>> => (
  axios
    .get(
      `${Env.API_HOST}/api/Notifications/${encodeURIComponent(userId)}/${page}/${Env.PAGE_SIZE}`,
      { withCredentials: true }
    )
    .then((res) => res.data)
)
