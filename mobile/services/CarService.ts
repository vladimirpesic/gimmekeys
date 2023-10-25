import axios from 'axios'
import * as Env from '../config/env.config'
import * as UserService from './UserService'
import * as AxiosHelper from '../common/AxiosHelper'
import * as gimmekeysTypes from '../miscellaneous/gimmekeysTypes'

AxiosHelper.init(axios)

/**
 * Get cars.
 *
 * @async
 * @param {gimmekeysTypes.GetCarsPayload} data
 * @param {number} page
 * @param {number} size
 * @returns {Promise<gimmekeysTypes.Result<gimmekeysTypes.Car>>}
 */
export const getCars = async (data: gimmekeysTypes.GetCarsPayload, page: number, size: number): Promise<gimmekeysTypes.Result<gimmekeysTypes.Car>> =>
  axios
    .post(
      `${Env.API_HOST}/api/frontend-cars/${page}/${size}}`,
      data
    )
    .then((res) => res.data)

/**
 * Get a Car by ID.
 *
 * @async
 * @param {string} id
 * @returns {Promise<gimmekeysTypes.Car>}
 */
export const getCar = async (id: string): Promise<gimmekeysTypes.Car> => {
  const language = await UserService.getLanguage()
  return axios
    .get(
      `${Env.API_HOST}/api/car/${encodeURIComponent(id)}/${language}`
    )
    .then((res) => res.data)
}
