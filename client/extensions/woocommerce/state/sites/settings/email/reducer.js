/**
 * External dependencies
 */
import { keys } from 'lodash';

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
	WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST,
	WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_FAILURE,
	WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST,
	WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_FAILURE,
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
			const data = { mailchimp_lists: action.lists };
			const listKeys = keys( action.lists );
			if ( ! state.mailchimp_list && ( listKeys.length > 0 ) ) {
				// Just pick first that will be shown to the user in the dropdown
				// We are setting mailchimp_list just in case user likes it and clicks
				// Continue without actually sellecting something.
				data.mailchimp_list = listKeys[ 0 ];
			}
			return Object.assign( {}, state, data );
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

function syncStatus( state = {}, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_SUCCESS:
			return Object.assign( {}, action.syncStatus );
	}

	return state;
}

function syncStatusRequest( state = false, { type } ) {
	switch ( type ) {
		case WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST:
		case WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_FAILURE:
			return WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST === type;
	}

	return state;
}

function syncStatusRequestError( state = false, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_FAILURE:
			const error = WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_FAILURE === action.type
				? action.error : false;
			return error;
	}

	return state;
}

function resyncRequest( state = false, { type } ) {
	switch ( type ) {
		case WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST:
		case WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_FAILURE:
			return WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST === type;
	}

	return state;
}

function resyncRequestError( state = false, action ) {
	switch ( action.type ) {
		case WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_SUCCESS:
		case WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_FAILURE:
			const error = WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_FAILURE === action.type
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
	syncStatus,
	syncStatusRequest,
	syncStatusRequestError,
	resyncRequest,
	resyncRequestError,
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
