/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * @param {Object} state Whole Redux state tree
 * @param {Number} [siteId] Site ID to check. If not provided, the Site ID selected in the UI will be used
 * @return {Object} Object containing payment methods
 */
export const isRequestingSettings = ( state, siteId ) => {
	return false;
};

export const mailchimpSettings = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email' ];

	return get( state, path, {} );
};
