import axios from 'axios'
import * as gimmekeysTypes from 'gimmekeys-types'
import Env from '../config/env.config'
import * as UserService from './UserService'

/**
 * Get locations.
 *
 * @param {string} keyword
 * @param {number} page
 * @param {number} size
 * @returns {Promise<gimmekeysTypes.Result<gimmekeysTypes.Location>>}
 */
export const getLocations = (keyword: string, page: number, size: number): Promise<gimmekeysTypes.Result<gimmekeysTypes.Location>> =>
  axios
    .get(
      `${Env.API_HOST}/api/locations/${page}/${size}/${UserService.getLanguage()}/?s=${encodeURIComponent(keyword)}`
    )
    .then((res) => res.data)

/**
 * Get a Location by ID.
 *
 * @param {string} id
 * @returns {Promise<gimmekeysTypes.Location>}
 */
export const getLocation = (id: string): Promise<gimmekeysTypes.Location> =>
  axios
    .get(
      `${Env.API_HOST}/api/location/${encodeURIComponent(id)}/${UserService.getLanguage()}`
    )
    .then((res) => res.data)
