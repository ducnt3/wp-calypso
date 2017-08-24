/**
 * Internal dependencies
 */
import { combineReducers } from 'state/utils';
import {
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE,
} from 'woocommerce/state/action-types';

function settings( state = {}, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE:
			const value = WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS === action.type
				? action.settings : false;
			return value;
	}

	return state;
}

function settingsRequest( state = false, { type } ) {
	switch ( type ) {
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE:
			return WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST === type;
	}

	return state;
}

function settingsRequestError( state = false, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE:
			const error = WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE === action.type
				? action.error : false;
			return error;
	}

	return state;
}

export default combineReducers( {
	settings,
	settingsRequest,
	settingsRequestError,
} );
