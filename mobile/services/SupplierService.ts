import axios from 'axios'
import * as Env from '../config/env.config'
import * as AxiosHelper from '../common/AxiosHelper'
import * as gimmekeysTypes from '../miscellaneous/gimmekeysTypes'

AxiosHelper.init(axios)

/**
 * Get all suppliers.
 *
 * @returns {Promise<gimmekeysTypes.User[]>}
 */
export const getAllSuppliers = (): Promise<gimmekeysTypes.User[]> =>
  axios
    .get(
      `${Env.API_HOST}/api/all-suppliers`
    )
    .then((res) => res.data)
