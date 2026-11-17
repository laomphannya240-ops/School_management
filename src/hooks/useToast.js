import { useContext } from 'react'
import { ToastContext } from '../context/ToastContextObject.js'

export function useToast() {
  return useContext(ToastContext) || { success() {}, error() {}, info() {} }
}
