/**
 * External dependencies
 */
import React from 'react';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import { localize } from 'i18n-calypso';

class MailChimpGettingStarted extends React.Component {

	render() {
		const { translate } = this.props;
		const infoText = translate( 'Allow your customers subscribe to your MailChimp email list' );

		const illustration =
			<img
				src={ '/calypso/images/illustrations/illustration-500.svg' }
				width={ 300 }
				className="mailchimp__getting-started-illustration"
			/>;

		const connect = translate( 'Connect with your customers through MailChimp and:' );
		const allow = translate( 'Allow customers to subscribe to your Email list' );
		const send = translate( 'Send abandon cart emails' );
		const create = translate( 'Create purchase-based segments for targeted campaigns' );

		const list = [ allow, send, create ];

		return (
			<div>
				<Card className="mailchimp__getting-started-title">
					<div className="mailchimp__getting-started-title-text">MailChimp</div>
					<div className="mailchimp__getting-started-subtitle-text">{ infoText }</div>
				</Card>
				<Card className="mailchimp__getting-started-content">
					<span>{ illustration }</span>
					<span>
						<div className="mailchimp__getting-started-list-header">
							{ connect }
						</div>
						<ul className="mailchimp__getting-started-list">
							{ list.map( ( item, key ) =>
								<li key={ key }>
									<Gridicon icon="checkmark" size={ 18 } />
									{ item }
								</li>
							) }
						</ul>
					</span>
				</Card>
			</div>
		);
	}
}

export default localize( MailChimpGettingStarted );
