/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import request from '../request';
import { setError } from '../status/wc-api/actions';
import {
	WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST,
} from 'woocommerce/state/action-types';

export const requestSettings = ( siteId ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}

	const getAction = {
		type: WOOCOMMERCE_SETTINGS_MAILCHIMP_REQUEST,
		siteId,
	};

	dispatch( getAction );

	return request( siteId ).get( 'payment_gateways' )
		.then( ( data ) => {
			dispatch( fetchPaymentMethodsSuccess( siteId, data ) );
		} )
		.catch( err => {
			dispatch( setError( siteId, getAction, err ) );
		} );
};
