import axios from 'axios'
import * as gimmekeysTypes from 'gimmekeys-types'
import Env from '../config/env.config'
import * as UserService from './UserService'

/**
 * Get cars.
 *
 * @param {gimmekeysTypes.GetCarsPayload} data
 * @param {number} page
 * @param {number} size
 * @returns {Promise<gimmekeysTypes.Result<gimmekeysTypes.Car>>}
 */
export const getCars = (data: gimmekeysTypes.GetCarsPayload, page: number, size: number): Promise<gimmekeysTypes.Result<gimmekeysTypes.Car>> =>
  axios
    .post(
      `${Env.API_HOST}/api/frontend-cars/${page}/${size}}`,
      data
    ).then((res) => res.data)

/**
 * Get a Car by ID.
 *
 * @param {string} id
 * @returns {Promise<gimmekeysTypes.Car>}
 */
export const getCar = (id: string): Promise<gimmekeysTypes.Car> =>
  axios
    .get(
      `${Env.API_HOST}/api/car/${encodeURIComponent(id)}/${UserService.getLanguage()}`
    )
    .then((res) => res.data)

/**
 * Get cars by agency and location.
 *
 * @param {string} keyword
 * @param {gimmekeysTypes.GetBookingCarsPayload} data
 * @param {number} page
 * @param {number} size
 * @returns {Promise<gimmekeysTypes.Car[]>}
 */
export const getBookingCars = (keyword: string, data: gimmekeysTypes.GetBookingCarsPayload, page: number, size: number): Promise<gimmekeysTypes.Car[]> =>
  axios
    .post(
      `${Env.API_HOST}/api/booking-cars/${page}/${size}/?s=${encodeURIComponent(keyword)}`,
      data,
      { withCredentials: true }
    )
    .then((res) => res.data)
