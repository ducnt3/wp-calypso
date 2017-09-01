/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import { localize } from 'i18n-calypso';
import Dialog from 'components/dialog';

class MailChimpSetup extends React.Component {

	constructor( props ) {
		super( props );
		this.state = {
			step: 'key_input'
		};
	}

	onClose = () => {
		this.props.onClose();
	}

	next = () => {
		console.log( 'next' );
	}

	renderStep = () => {
		const { step } = this.state;
		if ( step === 'key_input' ) {
			return <div></div>;
		}

		return <div></div>;
	}

	render() {
		const { translate } = this.props;
		const buttons = [
			{ action: 'next', label: translate( 'Next' ), onClick: this.next, isPrimary: true },
			{ action: 'cancel', label: translate( 'Cancel' ) },
		];

		return (
			<Dialog
				isVisible={ true }
				buttons={ buttons }
				onClose={ this.onClose }>
				<Card> { this.state.step } </Card>
				{ this.renderStep() }
			</Dialog>
		);
	}
}

export default localize( MailChimpSetup );
