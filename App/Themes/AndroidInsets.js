import { Platform, StatusBar } from 'react-native'
import { initialWindowMetrics } from 'react-native-safe-area-context'

export const ANDROID_15_API_LEVEL = 35

const androidVersion =
  Platform.OS === 'android' ? parseInt(Platform.Version, 10) : Number.NaN

export const isAndroid15OrAbove =
  Platform.OS === 'android' && !Number.isNaN(androidVersion) && androidVersion >= ANDROID_15_API_LEVEL

const safeAreaInsets = initialWindowMetrics?.insets || { top: 0, bottom: 0 }
const baseStatusHeight = StatusBar?.currentHeight || 0

const DEFAULT_EXTRA_PADDING = 20

const topInsetCandidate = Math.max(safeAreaInsets.top, baseStatusHeight)
const bottomInsetCandidate = safeAreaInsets.bottom

const computedHeaderExtra = Math.max(DEFAULT_EXTRA_PADDING, topInsetCandidate) - 5
const computedFooterPadding = Math.max(DEFAULT_EXTRA_PADDING, bottomInsetCandidate)

export const android15HeaderPadding = isAndroid15OrAbove
  ? Math.max(0, computedHeaderExtra)
  : 0
export const android15FooterPadding = isAndroid15OrAbove
  ? computedFooterPadding
  : 0
export const android15FooterOffset = isAndroid15OrAbove
  ? bottomInsetCandidate + DEFAULT_EXTRA_PADDING
  : 0

export default {
  android15HeaderPadding,
  android15FooterPadding,
  android15FooterOffset,
  isAndroid15OrAbove,
}
