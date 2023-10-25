import axios from 'axios'
import * as gimmekeysTypes from 'gimmekeys-types'
import Env from '../config/env.config'
import * as UserService from './UserService'

/**
 * Create a Booking.
 *
 * @param {gimmekeysTypes.UpsertBookingPayload} data
 * @returns {Promise<gimmekeysTypes.Booking>}
 */
export const create = (data: gimmekeysTypes.UpsertBookingPayload): Promise<gimmekeysTypes.Booking> =>
  axios
    .post(
      `${Env.API_HOST}/api/create-booking`,
      data,
      { withCredentials: true }
    )
    .then((res) => res.data)

/**
 * Update a Booking.
 *
 * @param {gimmekeysTypes.UpsertBookingPayload} data
 * @returns {Promise<number>}
 */
export const update = (data: gimmekeysTypes.UpsertBookingPayload): Promise<number> =>
  axios
    .put(
      `${Env.API_HOST}/api/update-booking`,
      data,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Update a Booking status.
 *
 * @param {gimmekeysTypes.UpdateStatusPayload} data
 * @returns {Promise<number>}
 */
export const updateStatus = (data: gimmekeysTypes.UpdateStatusPayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/update-booking-status`,
      data,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Delete Bookings.
 *
 * @param {string[]} ids
 * @returns {Promise<number>}
 */
export const deleteBookings = (ids: string[]): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/delete-bookings`,
      ids,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Get a Booking by ID.
 *
 * @param {string} id
 * @returns {Promise<gimmekeysTypes.Booking>}
 */
export const getBooking = (id: string): Promise<gimmekeysTypes.Booking> =>
  axios
    .get(
      `${Env.API_HOST}/api/booking/${encodeURIComponent(id)}/${UserService.getLanguage()}`,
      { withCredentials: true }
    )
    .then((res) => res.data)

/**
 * Get Bookings.
 *
 * @param {gimmekeysTypes.GetBookingsPayload} payload
 * @param {number} page
 * @param {number} size
 * @returns {Promise<gimmekeysTypes.Result<gimmekeysTypes.Booking>>}
 */
export const getBookings = (payload: gimmekeysTypes.GetBookingsPayload, page: number, size: number): Promise<gimmekeysTypes.Result<gimmekeysTypes.Booking>> =>
  axios
    .post(
      `${Env.API_HOST}/api/bookings/${page}/${size}/${UserService.getLanguage()}`,
      payload,
      { withCredentials: true }
    )
    .then((res) => res.data)
