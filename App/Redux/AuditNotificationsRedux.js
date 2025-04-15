import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    updateAuditCount: ['auditCount'],
    updateDynamicAuditCount: ['data'],
    clearNotifications:null,
})

export const TemperatureTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    auditCount: 0,
    dynamicAuditCount:0
})

/* ------------- Reducers ------------- */

export const updateAuditCount = (state, action) => {
    return state.merge({ auditCount: action.auditCount })
}

export const updateDynamicAuditCount = (state, action) => {
    return state.merge({ dynamicAuditCount: action.data })
}

export const clearNotifications = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_AUDIT_COUNT]: updateAuditCount,
  [Types.UPDATE_DYNAMIC_AUDIT_COUNT]: updateDynamicAuditCount,
  [Types.CLEAR_NOTIFICATIONS]: clearNotifications
})
