import React, { useState, useEffect } from 'react'
import {
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextFieldVariants
} from '@mui/material'
import * as gimmekeysTypes from 'gimmekeys-types'
import { strings } from '../lang/cars'

interface FuelPolicyListProps {
  value?: string
  label?: string
  required?: boolean
  variant: TextFieldVariants
  onChange?: (value: string) => void
}

function FuelPolicyList({
  value: fuelPolicyValue,
  label,
  required,
  variant,
  onChange
}: FuelPolicyListProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(fuelPolicyValue || '')
  }, [fuelPolicyValue])

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
        <MenuItem value={gimmekeysTypes.FuelPolicy.LikeForlike}>{strings.FUEL_POLICY_LIKE_FOR_LIKE}</MenuItem>
        <MenuItem value={gimmekeysTypes.FuelPolicy.FreeTank}>{strings.FUEL_POLICY_FREE_TANK}</MenuItem>
      </Select>
    </div>
  )
}

export default FuelPolicyList
