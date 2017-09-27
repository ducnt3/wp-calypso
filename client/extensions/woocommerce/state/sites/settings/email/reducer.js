/**
 * Internal dependencies
 */
import { combineReducers } from 'state/utils';
import {
	WOOCOMMERCE_MAILCHIMP_CAMPAIGN_DEFAULTS_SUBMIT_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST,
	WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_FAILURE,
	WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT,
	WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_FAILURE,
	WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST,
	WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_FAILURE,
	WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT,
	WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE,
	WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT,
	WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_FAILURE
} from 'woocommerce/state/action-types';

function settings( state = {}, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_FAILURE:
		case WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_CAMPAIGN_DEFAULTS_SUBMIT_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_SUCCESS:
			return Object.assign( {}, state, action.settings );
		case WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_SUCCESS:
			return Object.assign( {}, state, { mailchimp_lists: action.lists } );
	}

	return state;
}

function settingsRequest( state = false, { type } ) {
	switch ( type ) {
		case WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST:
		case WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_FAILURE:
			return WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST === type;
	}

	return state;
}

function settingsRequestError( state = false, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_FAILURE:
			const error = WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_FAILURE === action.type
				? action.error : false;
			return error;
	}

	return state;
}

function apiKeySubmit( state = false, { type } ) {
	switch ( type ) {
		case WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT:
		case WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_FAILURE:
			return WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT === type;
	}

	return state;
}

function apiKeyCorrect( state = true, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_SUCCESS:
			return !! action.settings.mailchimp_account_info_id;
	}

	return state;
}

function apiKeySubbmitError( state = false, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_FAILURE:
			const error = WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_FAILURE === action.type
				? action.error : false;
			return error;
	}

	return state;
}

function storeInfoSubmit( state = false, { type } ) {
	switch ( type ) {
		case WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT:
		case WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE:
			return WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT === type;
	}

	return state;
}

function storeInfoSubmitError( state = false, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE:
			const error = WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE === action.type
				? action.error : false;
			return error;
	}

	return state;
}

function listsRequest( state = false, { type } ) {
	switch ( type ) {
		case WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST:
		case WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_FAILURE:
			return WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST === type;
	}

	return state;
}

function listsRequestError( state = false, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_FAILURE:
			const error = WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_FAILURE === action.type
				? action.error : false;
			return error;
	}

	return state;
}

function newsletterSettingsSubmit( state = false, { type } ) {
	switch ( type ) {
		case WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT:
		case WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_FAILURE:
			return WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT === type;
	}

	return state;
}

function newsletterSettingsSubmitError( state = false, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_FAILURE:
			const error = WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_FAILURE === action.type
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
	storeInfoSubmitError,
	listsRequest,
	listsRequestError,
	newsletterSettingsSubmit,
	newsletterSettingsSubmitError
} );
