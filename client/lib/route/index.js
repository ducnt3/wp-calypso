/**
 * External dependencies
 *
 * @format
 */

import { assign } from 'lodash';

/**
 * Internal dependencies
 */
import path from './path';

module.exports = assign(
	{
		untrailingslashit: require( './untrailingslashit' ),
		trailingslashit: require( './trailingslashit' ),
		redirect: require( './redirect' ),
		normalize: require( './normalize' ),
		addQueryArgs: require( './add-query-args' ),
	},
	path
);
