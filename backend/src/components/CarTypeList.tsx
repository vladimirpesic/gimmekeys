import React, { useState, useEffect } from 'react'
import {
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material'
import * as gimmekeysTypes from 'gimmekeys-types'
import { strings } from '../lang/cars'

interface CarTypeListProps {
  value?: string,
  required?: boolean,
  label?: string
  variant?: 'filled' | 'standard' | 'outlined'
  onChange?: (value: string) => void
}

function CarTypeList({
  value: carTypeValue,
  required,
  label,
  variant,
  onChange
}: CarTypeListProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(carTypeValue || '')
  }, [carTypeValue])

  const handleChange = (e: SelectChangeEvent<string>) => {
    const _value = e.target.value || ''
    setValue(_value)

    if (onChange) {
      onChange(_value)
    }
  }

  return (
    <div>
      <InputLabel className={required ? 'required' : ''}>{label}</InputLabel>
      <Select label={label} value={value} onChange={handleChange} variant={variant || 'standard'} required={required} fullWidth>
        <MenuItem value={gimmekeysTypes.CarType.Diesel}>{strings.DIESEL}</MenuItem>
        <MenuItem value={gimmekeysTypes.CarType.Gasoline}>{strings.GASOLINE}</MenuItem>
      </Select>
    </div>
  )
}

export default CarTypeList
