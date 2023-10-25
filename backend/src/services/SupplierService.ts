import axios from 'axios'
import * as gimmekeysTypes from 'gimmekeys-types'
import Env from '../config/env.config'

/**
 * Validate Supplier name.
 *
 * @param {gimmekeysTypes.ValidateSupplierPayload} data
 * @returns {Promise<number>}
 */
export const validate = (data: gimmekeysTypes.ValidateSupplierPayload): Promise<number> =>
  axios
    .post(
      `${Env.API_HOST}/api/validate-supplier`,
      data,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Update a Supplier.
 *
 * @param {gimmekeysTypes.UpdateSupplierPayload} data
 * @returns {Promise<number>}
 */
export const update = (data: gimmekeysTypes.UpdateSupplierPayload): Promise<number> =>
  axios
    .put(
      `${Env.API_HOST}/api/update-supplier`,
      data,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Delete a Supplier.
 *
 * @param {string} id
 * @returns {Promise<number>}
 */
export const deleteSupplier = (id: string): Promise<number> =>
  axios
    .delete(
      `${Env.API_HOST}/api/delete-supplier/${encodeURIComponent(id)}`,
      { withCredentials: true }
    )
    .then((res) => res.status)

/**
 * Get a Supplier by ID.
 *
 * @param {string} id
 * @returns {Promise<gimmekeysTypes.User>}
 */
export const getSupplier = (id: string): Promise<gimmekeysTypes.User> =>
  axios
    .get(
      `${Env.API_HOST}/api/supplier/${encodeURIComponent(id)}`,
      { withCredentials: true }
    )
    .then((res) => res.data)

/**
 * Get Suppliers.
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

/**
 * Get all Suppliers.
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
