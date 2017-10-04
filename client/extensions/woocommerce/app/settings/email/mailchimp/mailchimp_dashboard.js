/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { localize } from 'i18n-calypso';
import Button from 'components/button';
import Card from 'components/card';
import QueryMailChimpSyncStatus from 'woocommerce/state/sites/settings/email/querySyncStatus';
import { syncStatus } from 'woocommerce/state/sites/settings/email/selectors';

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
			<div>
				<QueryMailChimpSyncStatus siteId={ this.props.siteId } />
				<Card>
					<div>Dashboard view</div>
					<Button className="mailchimp__getting-started-button" onClick={ this.props.onClick }>
						Start setup wizard.
					</Button>
					{ JSON.stringify( this.props.syncStatusData, null, 2 ) }
				</Card>
			</div>
		);
	}
}

export default connect(
	( state, { siteId } ) => ( {
		siteId,
		syncStatusData: syncStatus( state, siteId ),
	} )
)( localize( MailChimpDashboard ) );
