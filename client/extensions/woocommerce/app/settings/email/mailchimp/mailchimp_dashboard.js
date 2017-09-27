/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { localize } from 'i18n-calypso';

// Get reed of this, this should not be visible to the user - he does not need this.

class MailChimpDashboard extends React.Component {

	constructor( props ) {
		super( props );
		// make this react to the real phase the execution is.
		this.state = {
			syncStatus: null
		};
	}

	render() {
		return (
				<div>Dashboard view</div>
		);
	}
}

export default localize( MailChimpDashboard );
