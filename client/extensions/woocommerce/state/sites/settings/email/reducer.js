/**
 * Internal dependencies
 */
import { createReducer } from 'state/utils';
import {
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS,
} from 'woocommerce/state/action-types';

export default createReducer( null, {
	[ WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS ]: ( state, settings ) => {
		if ( state ) {
			return state;
		}
		return settings;
	},

	[ WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST ]: ( state ) => {
		return state;
	},

} );
