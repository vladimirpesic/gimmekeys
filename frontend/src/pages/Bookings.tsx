import React, { useEffect, useState } from 'react'
import * as gimmekeysTypes from 'gimmekeys-types'
import * as gimmekeysHelper from 'gimmekeys-helper'
import Master from '../components/Master'
import Env from '../config/env.config'
import * as Helper from '../common/Helper'
import BookingList from '../components/BookingList'
import SupplierFilter from '../components/SupplierFilter'
import StatusFilter from '../components/StatusFilter'
import BookingFilter from '../components/BookingFilter'
import * as SupplierService from '../services/SupplierService'

import '../assets/css/bookings.css'

function Bookings() {
  const [user, setUser] = useState<gimmekeysTypes.User>()
  const [allCompanies, setAllCompanies] = useState<gimmekeysTypes.User[]>([])
  const [companies, setCompanies] = useState<string[]>()
  const [statuses, setStatuses] = useState(Helper.getBookingStatuses().map((status) => status.value))
  const [filter, setFilter] = useState<gimmekeysTypes.Filter | null>()
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (user && user.verified) {
      const col1 = document.querySelector('div.col-1')
      if (col1) {
        setOffset(col1.clientHeight)
      }
    }
  }, [user])

  const handleSupplierFilterChange = (_companies: string[]) => {
    setCompanies(_companies)
  }

  const handleStatusFilterChange = (_statuses: gimmekeysTypes.BookingStatus[]) => {
    setStatuses(_statuses)
  }

  const handleBookingFilterSubmit = (_filter: gimmekeysTypes.Filter | null) => {
    setFilter(_filter)
  }

  const onLoad = async (_user?: gimmekeysTypes.User) => {
    setUser(_user)
    setLoadingCompanies(true)

    const _allCompanies = await SupplierService.getAllSuppliers()
    const _companies = gimmekeysHelper.flattenCompanies(_allCompanies)
    setAllCompanies(_allCompanies)
    setCompanies(_companies)
    setLoadingCompanies(false)
  }

  return (
    <Master onLoad={onLoad} strict>
      {user && (
        <div className="bookings">
          <div className="col-1">
            <div>
              <SupplierFilter companies={allCompanies} onChange={handleSupplierFilterChange} className="cl-company-filter" />
              <StatusFilter onChange={handleStatusFilterChange} className="cl-status-filter" />
              <BookingFilter onSubmit={handleBookingFilterSubmit} language={(user && user.language) || Env.DEFAULT_LANGUAGE} className="cl-booking-filter" collapse={!Env.isMobile()} />
            </div>
          </div>
          <div className="col-2">
            <BookingList
              containerClassName="bookings"
              offset={offset}
              user={user}
              language={user.language}
              companies={companies}
              statuses={statuses}
              filter={filter}
              loading={loadingCompanies}
              hideDates={Env.isMobile()}
              checkboxSelection={false}
            />
          </div>
        </div>
      )}
    </Master>
  )
}

export default Bookings
