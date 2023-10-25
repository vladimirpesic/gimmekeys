import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as gimmekeysTypes from '../miscellaneous/gimmekeysTypes'

import * as Helper from '../common/Helper'

interface BookingStatusProps {
  style: object
  status: gimmekeysTypes.BookingStatus
}

function BookingStatus({
  style,
  status
}: BookingStatusProps) {
  return (
    <View
      style={{
        ...styles.container,
        ...style,
        backgroundColor:
          status === gimmekeysTypes.BookingStatus.Void
            ? '#999'
            : status === gimmekeysTypes.BookingStatus.Pending
              ? '#3b82f6'
              : status === gimmekeysTypes.BookingStatus.Deposit
                ? '#22bba7'
                : status === gimmekeysTypes.BookingStatus.Paid
                  ? '#77bc23'
                  : status === gimmekeysTypes.BookingStatus.Reserved
                    ? '#188ace'
                    : status === gimmekeysTypes.BookingStatus.Cancelled
                      ? '#bc2143'
                      : 'transparent',
      }}
    >
      <Text style={styles.text}>{Helper.getBookingStatus(status)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
  },
})

export default BookingStatus
