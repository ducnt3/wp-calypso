/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { filter, matches } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import MailChimpGettingStarted from './getting-started';
import MailChimpSetup from './setup-mailchimp';
import QueryJetpackPlugins from 'components/data/query-jetpack-plugins';
import QueryMailChimpSettings from 'woocommerce/state/sites/settings/email/querySettings';
import { isRequestingForSites } from 'state/plugins/installed/selectors';
import { getPlugins } from 'state/plugins/installed/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';
import { localize } from 'i18n-calypso';
import { mailchimpSettings, isRequestingSettings } from 'woocommerce/state/sites/settings/email/selectors';
import Card from 'components/card';

class MailChimp extends React.Component {

	constructor( props ) {
		super( props );
		this.state = {
			activeTab: props.settings.active_tab ? props.settings.active_tab : 'api_key',
			setupWizardStarted: false
		};
	}

	onClick = () => {
		console.log( 'click' );
	}

	startWizard = () => {
		this.setState( { setupWizardStarted: true } )
		console.log( 'start wizard' );
	}

	closeWizard = () => {
		this.setState( { setupWizardStarted: true } );
		console.log( 'close wizard' );
	}

	render() {
		const { siteId, isRequestingMailChimpSettings } = this.props;
		const className = classNames( 'mailchimp__main', { mailchimp__loading: isRequestingMailChimpSettings } );
		const { activeTab, setupWizardStarted } = this.state;
		console.log( this.props.sitePlugins );
		return (
			<div className={ className }>
				<QueryJetpackPlugins siteIds={ [ siteId ] } />
				<QueryMailChimpSettings siteId={ siteId } />
				{ ( activeTab === 'api_key' ) && <MailChimpGettingStarted
						isPlaceholder={ isRequestingMailChimpSettings }
						onClick={ this.startWizard } /> }
				{ setupWizardStarted && <MailChimpSetup onClose={ this.closeWizard } /> }
				<Card>
					{ 'Version: ' + this.props.version + ' ' + JSON.stringify( this.props.settings ) }
				</Card>
			</div>
		);
	}
}

const MailChimpConnected = connect(
	( state ) => {
		const mailChimpId = 'mc-woocommerce/mailchimp-woocommerce';
		const siteId = getSelectedSiteId( state );
		const isRequestingPlugins = isRequestingForSites( state, [ siteId ] );
		const isRequestingMailChimpSettings = isRequestingSettings( state, siteId );
		const sitePlugins = getPlugins( state, [ siteId ] );
		const mailChimp = filter( sitePlugins, matches( { id: mailChimpId } ) );
		const hasMailChimp = !! mailChimp.length;
		const version = hasMailChimp ? mailChimp[ 0 ].version : '0';
		return {
			siteId,
			sitePlugins,
			hasMailChimp,
			version,
			isRequestingPlugins,
			isRequestingMailChimpSettings,
			settings: mailchimpSettings( state, siteId )
		};
	}
)( MailChimp );

export default localize( MailChimpConnected );
