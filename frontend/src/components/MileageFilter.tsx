import React, { useState, useEffect, useRef } from 'react'
import * as gimmekeysTypes from 'gimmekeys-types'
import * as gimmekeysHelper from 'gimmekeys-helper'
import { strings as commonStrings } from '../lang/common'
import { strings } from '../lang/cars'
import Accordion from './Accordion'

import '../assets/css/mileage-filter.css'

interface MileageFilterProps {
  className?: string
  onChange?: (value: gimmekeysTypes.Mileage[]) => void
}

function MileageFilter({
  className,
  onChange
}: MileageFilterProps) {
  const [allChecked, setAllChecked] = useState(true)
  const [values, setValues] = useState([gimmekeysTypes.Mileage.Limited, gimmekeysTypes.Mileage.Unlimited])

  const limitedRef = useRef<HTMLInputElement>(null)
  const unlimitedRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (allChecked && limitedRef.current && unlimitedRef.current) {
      limitedRef.current.checked = true
      unlimitedRef.current.checked = true
    }
  }, [allChecked])

  const handleLimitedMileageChange = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => {
    if ('checked' in e.currentTarget && e.currentTarget.checked) {
      values.push(gimmekeysTypes.Mileage.Limited)

      if (values.length === 2) {
        setAllChecked(true)
      }
    } else {
      values.splice(
        values.findIndex((v) => v === gimmekeysTypes.Mileage.Limited),
        1,
      )

      if (values.length === 0) {
        setAllChecked(false)
      }
    }

    setValues(values)

    if (onChange) {
      onChange(gimmekeysHelper.clone(values))
    }
  }

  const handleLimitedMileageClick = (e: React.MouseEvent<HTMLElement>) => {
    const checkbox = e.currentTarget.previousSibling as HTMLInputElement
    checkbox.checked = !checkbox.checked
    const event = e
    event.currentTarget = checkbox
    handleLimitedMileageChange(event)
  }

  const handleUnlimitedMileageChange = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => {
    if ('checked' in e.currentTarget && e.currentTarget.checked) {
      values.push(gimmekeysTypes.Mileage.Unlimited)

      if (values.length === 2) {
        setAllChecked(true)
      }
    } else {
      values.splice(
        values.findIndex((v) => v === gimmekeysTypes.Mileage.Unlimited),
        1,
      )

      if (values.length === 0) {
        setAllChecked(false)
      }
    }

    setValues(values)

    if (onChange) {
      onChange(gimmekeysHelper.clone(values))
    }
  }

  const handleUnlimitedMileageClick = (e: React.MouseEvent<HTMLElement>) => {
    const checkbox = e.currentTarget.previousSibling as HTMLInputElement
    checkbox.checked = !checkbox.checked
    const event = e
    event.currentTarget = checkbox
    handleUnlimitedMileageChange(event)
  }

  const handleUncheckAllChange = () => {
    if (allChecked) {
      // uncheck all
      if (limitedRef.current) {
        limitedRef.current.checked = false
      }
      if (unlimitedRef.current) {
        unlimitedRef.current.checked = false
      }

      setAllChecked(false)
      setValues([])
    } else {
      // check all
      if (limitedRef.current) {
        limitedRef.current.checked = true
      }
      if (unlimitedRef.current) {
        unlimitedRef.current.checked = true
      }

      const _values = [gimmekeysTypes.Mileage.Limited, gimmekeysTypes.Mileage.Unlimited]

      setAllChecked(true)
      setValues(_values)

      if (onChange) {
        onChange(gimmekeysHelper.clone(_values))
      }
    }
  }

  return (
    <Accordion title={strings.MILEAGE} className={`${className ? `${className} ` : ''}mileage-filter`}>
      <div className="filter-elements">
        <div className="filter-element">
          <input ref={limitedRef} type="checkbox" className="mileage-checkbox" onChange={handleLimitedMileageChange} />
          <span
            onClick={handleLimitedMileageClick}
            role="button"
            tabIndex={0}
          >
            {strings.LIMITED}
          </span>
        </div>
        <div className="filter-element">
          <input ref={unlimitedRef} type="checkbox" className="mileage-checkbox" onChange={handleUnlimitedMileageChange} />
          <span
            onClick={handleUnlimitedMileageClick}
            role="button"
            tabIndex={0}
          >
            {strings.UNLIMITED}
          </span>
        </div>
        <div className="filter-actions">
          <span
            onClick={handleUncheckAllChange}
            className="uncheckall"
            role="button"
            tabIndex={0}
          >
            {allChecked ? commonStrings.UNCHECK_ALL : commonStrings.CHECK_ALL}
          </span>
        </div>
      </div>
    </Accordion>
  )
}

export default MileageFilter
