import axios from 'axios'
import * as gimmekeysTypes from 'gimmekeys-types'
import Env from '../config/env.config'

/**
 * Get all suppliers.
 *
 * @returns {Promise<gimmekeysTypes.User[]>}
 */
export const getAllSuppliers = (): Promise<gimmekeysTypes.User[]> =>
  axios
    .get(
      `${Env.API_HOST}/api/all-suppliers`,
      { withCredentials: true }
)
    .then((res) => res.data)

/**
 * Get suppliers.
 *
 * @param {string} keyword
 * @param {number} page
 * @param {number} size
 * @returns {Promise<gimmekeysTypes.Result<gimmekeysTypes.User>>}
 */
export const getSuppliers = (keyword: string, page: number, size: number): Promise<gimmekeysTypes.Result<gimmekeysTypes.User>> =>
  axios
    .get(
      `${Env.API_HOST}/api/suppliers/${page}/${size}/?s=${encodeURIComponent(keyword)}`,
      { withCredentials: true }
    )
    .then((res) => res.data)
