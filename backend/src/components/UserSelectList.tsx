import React, { useState, useEffect } from 'react'
import * as gimmekeysTypes from 'gimmekeys-types'
import * as gimmekeysHelper from 'gimmekeys-helper'
import { TextFieldVariants } from '@mui/material'
import Env from '../config/env.config'
import * as UserService from '../services/UserService'
import * as Helper from '../common/Helper'
import MultipleSelect from './MultipleSelect'

interface UserSelectListProps {
  multiple?: boolean
  value?: gimmekeysTypes.Option | gimmekeysTypes.Option[]
  label?: string
  required?: boolean
  variant?: TextFieldVariants
  onChange?: (values: gimmekeysTypes.Option[]) => void
}

function UserSelectList({
  multiple,
  value,
  label,
  required,
  variant,
  onChange
}: UserSelectListProps) {
  const [init, setInit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [drivers, setDrivers] = useState<gimmekeysTypes.Option[]>([])
  const [fetch, setFetch] = useState(false)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<gimmekeysTypes.Option[]>([])

  useEffect(() => {
    const _value = multiple ? value as gimmekeysTypes.Option[] : [value as gimmekeysTypes.Option]
    if (value && !gimmekeysHelper.arrayEqual(selectedOptions, _value)) {
      setSelectedOptions(_value)
    }
  }, [multiple, value, selectedOptions])

  const getDrivers = (users: gimmekeysTypes.User[]): gimmekeysTypes.Option[] =>
    users.map((user) => {
      const { _id, fullName, avatar } = user
      return { _id: _id as string, name: fullName, image: avatar }
    })

  const _fetch = async (_page: number, _keyword: string, onFetch?: gimmekeysTypes.DataEvent<gimmekeysTypes.User>) => {
    try {
      setLoading(true)

      const data = await UserService.getDrivers(_keyword, _page, Env.PAGE_SIZE)

      const _data = data && data.length > 0 ? data[0] : { pageInfo: { totalRecord: 0 }, resultData: [] }
      if (!_data) {
        Helper.error()
        return
      }

      const driverOptionsList = getDrivers(_data.resultData)
      const _drivers = _page === 1 ? driverOptionsList : [...drivers, ...driverOptionsList]

      setDrivers(_drivers)
      setFetch(driverOptionsList.length > 0)

      if (onFetch) {
        onFetch()
      }
    } catch (err) {
      Helper.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (values: gimmekeysTypes.Option[]) => {
    if (onChange) {
      onChange(values)
    }
  }

  return (
    <MultipleSelect
      loading={loading}
      label={label || ''}
      callbackFromMultipleSelect={handleChange}
      options={drivers}
      selectedOptions={selectedOptions}
      required={required || false}
      multiple={multiple}
      type={gimmekeysTypes.RecordType.User}
      variant={variant || 'standard'}
      ListboxProps={{
        onScroll: (event) => {
          const listboxNode = event.currentTarget
          if (fetch && !loading && listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - Env.PAGE_OFFSET) {
            const p = page + 1
            setPage(p)
            _fetch(p, keyword)
          }
        },
      }}
      onFocus={() => {
        if (!init) {
          const p = 1
          setPage(p)
          setDrivers([])
          _fetch(p, keyword, () => {
            setInit(true)
          })
        }
      }}
      onInputChange={(event) => {
        const _value = (event && event.target && 'value' in event.target && event.target.value as string) || ''

        // if (event.target.type === 'text' && value !== keyword) {
        if (_value !== keyword) {
          setDrivers([])
          setPage(1)
          setKeyword(_value)
          _fetch(1, _value)
        }
      }}
      onClear={() => {
        setDrivers([])
        setPage(1)
        setKeyword('')
        setFetch(true)
        _fetch(1, '')
      }}
    />
  )
}

export default UserSelectList
