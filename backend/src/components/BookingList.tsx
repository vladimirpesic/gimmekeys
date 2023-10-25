import React, { useState, useEffect } from 'react'
import {
  DataGrid,
  frFR,
  enUS,
  GridPaginationModel,
  GridColDef,
  GridRowId,
  GridValueGetterParams,
  GridRenderCellParams
} from '@mui/x-data-grid'
import {
  Tooltip,
  IconButton,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Check as CheckIcon } from '@mui/icons-material'
import { format } from 'date-fns'
import { fr as dfnsFR, enUS as dfnsENUS } from 'date-fns/locale'
import * as gimmekeysTypes from 'gimmekeys-types'
import * as gimmekeysHelper from 'gimmekeys-helper'
import Env from '../config/env.config'
import { strings as commonStrings } from '../lang/common'
import { strings as csStrings } from '../lang/cars'
import { strings } from '../lang/booking-list'
import * as Helper from '../common/Helper'
import * as BookingService from '../services/BookingService'
import StatusList from './StatusList'

import '../assets/css/booking-list.css'

interface BookingListProps {
  companies?: string[]
  statuses?: string[]
  filter?: gimmekeysTypes.Filter | null
  car?: string
  offset?: number
  user?: gimmekeysTypes.User
  loggedUser?: gimmekeysTypes.User
  containerClassName?: string
  hideDates?: boolean
  hideCarColumn?: boolean
  hideCompanyColumn?: boolean
  language?: string
  loading?: boolean
  checkboxSelection?: boolean
  onLoad?: gimmekeysTypes.DataEvent<gimmekeysTypes.Booking>
}

function BookingList({
  companies: bookingCompanies,
  statuses: bookingStatuses,
  filter: bookingFilter,
  car: bookingCar,
  offset: bookingOffset,
  user: bookingUser,
  loggedUser: bookingLoggedUser,
  containerClassName,
  hideDates,
  hideCarColumn,
  hideCompanyColumn,
  language,
  loading: bookingLoading,
  checkboxSelection,
  onLoad,
}: BookingListProps) {
  const [loggedUser, setLoggedUser] = useState<gimmekeysTypes.User>()
  const [user, setUser] = useState<gimmekeysTypes.User>()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(Env.isMobile() ? Env.BOOKINGS_MOBILE_PAGE_SIZE : Env.BOOKINGS_PAGE_SIZE)
  const [columns, setColumns] = useState<GridColDef<gimmekeysTypes.Booking>[]>([])
  const [rows, setRows] = useState<gimmekeysTypes.Booking[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [fetch, setFetch] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [companies, setCompanies] = useState<string[] | undefined>(bookingCompanies)
  const [statuses, setStatuses] = useState<string[] | undefined>(bookingStatuses)
  const [status, setStatus] = useState<gimmekeysTypes.BookingStatus>()
  const [filter, setFilter] = useState<gimmekeysTypes.Filter | undefined | null>(bookingFilter)
  const [car, setCar] = useState<string>(bookingCar || '')
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [openDeleteDialog, setopenDeleteDialog] = useState(false)
  const [offset, setOffset] = useState(0)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: Env.BOOKINGS_PAGE_SIZE,
    page: 0,
  })
  const [init, setInit] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPage(paginationModel.page)
    setPageSize(paginationModel.pageSize)
  }, [paginationModel])

  const _fetch = async (_page: number, _user?: gimmekeysTypes.User) => {
    try {
      const _pageSize = Env.isMobile() ? Env.BOOKINGS_MOBILE_PAGE_SIZE : pageSize

      if (companies && statuses) {
        setLoading(true)
        const payload: gimmekeysTypes.GetBookingsPayload = {
          companies,
          statuses,
          filter: filter || undefined,
          car,
          user: (_user && _user._id) || undefined,
        }

        const data = await BookingService.getBookings(
          payload,
          _page,
          _pageSize,
        )
        const _data = data && data.length > 0 ? data[0] : { pageInfo: { totalRecord: 0 }, resultData: [] }
        if (!_data) {
          Helper.error()
          return
        }
        const totalRecords = Array.isArray(_data.pageInfo) && _data.pageInfo.length > 0 ? _data.pageInfo[0].totalRecords : 0

        if (Env.isMobile()) {
          const _rows = _page === 0 ? _data.resultData : [...rows, ..._data.resultData]
          setRows(_rows)
          setRowCount(totalRecords)
          setFetch(_data.resultData.length > 0)
          if (onLoad) {
            onLoad({ rows: _data.resultData, rowCount: totalRecords })
          }
        } else {
          setRows(_data.resultData)
          setRowCount(totalRecords)
          if (onLoad) {
            onLoad({ rows: _data.resultData, rowCount: totalRecords })
          }
        }
      } else {
        setRows([])
        setRowCount(0)
        if (onLoad) {
          onLoad({ rows: [], rowCount: 0 })
        }
      }
    } catch (err) {
      Helper.error(err)
    } finally {
      setLoading(false)
      setInit(false)
    }
  }

  useEffect(() => {
    setCompanies(bookingCompanies)
  }, [bookingCompanies])

  useEffect(() => {
    setStatuses(bookingStatuses)
  }, [bookingStatuses])

  useEffect(() => {
    setFilter(bookingFilter)
  }, [bookingFilter])

  useEffect(() => {
    setCar(bookingCar || '')
  }, [bookingCar])

  useEffect(() => {
    setOffset(bookingOffset || 0)
  }, [bookingOffset])

  useEffect(() => {
    setUser(bookingUser)
  }, [bookingUser])

  useEffect(() => {
    if (companies && statuses) {
      _fetch(page, user)
    }
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (companies && statuses) {
      if (page === 0) {
        _fetch(0, user)
      } else {
        const _paginationModel = gimmekeysHelper.clone(paginationModel)
        _paginationModel.page = 0
        setPaginationModel(_paginationModel)
      }
    }
  }, [pageSize]) // eslint-disable-line react-hooks/exhaustive-deps

  const getDate = (date?: string) => {
    if (date) {
      const d = new Date(date)
      return `${gimmekeysHelper.formatDatePart(d.getDate())}-${gimmekeysHelper.formatDatePart(d.getMonth() + 1)}-${d.getFullYear()}`
    }

    throw new Error('Invalid date')
  }

  const getColumns = (): GridColDef<gimmekeysTypes.Booking>[] => {
    const _columns: GridColDef<gimmekeysTypes.Booking>[] = [
      {
        field: 'driver',
        headerName: strings.DRIVER,
        flex: 1,
        renderCell: ({ row, value }: GridRenderCellParams<gimmekeysTypes.Booking, string>) => <Link href={`/user?u=${(row.driver as gimmekeysTypes.User)._id}`}>{value}</Link>,
        valueGetter: ({ value }: GridValueGetterParams<gimmekeysTypes.Booking, gimmekeysTypes.User>) => value?.fullName,
      },
      {
        field: 'from',
        headerName: commonStrings.FROM,
        flex: 1,
        valueGetter: ({ value }: GridValueGetterParams<gimmekeysTypes.Booking, string>) => getDate(value),
      },
      {
        field: 'to',
        headerName: commonStrings.TO,
        flex: 1,
        valueGetter: ({ value }: GridValueGetterParams<gimmekeysTypes.Booking, string>) => getDate(value),
      },
      {
        field: 'price',
        headerName: strings.PRICE,
        flex: 1,
        renderCell: ({ value }: GridRenderCellParams<gimmekeysTypes.Booking, string>) => <span className="bp">{value}</span>,
        valueGetter: ({ value }: GridValueGetterParams<gimmekeysTypes.Booking, number>) => `${gimmekeysHelper.formatNumber(value)} ${commonStrings.CURRENCY}`,
      },
      {
        field: 'status',
        headerName: strings.STATUS,
        flex: 1,
        renderCell: ({ value }: GridRenderCellParams<gimmekeysTypes.Booking, gimmekeysTypes.BookingStatus>) => <span className={`bs bs-${value?.toLowerCase()}`}>{Helper.getBookingStatus(value)}</span>,
        valueGetter: ({ value }: GridValueGetterParams<gimmekeysTypes.Booking, string>) => value,
      },
      {
        field: 'action',
        headerName: '',
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ row }: GridRenderCellParams<gimmekeysTypes.Booking>) => {
          const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation() // don't select this row after clicking
            setSelectedId(row._id || '')
            setopenDeleteDialog(true)
          }

          return (
            <div>
              <Tooltip title={commonStrings.UPDATE}>
                <IconButton href={`update-booking?b=${row._id}`}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={commonStrings.DELETE}>
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          )
        },
        renderHeader: () => (selectedIds.length > 0 ? (
          <div>
            <Tooltip title={strings.UPDATE_SELECTION}>
              <IconButton
                onClick={() => {
                  setOpenUpdateDialog(true)
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={strings.DELETE_SELECTION}>
              <IconButton
                onClick={() => {
                  setopenDeleteDialog(true)
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <></>
        )),
      },
    ]

    if (hideDates) {
      _columns.splice(1, 2)
    }

    if (!hideCarColumn) {
      _columns.unshift({
        field: 'car',
        headerName: strings.CAR,
        flex: 1,
        renderCell: ({ row, value }: GridRenderCellParams<gimmekeysTypes.Booking, string>) => <Link href={`/car?cr=${(row.car as gimmekeysTypes.Car)._id}`}>{value}</Link>,
        valueGetter: ({ value }: GridValueGetterParams<gimmekeysTypes.Booking, gimmekeysTypes.Car>) => value?.name,
      })
    }

    if (Helper.admin(loggedUser) && !hideCompanyColumn) {
      _columns.unshift({
        field: 'company',
        headerName: commonStrings.SUPPLIER,
        flex: 1,
        renderCell: ({ row, value }: GridRenderCellParams<gimmekeysTypes.Booking, string>) => (
          <Link href={`/supplier?c=${(row.company as gimmekeysTypes.User)._id}`} className="cell-company">
            <img src={gimmekeysHelper.joinURL(Env.CDN_USERS, (row.company as gimmekeysTypes.User).avatar)} alt={value} />
          </Link>
        ),
        valueGetter: ({ value }: GridValueGetterParams<gimmekeysTypes.Booking, gimmekeysTypes.User>) => value?.fullName,
      })
    }

    return _columns
  }

  useEffect(() => {
    if (companies && statuses) {
      const _columns = getColumns()
      setColumns(_columns)

      if (page === 0) {
        _fetch(0, user)
      } else {
        const _paginationModel = gimmekeysHelper.clone(paginationModel)
        _paginationModel.page = 0
        setPaginationModel(_paginationModel)
      }
    }
  }, [companies, statuses, filter]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const _columns = getColumns()
    setColumns(_columns)
  }, [selectedIds]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoggedUser(bookingLoggedUser || undefined)
  }, [bookingLoggedUser])

  useEffect(() => {
    if (Env.isMobile()) {
      const element: HTMLDivElement | null = (containerClassName
        ? document.querySelector(`.${containerClassName}`)
        : document.querySelector('div.bookings'))

      if (element) {
        element.onscroll = (event: Event) => {
          if (fetch && !loading) {
            const target = event.target as HTMLDivElement

            if (
              target.scrollTop > 0
              && target.offsetHeight + target.scrollTop + Env.INFINITE_SCROLL_OFFSET >= target.scrollHeight
            ) {
              setLoading(true)
              setPage(page + 1)
            }
          }
        }
      }
    }
  }, [containerClassName, page, fetch, loading, offset]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancelUpdate = () => {
    setOpenUpdateDialog(false)
  }

  const handleStatusChange = (_status: gimmekeysTypes.BookingStatus) => {
    setStatus(_status)
  }

  const handleConfirmUpdate = async () => {
    try {
      if (!status) {
        Helper.error()
        return
      }

      const data: gimmekeysTypes.UpdateStatusPayload = { ids: selectedIds, status }

      const _status = await BookingService.updateStatus(data)

      if (_status === 200) {
        rows.forEach((row: gimmekeysTypes.Booking) => {
          if (row._id && selectedIds.includes(row._id)) {
            row.status = status
          }
        })
        setRows(gimmekeysHelper.clone(rows))
      } else {
        Helper.error()
      }

      setOpenUpdateDialog(false)
    } catch (err) {
      Helper.error(err)
    }
  }

  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    const _selectedId = e.currentTarget.getAttribute('data-id') as string
    const _selectedIndex = Number(e.currentTarget.getAttribute('data-index') as string)

    setSelectedId(_selectedId)
    setSelectedIndex(_selectedIndex)
    setopenDeleteDialog(true)
    setSelectedId(_selectedId)
    setSelectedIndex(_selectedIndex)
  }

  const handleCancelDelete = () => {
    setopenDeleteDialog(false)
    setSelectedId('')
  }

  const handleConfirmDelete = async () => {
    try {
      if (Env.isMobile()) {
        const ids = [selectedId]

        const _status = await BookingService.deleteBookings(ids)

        if (_status === 200) {
          rows.splice(selectedIndex, 1)
          setRows(rows)
          setSelectedId('')
          setSelectedIndex(-1)
        } else {
          Helper.error()
        }

        setopenDeleteDialog(false)
      } else {
        const ids = selectedIds.length > 0 ? selectedIds : [selectedId]

        const _status = await BookingService.deleteBookings(ids)

        if (_status === 200) {
          if (selectedIds.length > 0) {
            setRows(rows.filter((row) => row._id && !selectedIds.includes(row._id)))
          } else {
            setRows(rows.filter((row) => row._id !== selectedId))
          }
        } else {
          Helper.error()
        }

        setopenDeleteDialog(false)
      }
    } catch (err) {
      Helper.error(err)
    }
  }

  const _fr = language === 'fr'
  const _locale = _fr ? dfnsFR : dfnsENUS
  const _format = _fr ? 'eee d LLL kk:mm' : 'eee, d LLL, kk:mm'
  const bookingDetailHeight = Env.COMPANY_IMAGE_HEIGHT + 10

  return (
    <div className="bs-list">
      {loggedUser
        && (rows.length === 0 ? (
          !loading
          && !init
          && !bookingLoading
          && (
            <Card variant="outlined" className="empty-list">
              <CardContent>
                <Typography color="textSecondary">{strings.EMPTY_LIST}</Typography>
              </CardContent>
            </Card>
          )
        ) : Env.isMobile() ? (
          <>
            {rows.map((booking, index) => {
              const from = new Date(booking.from)
              const to = new Date(booking.to)
              const days = gimmekeysHelper.days(from, to)

              return (
                <div key={booking._id} className="booking-details">
                  <div className={`bs bs-${booking.status}`}>
                    <span>{Helper.getBookingStatus(booking.status)}</span>
                  </div>
                  <div className="booking-detail" style={{ height: bookingDetailHeight }}>
                    <span className="booking-detail-title">{strings.CAR}</span>
                    <div className="booking-detail-value">
                      <Link href={`car/?cr=${(booking.car as gimmekeysTypes.Car)._id}`}>{(booking.car as gimmekeysTypes.Car).name}</Link>
                    </div>
                  </div>
                  <div className="booking-detail" style={{ height: bookingDetailHeight }}>
                    <span className="booking-detail-title">{strings.DRIVER}</span>
                    <div className="booking-detail-value">
                      <Link href={`user/?u=${(booking.driver as gimmekeysTypes.User)._id}`}>{(booking.driver as gimmekeysTypes.User).fullName}</Link>
                    </div>
                  </div>
                  <div className="booking-detail" style={{ height: bookingDetailHeight }}>
                    <span className="booking-detail-title">{strings.DAYS}</span>
                    <div className="booking-detail-value">
                      {`${Helper.getDaysShort(gimmekeysHelper.days(from, to))} (${gimmekeysHelper.capitalize(
                        format(from, _format, { locale: _locale }),
                      )} - ${gimmekeysHelper.capitalize(format(to, _format, { locale: _locale }))})`}
                    </div>
                  </div>
                  <div className="booking-detail" style={{ height: bookingDetailHeight }}>
                    <span className="booking-detail-title">{commonStrings.PICKUP_LOCATION}</span>
                    <div className="booking-detail-value">{(booking.pickupLocation as gimmekeysTypes.Location).name}</div>
                  </div>
                  <div className="booking-detail" style={{ height: bookingDetailHeight }}>
                    <span className="booking-detail-title">{commonStrings.DROP_OFF_LOCATION}</span>
                    <div className="booking-detail-value">{(booking.dropOffLocation as gimmekeysTypes.Location).name}</div>
                  </div>
                  <div className="booking-detail" style={{ height: bookingDetailHeight }}>
                    <span className="booking-detail-title">{commonStrings.SUPPLIER}</span>
                    <div className="booking-detail-value">
                      <div className="car-company">
                        <img src={gimmekeysHelper.joinURL(Env.CDN_USERS, (booking.company as gimmekeysTypes.User).avatar)} alt={(booking.company as gimmekeysTypes.User).fullName} />
                        <span className="car-company-name">{(booking.company as gimmekeysTypes.User).fullName}</span>
                      </div>
                    </div>
                  </div>

                  {(booking.cancellation || booking.amendments || booking.collisionDamageWaiver || booking.theftProtection || booking.fullInsurance || booking.additionalDriver) && (
                    <>
                      <div className="extras">
                        <span className="extras-title">{commonStrings.OPTIONS}</span>
                        {booking.cancellation && (
                          <div className="extra">
                            <CheckIcon className="extra-icon" />
                            <span className="extra-title">{csStrings.CANCELLATION}</span>
                            <span className="extra-text">{Helper.getCancellationOption((booking.car as gimmekeysTypes.Car).cancellation, _fr, true)}</span>
                          </div>
                        )}

                        {booking.amendments && (
                          <div className="extra">
                            <CheckIcon className="extra-icon" />
                            <span className="extra-title">{csStrings.AMENDMENTS}</span>
                            <span className="extra-text">{Helper.getAmendmentsOption((booking.car as gimmekeysTypes.Car).amendments, _fr, true)}</span>
                          </div>
                        )}

                        {booking.collisionDamageWaiver && (
                          <div className="extra">
                            <CheckIcon className="extra-icon" />
                            <span className="extra-title">{csStrings.COLLISION_DAMAGE_WAVER}</span>
                            <span className="extra-text">{Helper.getCollisionDamageWaiverOption((booking.car as gimmekeysTypes.Car).collisionDamageWaiver, days, _fr, true)}</span>
                          </div>
                        )}

                        {booking.theftProtection && (
                          <div className="extra">
                            <CheckIcon className="extra-icon" />
                            <span className="extra-title">{csStrings.THEFT_PROTECTION}</span>
                            <span className="extra-text">{Helper.getTheftProtectionOption((booking.car as gimmekeysTypes.Car).theftProtection, days, _fr, true)}</span>
                          </div>
                        )}

                        {booking.fullInsurance && (
                          <div className="extra">
                            <CheckIcon className="extra-icon" />
                            <span className="extra-title">{csStrings.FULL_INSURANCE}</span>
                            <span className="extra-text">{Helper.getFullInsuranceOption((booking.car as gimmekeysTypes.Car).fullInsurance, days, _fr, true)}</span>
                          </div>
                        )}

                        {booking.additionalDriver && (
                          <div className="extra">
                            <CheckIcon className="extra-icon" />
                            <span className="extra-title">{csStrings.ADDITIONAL_DRIVER}</span>
                            <span className="extra-text">{Helper.getAdditionalDriverOption((booking.car as gimmekeysTypes.Car).additionalDriver, days, _fr, true)}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="booking-detail" style={{ height: bookingDetailHeight }}>
                    <span className="booking-detail-title">{strings.COST}</span>
                    <div className="booking-detail-value booking-price">{`${gimmekeysHelper.formatNumber(booking.price)} ${commonStrings.CURRENCY}`}</div>
                  </div>

                  <div className="bs-buttons">
                    <Button
                      variant="contained"
                      className="btn-primary"
                      size="small"
                      href={`update-booking?b=${booking._id}`}
                    >
                      {commonStrings.UPDATE}
                    </Button>
                    <Button
                      variant="contained"
                      className="btn-secondary"
                      size="small"
                      data-id={booking._id}
                      data-index={index}
                      onClick={handleDelete}
                    >
                      {commonStrings.DELETE}
                    </Button>
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <DataGrid
            checkboxSelection={checkboxSelection}
            getRowId={(row: gimmekeysTypes.Booking): GridRowId => row._id as GridRowId}
            columns={columns}
            rows={rows}
            rowCount={rowCount}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: Env.BOOKINGS_PAGE_SIZE },
              },
            }}
            pageSizeOptions={[Env.BOOKINGS_PAGE_SIZE, 50, 100]}
            pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            localeText={(loggedUser.language === 'fr' ? frFR : enUS).components.MuiDataGrid.defaultProps.localeText}
            // slots={{
            //   noRowsOverlay: () => '',
            // }}
            onRowSelectionModelChange={(_selectedIds) => {
              setSelectedIds(Array.from(new Set(_selectedIds)).map((id) => id.toString()))
            }}
            disableRowSelectionOnClick
          />
        ))}
      <Dialog disableEscapeKeyDown maxWidth="xs" open={openUpdateDialog}>
        <DialogTitle className="dialog-header">{strings.UPDATE_STATUS}</DialogTitle>
        <DialogContent className="bs-update-status">
          <StatusList label={strings.NEW_STATUS} onChange={handleStatusChange} />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleCancelUpdate} variant="contained" className="btn-secondary">
            {commonStrings.CANCEL}
          </Button>
          <Button onClick={handleConfirmUpdate} variant="contained" className="btn-primary">
            {commonStrings.UPDATE}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog disableEscapeKeyDown maxWidth="xs" open={openDeleteDialog}>
        <DialogTitle className="dialog-header">{commonStrings.CONFIRM_TITLE}</DialogTitle>
        <DialogContent className="dialog-content">{selectedIds.length === 0 ? strings.DELETE_BOOKING : strings.DELETE_BOOKINGS}</DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleCancelDelete} variant="contained" className="btn-secondary">
            {commonStrings.CANCEL}
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            {commonStrings.DELETE}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default BookingList
