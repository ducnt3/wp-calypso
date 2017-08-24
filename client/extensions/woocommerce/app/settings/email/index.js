/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import MailChimp from './mailchimp';
import ActionHeader from 'woocommerce/components/action-header';
import Button from 'components/button';
import Card from 'components/card';
import SettingsNavigation from '../navigation';
import { getLink } from 'woocommerce/lib/nav-utils';
import { getSelectedSiteId } from 'state/ui/selectors';
import QueryMailChimpSettings from 'woocommerce/state/sites/settings/email/querySettings';
import { mailchimpSettings } from 'woocommerce/state/sites/settings/email/selectors';

const Email = ( { isSaving, site, siteId, translate, className, settings } ) => {
	const breadcrumbs = [
		( <a href={ getLink( '/store/:site/', site ) }>{ translate( 'Settings' ) }</a> ),
		( <span>{ translate( 'Email' ) }</span> ),
	];

	const settingsText = JSON.stringify( settings );
	const	onSave = () => { };

	return (
		<Main className={ classNames( 'email', className ) }>
			<ActionHeader breadcrumbs={ breadcrumbs }>
				<Button
					primary
					onClick={ onSave }
					busy={ isSaving }
					disabled={ isSaving }>
					{ translate( 'Save' ) }
				</Button>
			</ActionHeader>
			<SettingsNavigation activeSection="email" />
			<MailChimp />
			<QueryMailChimpSettings siteId={ siteId } />
			<Card>
				{ settingsText }
			</Card>
		</Main>
	);
};

Email.propTypes = {
	className: PropTypes.string
};

const EmailConnected = connect(
	( state ) => {
		const siteId = getSelectedSiteId( state );

		return {
			siteId,
			settings: mailchimpSettings( state, siteId )
		};
	}
)( Email );

export default localize( EmailConnected );
