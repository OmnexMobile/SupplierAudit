import { Platform } from 'react-native'

export const ANDROID_15_API_LEVEL = 35

const androidVersion =
  Platform.OS === 'android' ? parseInt(Platform.Version, 10) : Number.NaN

export const isAndroid15OrAbove =
  Platform.OS === 'android' && !Number.isNaN(androidVersion) && androidVersion >= ANDROID_15_API_LEVEL

export const android15HeaderPadding = isAndroid15OrAbove ? 8 : 0
export const android15FooterPadding = isAndroid15OrAbove ? 8 : 0
export const android15FooterOffset = isAndroid15OrAbove ? 8 : 0

export default {
  android15HeaderPadding,
  android15FooterPadding,
  android15FooterOffset,
  isAndroid15OrAbove,
}
