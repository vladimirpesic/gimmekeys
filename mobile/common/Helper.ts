import { Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp } from '@react-navigation/native'

import * as mime from 'mime'
import i18n from '../lang/i18n'
import * as UserService from '../services/UserService'
import * as gimmekeysTypes from '../miscellaneous/gimmekeysTypes'
import * as gimmekeysHelper from '../miscellaneous/gimmekeysHelper'
import * as ToasHelper from './ToastHelper'

/**
 * Indicate whether Platform OS is Android or not.
 *
 * @returns {boolean}
 */
export const android = () => Platform.OS === 'android'

/**
 * Toast message.
 *
 * @param {string} message
 */
export const toast = (message: string) => {
  ToasHelper.toast(message)
}

/**
 * Toast error message.
 *
 * @param {?unknown} [err]
 * @param {boolean} [__toast__=true]
 */
export const error = (err?: unknown, __toast__ = true) => {
  ToasHelper.error(err, __toast__)
}

/**
 * Get filename.
 *
 * @param {string} path
 * @returns {string}
 */
export const getFileName = (path: string) => path.replace(/^.*[\\/]/, '')

/**
 * Get MIME type.
 *
 * @param {string} fileName
 * @returns {string|null}
 */
export const getMimeType = (fileName: string) => mime.getType(fileName)

/**
 * Register push token.
 *
 * @async
 * @param {string} userId
 * @returns {void}
 */
export const registerPushToken = async (userId: string) => {
  async function registerForPushNotificationsAsync() {
    let token

    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync()
          finalStatus = status
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!')
          return ''
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId,
          })
        ).data
      } else {
        alert('Must use physical device for Push Notifications')
      }

      if (android()) {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        })
      }
    } catch (err) {
      error(err, false)
    }

    return token
  }

  try {
    await UserService.deletePushToken(userId)
    const token = await registerForPushNotificationsAsync()

    if (token) {
      const status = await UserService.createPushToken(userId, token)
      if (status !== 200) {
        error()
      }
    } else {
      error()
    }
  } catch (err) {
    error(err, false)
  }
}

/**
 * Add time to date.
 *
 * @param {Date} date
 * @param {Date} time
 * @returns {Date}
 */
export const dateTime = (date: Date, time: Date) => {
  const _dateTime = new Date(date)
  _dateTime.setHours(time.getHours())
  _dateTime.setMinutes(time.getMinutes())
  _dateTime.setSeconds(time.getSeconds())
  _dateTime.setMilliseconds(time.getMilliseconds())
  return _dateTime
}

/**
 * Get short car type.
 *
 * @param {string} type
 * @returns {string}
 */
export const getCarTypeShort = (type: string) => {
  switch (type) {
    case gimmekeysTypes.CarType.Diesel:
      return i18n.t('DIESEL_SHORT')

    case gimmekeysTypes.CarType.Gasoline:
      return i18n.t('GASOLINE_SHORT')

    default:
      return ''
  }
}

/**
 * Get short gearbox type.
 *
 * @param {string} type
 * @returns {string}
 */
export const getGearboxTypeShort = (type: string) => {
  switch (type) {
    case gimmekeysTypes.GearboxType.Manual:
      return i18n.t('GEARBOX_MANUAL_SHORT')

    case gimmekeysTypes.GearboxType.Automatic:
      return i18n.t('GEARBOX_AUTOMATIC_SHORT')

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
    return i18n.t('UNLIMITED')
  }
  return `${gimmekeysHelper.formatNumber(mileage)} ${i18n.t('MILEAGE_UNIT')}`
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
      return i18n.t('FUEL_POLICY_LIKE_FOR_LIKE')

    case gimmekeysTypes.FuelPolicy.FreeTank:
      return i18n.t('FUEL_POLICY_FREE_TANK')

    default:
      return ''
  }
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
    return `${i18n.t('CANCELLATION')}${fr ? ' : ' : ': '}${i18n.t('UNAVAILABLE')}`
  } if (cancellation === 0) {
    return `${i18n.t('CANCELLATION')}${fr ? ' : ' : ': '}${i18n.t('INCLUDED')}${fr ? 'e' : ''}`
  }
  return `${i18n.t('CANCELLATION')}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(cancellation)} ${i18n.t('CURRENCY')}`
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
    return `${i18n.t('AMENDMENTS')}${fr ? ' : ' : ': '}${i18n.t('UNAVAILABLE')}${fr ? 's' : ''}`
  } if (amendments === 0) {
    return `${i18n.t('AMENDMENTS')}${fr ? ' : ' : ': '}${i18n.t('INCLUDED')}${fr ? 'es' : ''}`
  }
  return `${i18n.t('AMENDMENTS')}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(amendments)} ${i18n.t('CURRENCY')}`
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
    return `${i18n.t('THEFT_PROTECTION')}${fr ? ' : ' : ': '}${i18n.t('UNAVAILABLE')}`
  } if (theftProtection === 0) {
    return `${i18n.t('THEFT_PROTECTION')}${fr ? ' : ' : ': '}${i18n.t('INCLUDED')}${fr ? 'e' : ''}`
  }
  return `${i18n.t('THEFT_PROTECTION')}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(theftProtection)} ${i18n.t('CAR_CURRENCY')}`
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
    return `${i18n.t('COLLISION_DAMAGE_WAVER')}${fr ? ' : ' : ': '}${i18n.t('UNAVAILABLE')}`
  } if (collisionDamageWaiver === 0) {
    return `${i18n.t('COLLISION_DAMAGE_WAVER')}${fr ? ' : ' : ': '}${i18n.t('INCLUDED')}${fr ? 'e' : ''}`
  }
  return `${i18n.t('COLLISION_DAMAGE_WAVER')}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(collisionDamageWaiver)} ${i18n.t('CAR_CURRENCY')}`
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
    return `${i18n.t('FULL_INSURANCE')}${fr ? ' : ' : ': '}${i18n.t('UNAVAILABLE')}`
  } if (fullInsurance === 0) {
    return `${i18n.t('FULL_INSURANCE')}${fr ? ' : ' : ': '}${i18n.t('INCLUDED')}${fr ? 'e' : ''}`
  }
  return `${i18n.t('FULL_INSURANCE')}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(fullInsurance)} ${i18n.t('CAR_CURRENCY')}`
}

/**
 * Get addtional driver label.
 *
 * @param {number} additionalDriver
 * @param {boolean} fr
 * @returns {string}
 */
export const getAdditionalDriver = (additionalDriver: number, fr: boolean) => {
  if (additionalDriver === -1) {
    return `${i18n.t('ADDITIONAL_DRIVER')}${fr ? ' : ' : ': '}${i18n.t('UNAVAILABLE')}`
  } if (additionalDriver === 0) {
    return `${i18n.t('ADDITIONAL_DRIVER')}${fr ? ' : ' : ': '}${i18n.t('INCLUDED')}`
  }
  return `${i18n.t('ADDITIONAL_DRIVER')}${fr ? ' : ' : ': '}${gimmekeysHelper.formatNumber(additionalDriver)} ${i18n.t('CAR_CURRENCY')}`
}

/**
 * Get days label?
 *
 * @param {number} days
 * @returns {string}
 */
export const getDays = (days: number) => `${i18n.t('PRICE_DAYS_PART_1')} ${days} ${i18n.t('PRICE_DAYS_PART_2')}${days > 1 ? 's' : ''}`

/**
 * Get short days label.
 *
 * @param {number} days
 * @returns {string}
 */
export const getDaysShort = (days: number) => `${days} ${i18n.t('PRICE_DAYS_PART_2')}${days > 1 ? 's' : ''}`

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
 * Get cancellation option label.
 *
 * @param {number} cancellation
 * @param {boolean} fr
 * @param {?boolean} [hidePlus]
 * @returns {string}
 */
export const getCancellationOption = (cancellation: number, fr: boolean, hidePlus?: boolean) => {
  if (cancellation === -1) {
    return i18n.t('UNAVAILABLE')
  } if (cancellation === 0) {
    return `${i18n.t('INCLUDED')}${fr ? 'e' : ''}`
  }
  return `${hidePlus ? '' : '+ '}${gimmekeysHelper.formatNumber(cancellation)} ${i18n.t('CURRENCY')}`
}

/**
 * Get amendments option label.
 *
 * @param {number} amendments
 * @param {boolean} fr
 * @param {?boolean} [hidePlus]
 * @returns {string}
 */
export const getAmendmentsOption = (amendments: number, fr: boolean, hidePlus?: boolean) => {
  if (amendments === -1) {
    return `${i18n.t('UNAVAILABLE')}${fr ? 's' : ''}`
  } if (amendments === 0) {
    return `${i18n.t('INCLUDED')}${fr ? 'es' : ''}`
  }
  return `${hidePlus ? '' : '+ '}${gimmekeysHelper.formatNumber(amendments)} ${i18n.t('CURRENCY')}`
}

/**
 * Get collision damage waiver option label.
 *
 * @param {number} collisionDamageWaiver
 * @param {number} days
 * @param {boolean} fr
 * @param {?boolean} [hidePlus]
 * @returns {string}
 */
export const getCollisionDamageWaiverOption = (collisionDamageWaiver: number, days: number, fr: boolean, hidePlus?: boolean) => {
  if (collisionDamageWaiver === -1) {
    return i18n.t('UNAVAILABLE')
  } if (collisionDamageWaiver === 0) {
    return `${i18n.t('INCLUDED')}${fr ? 'e' : ''}`
  }
  return `${hidePlus ? '' : '+ '}${gimmekeysHelper.formatNumber(collisionDamageWaiver * days)} ${i18n.t('CURRENCY')} (${gimmekeysHelper.formatNumber(collisionDamageWaiver)} ${i18n.t('CAR_CURRENCY')})`
}

/**
 * Get theft protection option label.
 *
 * @param {number} theftProtection
 * @param {number} days
 * @param {boolean} fr
 * @param {?boolean} [hidePlus]
 * @returns {string}
 */
export const getTheftProtectionOption = (theftProtection: number, days: number, fr: boolean, hidePlus?: boolean) => {
  if (theftProtection === -1) {
    return i18n.t('UNAVAILABLE')
  } if (theftProtection === 0) {
    return `${i18n.t('INCLUDED')}${fr ? 'e' : ''}`
  }
  return `${hidePlus ? '' : '+ '}${gimmekeysHelper.formatNumber(theftProtection * days)} ${i18n.t('CURRENCY')} (${gimmekeysHelper.formatNumber(theftProtection)} ${i18n.t('CAR_CURRENCY')})`
}

/**
 * Description placeholder
 *
 * @param {number} fullInsurance
 * @param {number} days
 * @param {boolean} fr
 * @param {?boolean} [hidePlus]
 * @returns {string}
 */
export const getFullInsuranceOption = (fullInsurance: number, days: number, fr: boolean, hidePlus?: boolean) => {
  if (fullInsurance === -1) {
    return i18n.t('UNAVAILABLE')
  } if (fullInsurance === 0) {
    return `${i18n.t('INCLUDED')}${fr ? 'e' : ''}`
  }
  return `${hidePlus ? '' : '+ '}${gimmekeysHelper.formatNumber(fullInsurance * days)} ${i18n.t('CURRENCY')} (${gimmekeysHelper.formatNumber(fullInsurance)} ${i18n.t('CAR_CURRENCY')})`
}

/**
 * Get addional driver option label.
 *
 * @param {number} additionalDriver
 * @param {number} days
 * @param {boolean} fr
 * @param {?boolean} [hidePlus]
 * @returns {string}
 */
export const getAdditionalDriverOption = (additionalDriver: number, days: number, fr: boolean, hidePlus?: boolean) => {
  if (additionalDriver === -1) {
    return i18n.t('UNAVAILABLE')
  } if (additionalDriver === 0) {
    return i18n.t('INCLUDED')
  }
  return `${hidePlus ? '' : '+ '}${gimmekeysHelper.formatNumber(additionalDriver * days)} ${i18n.t('CURRENCY')} (${gimmekeysHelper.formatNumber(additionalDriver)} ${i18n.t('CAR_CURRENCY')})`
}

/**
 * Get all booking statuses.
 *
 * @returns {gimmekeysTypes.StatusFilterItem[]}
 */
export const getBookingStatuses = (): gimmekeysTypes.StatusFilterItem[] => [
  {
    value: gimmekeysTypes.BookingStatus.Void,
    label: i18n.t('BOOKING_STATUS_VOID')
  },
  {
    value: gimmekeysTypes.BookingStatus.Pending,
    label: i18n.t('BOOKING_STATUS_PENDING'),
  },
  {
    value: gimmekeysTypes.BookingStatus.Deposit,
    label: i18n.t('BOOKING_STATUS_DEPOSIT'),
  },
  {
    value: gimmekeysTypes.BookingStatus.Paid,
    label: i18n.t('BOOKING_STATUS_PAID')
  },
  {
    value: gimmekeysTypes.BookingStatus.Reserved,
    label: i18n.t('BOOKING_STATUS_RESERVED'),
  },
  {
    value: gimmekeysTypes.BookingStatus.Cancelled,
    label: i18n.t('BOOKING_STATUS_CANCELLED'),
  },
]

/**
 * Get booking status label.
 *
 * @param {string} status
 * @returns {string}
 */
export const getBookingStatus = (status: gimmekeysTypes.BookingStatus) => {
  switch (status) {
    case gimmekeysTypes.BookingStatus.Void:
      return i18n.t('BOOKING_STATUS_VOID')

    case gimmekeysTypes.BookingStatus.Pending:
      return i18n.t('BOOKING_STATUS_PENDING')

    case gimmekeysTypes.BookingStatus.Deposit:
      return i18n.t('BOOKING_STATUS_DEPOSIT')

    case gimmekeysTypes.BookingStatus.Paid:
      return i18n.t('BOOKING_STATUS_PAID')

    case gimmekeysTypes.BookingStatus.Reserved:
      return i18n.t('BOOKING_STATUS_RESERVED')

    case gimmekeysTypes.BookingStatus.Cancelled:
      return i18n.t('BOOKING_STATUS_CANCELLED')

    default:
      return ''
  }
}

/**
 * Get bithdate error message.
 *
 * @param {number} minimumAge
 * @returns {string}
 */
export const getBirthDateError = (minimumAge: number) =>
  `${i18n.t('BIRTH_DATE_NOT_VALID_PART1')} ${minimumAge} ${i18n.t('BIRTH_DATE_NOT_VALID_PART2')} `

/**
 * Navigate to screen.
 *
 * @param {RouteProp<StackParams, keyof StackParams>} route
 * @param {NativeStackNavigationProp<StackParams, keyof StackParams>} navigation
 */
export const navigate = (
  route: RouteProp<StackParams, keyof StackParams>,
  navigation: NativeStackNavigationProp<StackParams, keyof StackParams>
): void => {
  switch (route.name) {
    case 'About':
    case 'Bookings':
    case 'ChangePassword':
    case 'Contact':
    case 'ForgotPassword':
    case 'Home':
    case 'Notifications':
    case 'Settings':
    case 'SignIn':
    case 'SignUp':
    case 'ToS':
      navigation.navigate(route.name, { d: new Date().getTime() })
      break
    case 'Booking':
      navigation.navigate(
        route.name,
        {
          d: new Date().getTime(),
          id: (route.params && 'id' in route.params && route.params.id as string) || '',
        }
      )
      break
    case 'Cars':
      navigation.navigate(
        route.name,
        {
          d: new Date().getTime(),
          pickupLocation: (route.params && 'pickupLocation' in route.params && route.params.pickupLocation as string) || '',
          dropOffLocation: (route.params && 'dropOffLocation' in route.params && route.params.dropOffLocation as string) || '',
          from: (route.params && 'from' in route.params && route.params.from as number) || 0,
          to: (route.params && 'to' in route.params && route.params.to as number) || 0,
        }
      )
      break
    case 'Checkout':
      navigation.navigate(
        route.name,
        {
          d: new Date().getTime(),
          car: (route.params && 'car' in route.params && route.params.car as string) || '',
          pickupLocation: (route.params && 'pickupLocation' in route.params && route.params.pickupLocation as string) || '',
          dropOffLocation: (route.params && 'dropOffLocation' in route.params && route.params.dropOffLocation as string) || '',
          from: (route.params && 'from' in route.params && route.params.from as number) || 0,
          to: (route.params && 'to' in route.params && route.params.to as number) || 0,
        }
      )
      break
    default:
      break
  }
}
