import axios from 'axios'
import * as gimmekeysTypes from 'gimmekeys-types'
import Env from '../config/env.config'
import * as UserService from './UserService'

/**
 * Complete the checkout process and create the Booking.
 *
 * @param {gimmekeysTypes.BookPayload} data
 * @returns {Promise<number>}
 */
export const book = (data: gimmekeysTypes.BookPayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/book`,
      data
    )
    .then((res) => res.status)

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
 * Get bookings.
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
 * Cancel a Booking.
 *
 * @param {string} id
 * @returns {Promise<number>}
 */
export const cancel = (id: string): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/cancel-booking/${encodeURIComponent(id)}`,
      null,
      { withCredentials: true }
    ).then((res) => res.status)
