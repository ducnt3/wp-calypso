/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import request from '../../request';
import {
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS,
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE
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

const mailchimpSettingsRequestFailure = ( siteId, error ) => ( {
	type: WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_SUCCESS, // WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST_FAILURE,
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
