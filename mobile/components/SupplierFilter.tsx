import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import * as gimmekeysTypes from '../miscellaneous/gimmekeysTypes'
import * as gimmekeysHelper from '../miscellaneous/gimmekeysHelper'

import * as Helper from '../common/Helper'
import * as Env from '../config/env.config'
import i18n from '../lang/i18n'
import * as SupplierService from '../services/SupplierService'
import Link from './Link'
import Switch from './Switch'
import Accordion from './Accordion'

interface SupplierFilterProps {
  visible?: boolean
  style?: object
  onLoad?: (checkedSuppliers: string[]) => void
  onChange?: (checkedSuppliers: string[]) => void
}

function SupplierFilter({
  visible,
  style,
  onLoad,
  onChange
}: SupplierFilterProps) {
  const [suppliers, setSuppliers] = useState<gimmekeysTypes.User[]>([])
  const [checkedSuppliers, setCheckedSuppliers] = useState<string[]>([])
  const [allChecked, setAllChecked] = useState(true)

  const init = async () => {
    try {
      const allSuppliers = await SupplierService.getAllSuppliers()
      if (allSuppliers) {
        const _suppliers = allSuppliers.map((supplier: gimmekeysTypes.User) => ({
          ...supplier,
          checked: true,
        }))
        const _checkedSuppliers = gimmekeysHelper.flattenCompanies(_suppliers)
        setSuppliers(_suppliers)
        setCheckedSuppliers(_checkedSuppliers)
        if (onLoad) {
          onLoad(_checkedSuppliers)
        }
      } else {
        Helper.error()
      }
    } catch (err) {
      Helper.error(err)
    }
  }

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    visible && suppliers.length > 1 && (
      <View style={{ ...styles.container, ...style }}>
        <Accordion style={styles.accordion} title={i18n.t('SUPPLIER')}>
          <View style={styles.companies}>
            {suppliers.map((supplier) => (
              supplier._id && typeof supplier.checked !== 'undefined'
              && (
                <View key={supplier._id} style={styles.company}>
                  <Switch
                    value={supplier.checked}
                    onValueChange={(checked) => {
                      if (checked) {
                        supplier.checked = true
                        setSuppliers(gimmekeysHelper.clone(suppliers))
                        checkedSuppliers.push(supplier._id as string)

                        if (checkedSuppliers.length === suppliers.length) {
                          setAllChecked(true)
                        }
                      } else {
                        supplier.checked = false
                        setSuppliers(gimmekeysHelper.clone(suppliers))
                        const index = checkedSuppliers.indexOf(supplier._id as string)
                        checkedSuppliers.splice(index, 1)

                        if (checkedSuppliers.length === 0) {
                          setAllChecked(false)
                        }
                      }

                      if (onChange) {
                        onChange(gimmekeysHelper.clone(checkedSuppliers))
                      }
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={{
                        uri: gimmekeysHelper.joinURL(Env.CDN_USERS, supplier.avatar),
                      }}
                    />
                  </Switch>
                </View>
              )
            ))}
          </View>
          <Link
            style={styles.link}
            textStyle={styles.linkText}
            label={allChecked ? i18n.t('UNCHECK_ALL') : i18n.t('CHECK_ALL')}
            onPress={() => {
              let _checkedSuppliers: string[] = []
              if (allChecked) {
                suppliers.forEach((supplier) => {
                  supplier.checked = false
                })
                setAllChecked(false)
                setSuppliers(gimmekeysHelper.clone(suppliers))
                setCheckedSuppliers(_checkedSuppliers)
              } else {
                suppliers.forEach((supplier) => {
                  supplier.checked = true
                })
                setAllChecked(true)
                setSuppliers(gimmekeysHelper.clone(suppliers))
                _checkedSuppliers = gimmekeysHelper.clone(gimmekeysHelper.flattenCompanies(suppliers))
                setCheckedSuppliers(_checkedSuppliers)

                if (onChange) {
                  onChange(_checkedSuppliers)
                }
              }
            }}
          />
        </Accordion>
      </View>
    )
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  accordion: {
    width: '100%',
    maxWidth: 480,
  },
  companies: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: 300,
  },
  company: {
    width: '50%',
    marginBottom: 7,
  },
  image: {
    width: Env.COMPANY_IMAGE_WIDTH,
    height: Env.COMPANY_IMAGE_HEIGHT,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 12,
  },
})

export default SupplierFilter
