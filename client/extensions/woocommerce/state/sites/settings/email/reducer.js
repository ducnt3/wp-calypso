/**
 * Internal dependencies
 */
import { combineReducers } from 'state/utils';
import {
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_SUCCESS,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_FAILURE,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE
} from 'woocommerce/state/action-types';

function settings( state = {}, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_SUCCESS:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS:
			return Object.assign( {}, state, action.settings );
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

function apiKeySubmit( state = false, { type } ) {
	switch ( type ) {
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_SUCCESS:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_FAILURE:
			return WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT === type;
	}

	return state;
}

function apiKeyCorrect( state = true, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_SUCCESS:
			return !! action.settings.mailchimp_account_info_id;
	}

	return state;
}

function apiKeySubbmitError( state = false, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_SUCCESS:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_FAILURE:
			const error = WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_FAILURE === action.type
				? action.error : false;
			return error;
	}

	return state;
}

function storeInfoSubmit( state = false, { type } ) {
	switch ( type ) {
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE:
			return WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT === type;
	}

	return state;
}

function storeInfoSubmitError( state = false, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS:
		case WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE:
			const error = WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE === action.type
				? action.error : false;
			return error;
	}

	return state;
}

export default combineReducers( {
	settings,
	settingsRequest,
	settingsRequestError,
	apiKeySubmit,
	apiKeySubbmitError,
	apiKeyCorrect,
	storeInfoSubmit,
	storeInfoSubmitError
} );
