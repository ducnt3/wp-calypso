/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { localize } from 'i18n-calypso';
import Button from 'components/button';
import Card from 'components/card';

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
			<Card>
				<div>Dashboard view</div>
				<Button className="mailchimp__getting-started-button" onClick={ this.props.onClick }>
					Start setup wizard.
				</Button>
			</Card>
		);
	}
}

export default localize( MailChimpDashboard );
