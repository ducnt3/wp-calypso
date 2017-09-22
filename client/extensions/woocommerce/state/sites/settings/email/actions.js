/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import request from '../../request';
import {
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_SUCCESS,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_FAILURE,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE,
} from 'woocommerce/state/action-types';

const mailchimpSettingsRequest = ( siteId ) => ( {
	type: WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST,
	siteId
} );

const mailchimpSettingsRequestSuccess = ( siteId, settings ) => ( {
	type: WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS,
	siteId,
	settings
} );

const mailchimpSettingsRequestFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE,
	siteId,
	error
} );

const mailchimpApiKeySubmit = ( siteId ) => ( {
	type: WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT,
	siteId
} );

const mailchimpApiKeySubmitSuccess = ( siteId, settings ) => ( {
	type: WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_SUCCESS,
	siteId,
	settings
} );

const mailchimpApiKeySubmitFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_SETTINGS_MAILCHIMP_API_KEY_SUBMIT_FAILURE,
	siteId,
	error
} );

const mailchimpStoreInfoSubmit = ( siteId ) => ( {
	type: WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT,
	siteId
} );

const mailchimpStoreInfoSubmitSuccess = ( siteId, settings ) => ( {
	type: WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS,
	siteId,
	settings
} );

const mailchimpStoreInfoSubbmitFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_SETTINGS_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE,
	siteId,
	error
} );

export const requestSettings = ( siteId ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}

	dispatch( mailchimpSettingsRequest( siteId ) );

	return request( siteId ).get( 'mailchimp' )
		.then( settings => {
			dispatch( mailchimpSettingsRequestSuccess( siteId, settings ) );
		} )
		.catch( error => {
			dispatch( mailchimpSettingsRequestFailure( siteId, error ) );
		} );
};

export const submitMailChimpApiKey = ( siteId, apiKey ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}

	dispatch( mailchimpApiKeySubmit( siteId ) );

	return request( siteId ).put( 'mailchimp/api_key', { mailchimp_api_key: apiKey } )
		.then( settings => {
			console.log( 'success' );
			console.log( settings );
			dispatch( mailchimpApiKeySubmitSuccess( siteId, settings ) );
		} )
		.catch( error => {
			console.log( 'error' );
			console.log( error );
			dispatch( mailchimpApiKeySubmitFailure( siteId, error ) );
		} );
};

export const submitMailchimpStoreInfo = ( siteId, storeInfo ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}

	dispatch( mailchimpStoreInfoSubmit( siteId ) );

	return request( siteId ).put( 'mailchimp/store_info', storeInfo )
		.then( settings => {
			console.log( 'success' );
			console.log( settings );
			dispatch( mailchimpStoreInfoSubmitSuccess( siteId, settings ) );
		} )
		.catch( error => {
			console.log( 'error' );
			console.log( error );
			dispatch( mailchimpStoreInfoSubbmitFailure( siteId, error ) );
		} );
};
