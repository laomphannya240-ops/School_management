import {useContext} from 'react'
import {PreferencesContext} from '../context/PreferencesContextObject.js'

export function usePreferences(){return useContext(PreferencesContext)}
