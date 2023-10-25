import { toast } from 'react-toastify'
import * as gimmekeysTypes from 'gimmekeys-types'
import * as gimmekeysHelper from 'gimmekeys-helper'
import { strings } from '../lang/cars'
import { strings as commonStrings } from '../lang/common'
import Env from '../config/env.config'

/**
 * Get language.
 *
 * @param {string} code
 * @returns {*}
 */
export const getLanguage = (code: string) => Env._LANGUAGES.find((l) => l.code === code)

/**
 * Toast info message.
 *
 * @param {string} message
 */
export const info = (message: string) => {
  toast(message, { type: 'info' })
}

/**
 * Toast error message.
 *
 * @param {?unknown} [err]
 * @param {?string} [message]
 */
export const error = (err?: unknown, message?: string) => {
  if (err && console && console.error) {
    console.error(err)
  }
  if (message) {
    toast(message, { type: 'error' })
  } else {
    toast(commonStrings.GENERIC_ERROR, { type: 'error' })
  }
}

/**
 * Get car type label.
 *
 * @param {string} type
 * @returns {string}
 */
export const getCarType = (type: string) => {
  switch (type) {
    case gimmekeysTypes.CarType.Diesel:
      return strings.DIESEL

    case gimmekeysTypes.CarType.Gasoline:
      return strings.GASOLINE

    default:
      return ''
  }
}

/**
 * Get short car type label.
 *
 * @param {string} type
 * @returns {string}
 */
export const getCarTypeShort = (type: string) => {
  switch (type) {
    case gimmekeysTypes.CarType.Diesel:
      return strings.DIESEL_SHORT

    case gimmekeysTypes.CarType.Gasoline:
      return strings.GASOLINE_SHORT

    default:
      return ''
  }
}

/**
 * Get gearbox type label.
 *
 * @param {string} type
 * @returns {string}
 */
export const getGearboxType = (type: string) => {
  switch (type) {
    case gimmekeysTypes.GearboxType.Manual:
      return strings.GEARBOX_MANUAL

    case gimmekeysTypes.GearboxType.Automatic:
      return strings.GEARBOX_AUTOMATIC

    default:
      return ''
  }
}

/**
 * Get short gearbox type label.
 *
 * @param {string} type
 * @returns {string}
 */
export const getGearboxTypeShort = (type: string) => {
  switch (type) {
    case gimmekeysTypes.GearboxType.Manual:
      return strings.GEARBOX_MANUAL_SHORT

    case gimmekeysTypes.GearboxType.Automatic:
      return strings.GEARBOX_AUTOMATIC_SHORT

    default:
      return ''
  }
}

/**
 * Get fuel policy label.
 *
 * @param {string} type
 * @returns {string}
 */
export const getFuelPolicy = (type: string) => {
  switch (type) {
    case gimmekeysTypes.FuelPolicy.LikeForlike:
      return strings.FUEL_POLICY_LIKE_FOR_LIKE

    case gimmekeysTypes.FuelPolicy.FreeTank:
      return strings.FUEL_POLICY_FREE_TANK

    default:
      return ''
  }
}

/**
 * Get car type tooltip.
 *
 * @param {string} type
 * @returns {string}
 */
export const getCarTypeTooltip = (type: string) => {
  switch (type) {
    case gimmekeysTypes.CarType.Diesel:
      return strings.DIESEL_TOOLTIP

    case gimmekeysTypes.CarType.Gasoline:
      return strings.GASOLINE_TOOLTIP

    default:
      return ''
  }
}

/**
 * Get gearbox tooltip.
 *
 * @param {string} type
 * @returns {string}
 */
export const getGearboxTooltip = (type: string) => {
  switch (type) {
    case gimmekeysTypes.GearboxType.Manual:
      return strings.GEARBOX_MANUAL_TOOLTIP

    case gimmekeysTypes.GearboxType.Automatic:
      return strings.GEARBOX_AUTOMATIC_TOOLTIP

    default:
      return ''
  }
}

/**
 * Get seats tooltip.
 *
 * @param {number} seats
 * @returns {string}
 */
export const getSeatsTooltip = (seats: number) => `${strings.SEATS_TOOLTIP_1}${seats} ${strings.SEATS_TOOLTIP_2}`

/**
 * Get doors tooltip.
 *
 * @param {number} doors
 * @returns {string}
 */
export const getDoorsTooltip = (doors: number) => `${strings.DOORS_TOOLTIP_1}${doors} ${strings.DOORS_TOOLTIP_2}`

/**
 * Get fuel policy tooltip.
 *
 * @param {string} fuelPolicy
 * @returns {string}
 */
export const getFuelPolicyTooltip = (fuelPolicy: string) => {
  switch (fuelPolicy) {
    case gimmekeysTypes.FuelPolicy.LikeForlike:
      return strings.FUEL_POLICY_LIKE_FOR_LIKE_TOOLTIP

    case gimmekeysTypes.FuelPolicy.FreeTank:
      return strings.FUEL_POLICY_FREE_TANK_TOOLTIP

    default:
      return ''
  }
}

/**
 * Get mileage label.
 *
 * @param {number} mileage
 * @returns {string}
 */
export const getMileage = (mileage: number) => {
  if (mileage === -1) {
    return strings.UNLIMITED
  }
  return `${gimmekeysHelper.formatNumber(mileage)} ${strings.MILEAGE_UNIT}`
}

/**
 * Get mileage tooltip.
 *
 * @param {number} mileage
 * @param {boolean} fr
 * @returns {string}
 */
export const getMileageTooltip = (mileage: number, fr: boolean) => {
  if (mileage === -1) {
    return `${strings.MILEAGE} ${strings.UNLIMITED.toLocaleLowerCase()}.`
  }
  return `${strings.MILEAGE}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(mileage)} ${strings.MILEAGE_UNIT}`
}

/**
 * Get additional driver label.
 *
 * @param {number} additionalDriver
 * @param {boolean} fr
 * @returns {string}
 */
export const getAdditionalDriver = (additionalDriver: number, fr: boolean) => {
  if (additionalDriver === -1) {
    return `${strings.ADDITIONAL_DRIVER}${fr ? ' : ' : ': '}${strings.UNAVAILABLE}`
  } if (additionalDriver === 0) {
    return `${strings.ADDITIONAL_DRIVER}${fr ? ' : ' : ': '}${strings.INCLUDED}`
  }
  return `${strings.ADDITIONAL_DRIVER}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(additionalDriver)} ${strings.CAR_CURRENCY}`
}

/**
 * Get full insurance label.
 *
 * @param {number} fullInsurance
 * @param {boolean} fr
 * @returns {string}
 */
export const getFullInsurance = (fullInsurance: number, fr: boolean) => {
  if (fullInsurance === -1) {
    return `${strings.FULL_INSURANCE}${fr ? ' : ' : ': '}${strings.UNAVAILABLE}`
  } if (fullInsurance === 0) {
    return `${strings.FULL_INSURANCE}${fr ? ' : ' : ': '}${strings.INCLUDED}${fr ? 'e' : ''}`
  }
  return `${strings.FULL_INSURANCE}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(fullInsurance)} ${strings.CAR_CURRENCY}`
}

/**
 * Get collision damage waiver label.
 *
 * @param {number} collisionDamageWaiver
 * @param {boolean} fr
 * @returns {string}
 */
export const getCollisionDamageWaiver = (collisionDamageWaiver: number, fr: boolean) => {
  if (collisionDamageWaiver === -1) {
    return `${strings.COLLISION_DAMAGE_WAVER}${fr ? ' : ' : ': '}${strings.UNAVAILABLE}`
  } if (collisionDamageWaiver === 0) {
    return `${strings.COLLISION_DAMAGE_WAVER}${fr ? ' : ' : ': '}${strings.INCLUDED}${fr ? 'e' : ''}`
  }
  return `${strings.COLLISION_DAMAGE_WAVER}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(collisionDamageWaiver)} ${strings.CAR_CURRENCY}`
}

/**
 * Get theft protection label.
 *
 * @param {number} theftProtection
 * @param {boolean} fr
 * @returns {string}
 */
export const getTheftProtection = (theftProtection: number, fr: boolean) => {
  if (theftProtection === -1) {
    return `${strings.THEFT_PROTECTION}${fr ? ' : ' : ': '}${strings.UNAVAILABLE}`
  } if (theftProtection === 0) {
    return `${strings.THEFT_PROTECTION}${fr ? ' : ' : ': '}${strings.INCLUDED}${fr ? 'e' : ''}`
  }
  return `${strings.THEFT_PROTECTION}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(theftProtection)} ${strings.CAR_CURRENCY}`
}

/**
 * Get amendments label.
 *
 * @param {number} amendments
 * @param {boolean} fr
 * @returns {string}
 */
export const getAmendments = (amendments: number, fr: boolean) => {
  if (amendments === -1) {
    return `${strings.AMENDMENTS}${fr ? ' : ' : ': '}${strings.UNAVAILABLE}${fr ? 's' : ''}`
  } if (amendments === 0) {
    return `${strings.AMENDMENTS}${fr ? ' : ' : ': '}${strings.INCLUDED}${fr ? 'es' : ''}`
  }
  return `${strings.AMENDMENTS}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(amendments)} ${commonStrings.CURRENCY}`
}

/**
 * Get cancellation label.
 *
 * @param {number} cancellation
 * @param {boolean} fr
 * @returns {string}
 */
export const getCancellation = (cancellation: number, fr: boolean) => {
  if (cancellation === -1) {
    return `${strings.CANCELLATION}${fr ? ' : ' : ': '}${strings.UNAVAILABLE}`
  } if (cancellation === 0) {
    return `${strings.CANCELLATION}${fr ? ' : ' : ': '}${strings.INCLUDED}${fr ? 'e' : ''}`
  }
  return `${strings.CANCELLATION}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(cancellation)} ${commonStrings.CURRENCY}`
}

/**
 * Get booking status label.
 *
 * @param {string} status
 * @returns {string}
 */
export const getBookingStatus = (status?: gimmekeysTypes.BookingStatus) => {
  switch (status) {
    case gimmekeysTypes.BookingStatus.Void:
      return commonStrings.BOOKING_STATUS_VOID

    case gimmekeysTypes.BookingStatus.Pending:
      return commonStrings.BOOKING_STATUS_PENDING

    case gimmekeysTypes.BookingStatus.Deposit:
      return commonStrings.BOOKING_STATUS_DEPOSIT

    case gimmekeysTypes.BookingStatus.Paid:
      return commonStrings.BOOKING_STATUS_PAID

    case gimmekeysTypes.BookingStatus.Reserved:
      return commonStrings.BOOKING_STATUS_RESERVED

    case gimmekeysTypes.BookingStatus.Cancelled:
      return commonStrings.BOOKING_STATUS_CANCELLED

    default:
      return ''
  }
}

/**
 * Get all booking statuses.
 *
 * @returns {gimmekeysTypes.StatusFilterItem[]}
 */
export const getBookingStatuses = (): gimmekeysTypes.StatusFilterItem[] => [
  {
    value: gimmekeysTypes.BookingStatus.Void,
    label: commonStrings.BOOKING_STATUS_VOID,
  },
  {
    value: gimmekeysTypes.BookingStatus.Pending,
    label: commonStrings.BOOKING_STATUS_PENDING,
  },
  {
    value: gimmekeysTypes.BookingStatus.Deposit,
    label: commonStrings.BOOKING_STATUS_DEPOSIT,
  },
  {
    value: gimmekeysTypes.BookingStatus.Paid,
    label: commonStrings.BOOKING_STATUS_PAID,
  },
  {
    value: gimmekeysTypes.BookingStatus.Reserved,
    label: commonStrings.BOOKING_STATUS_RESERVED,
  },
  {
    value: gimmekeysTypes.BookingStatus.Cancelled,
    label: commonStrings.BOOKING_STATUS_CANCELLED,
  },
]

/**
 * Get price.
 *
 * @param {gimmekeysTypes.Car} car
 * @param {Date} from
 * @param {Date} to
 * @param {?gimmekeysTypes.CarOptions} [options]
 * @returns {number}
 */
export const price = (car: gimmekeysTypes.Car, from: Date, to: Date, options?: gimmekeysTypes.CarOptions) => {
  const _days = gimmekeysHelper.days(from, to)

  let _price = car.price * _days
  if (options) {
    if (options.cancellation && car.cancellation > 0) {
      _price += car.cancellation
    }
    if (options.amendments && car.amendments > 0) {
      _price += car.amendments
    }
    if (options.theftProtection && car.theftProtection > 0) {
      _price += car.theftProtection * _days
    }
    if (options.collisionDamageWaiver && car.collisionDamageWaiver > 0) {
      _price += car.collisionDamageWaiver * _days
    }
    if (options.fullInsurance && car.fullInsurance > 0) {
      _price += car.fullInsurance * _days
    }
    if (options.additionalDriver && car.additionalDriver > 0) {
      _price += car.additionalDriver * _days
    }
  }

  return _price
}

/**
 * Get days label
 *
 * @param {number} days
 * @returns {string}
 */
export const getDays = (days: number) =>
  `${strings.PRICE_DAYS_PART_1} ${days} ${strings.PRICE_DAYS_PART_2}${days > 1 ? 's' : ''}`

/**
 * Get short days label.
 *
 * @param {number} days
 * @returns {string}
 */
export const getDaysShort = (days: number) => `${days} ${strings.PRICE_DAYS_PART_2}${days > 1 ? 's' : ''}`

/**
 * Get cancellation option label.
 *
 * @param {number} cancellation
 * @param {boolean} fr
 * @returns {string}
 */
export const getCancellationOption = (cancellation: number, fr: boolean) => {
  if (cancellation === -1) {
    return strings.UNAVAILABLE
  } if (cancellation === 0) {
    return `${strings.INCLUDED}${fr ? 'e' : ''}`
  }
  return `+ ${gimmekeysHelper.formatNumber(cancellation)} ${commonStrings.CURRENCY}`
}

/**
 * Get amendments option label.
 *
 * @param {number} amendments
 * @param {boolean} fr
 * @returns {string}
 */
export const getAmendmentsOption = (amendments: number, fr: boolean) => {
  if (amendments === -1) {
    return `${strings.UNAVAILABLE}${fr ? 's' : ''}`
  } if (amendments === 0) {
    return `${strings.INCLUDED}${fr ? 'es' : ''}`
  }
  return `+ ${gimmekeysHelper.formatNumber(amendments)} ${commonStrings.CURRENCY}`
}

/**
 * Get theft protection option label.
 *
 * @param {number} theftProtection
 * @param {number} days
 * @param {boolean} fr
 * @returns {string}
 */
export const getTheftProtectionOption = (theftProtection: number, days: number, fr: boolean) => {
  if (theftProtection === -1) {
    return strings.UNAVAILABLE
  } if (theftProtection === 0) {
    return `${strings.INCLUDED}${fr ? 'e' : ''}`
  }
  return `+ ${gimmekeysHelper.formatNumber(theftProtection * days)} ${commonStrings.CURRENCY} (${gimmekeysHelper.formatNumber(theftProtection)} ${strings.CAR_CURRENCY})`
}

/**
 * Get collision damage waiver option label.
 *
 * @param {number} collisionDamageWaiver
 * @param {number} days
 * @param {boolean} fr
 * @returns {string}
 */
export const getCollisionDamageWaiverOption = (collisionDamageWaiver: number, days: number, fr: boolean) => {
  if (collisionDamageWaiver === -1) {
    return strings.UNAVAILABLE
  } if (collisionDamageWaiver === 0) {
    return `${strings.INCLUDED}${fr ? 'e' : ''}`
  }
  return `+ ${gimmekeysHelper.formatNumber(collisionDamageWaiver * days)} ${commonStrings.CURRENCY} (${gimmekeysHelper.formatNumber(collisionDamageWaiver)} ${strings.CAR_CURRENCY})`
}

/**
 * Get full insurance option label.
 *
 * @param {number} fullInsurance
 * @param {number} days
 * @param {boolean} fr
 * @returns {string}
 */
export const getFullInsuranceOption = (fullInsurance: number, days: number, fr: boolean) => {
  if (fullInsurance === -1) {
    return strings.UNAVAILABLE
  } if (fullInsurance === 0) {
    return `${strings.INCLUDED}${fr ? 'e' : ''}`
  }
  return `+ ${gimmekeysHelper.formatNumber(fullInsurance * days)} ${commonStrings.CURRENCY} (${gimmekeysHelper.formatNumber(fullInsurance)} ${strings.CAR_CURRENCY})`
}

/**
 * Get additional driver option label.
 *
 * @param {number} additionalDriver
 * @param {number} days
 * @returns {string}
 */
export const getAdditionalDriverOption = (additionalDriver: number, days: number) => {
  if (additionalDriver === -1) {
    return strings.UNAVAILABLE
  } if (additionalDriver === 0) {
    return strings.INCLUDED
  }
  return `+ ${gimmekeysHelper.formatNumber(additionalDriver * days)} ${commonStrings.CURRENCY} (${gimmekeysHelper.formatNumber(additionalDriver)} ${strings.CAR_CURRENCY})`
}

/**
 * Get birthdate error message.
 *
 * @param {number} minimumAge
 * @returns {string}
 */
export const getBirthDateError = (minimumAge: number) =>
  `${commonStrings.BIRTH_DATE_NOT_VALID_PART1} ${minimumAge} ${commonStrings.BIRTH_DATE_NOT_VALID_PART2}`

/**
 * Check whether a car option is available or not.
 *
 * @param {(gimmekeysTypes.Car | undefined)} car
 * @param {string} option
 * @returns {boolean}
 */
export const carOptionAvailable = (car: gimmekeysTypes.Car | undefined, option: string) =>
  car && option in car && (car[option] as number) > -1
