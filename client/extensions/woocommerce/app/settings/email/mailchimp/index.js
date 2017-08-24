/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import MailChimpGettingStarted from './getting-started';

import { localize } from 'i18n-calypso';

class MailChimp extends React.Component {

	render() {
		return (
			<MailChimpGettingStarted />
		);
	}
}

export default localize( MailChimp );
