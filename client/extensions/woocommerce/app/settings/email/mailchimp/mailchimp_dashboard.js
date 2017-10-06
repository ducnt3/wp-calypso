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
import FormCheckbox from 'components/forms/form-checkbox';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormLegend from 'components/forms/form-legend';
import FormToggle from 'components/forms/form-toggle';
import FormRadio from 'components/forms/form-radio';
import FormTextInput from 'components/forms/form-text-input';
import Notice from 'components/notice';
import QueryMailChimpSyncStatus from 'woocommerce/state/sites/settings/email/querySyncStatus';
import {
	syncStatus,
	mailchimpSettings,
	isRequestingSettings } from 'woocommerce/state/sites/settings/email/selectors';
import { submitMailchimpNewsletterSettings } from 'woocommerce/state/sites/settings/email/actions.js';
import { isSubmittingNewsletterSetting } from 'woocommerce/state/sites/settings/email/selectors';

const SyncTab = localize( ( { translate, syncState, resync } ) => {
	const { account_name, store_syncing, product_count, mailchimp_total_products,
		mailchimp_total_orders, order_count } = syncState;
	const hasProductInfo = ( product_count !== undefined ) && ( mailchimp_total_products !== undefined );
	const products = hasProductInfo ? ( product_count + '/' + mailchimp_total_products ) : 'X/X';
	const hasOrdersInfo = ( order_count !== undefined ) && ( mailchimp_total_orders !== undefined );
	const orders = hasOrdersInfo ? ( order_count + '/' + mailchimp_total_orders ) : 'X/X';

	const synced = () => (
		<Notice
			status="is-success"
			isCompact={ true }
			showDismiss={ false }
			text={ syncState.mailchimp_list_name + ' ' + translate( 'list synced' ) }>
		</Notice>
	);

	const syncing = () => (
		<Notice
			status="is-warning"
			isCompact={ true }
			showDismiss={ false }
			text={ syncState.mailchimp_list_name + ' ' + translate( 'list is being synced' ) }>
		</Notice>
	);

	return (
		<div>
			<div>
				<span className="mailchimp__account-info">{ translate( 'MailChimp account:' ) }</span>
				<span>{ account_name }</span>
			</div>
			<span>{ store_syncing ? syncing() : synced() }</span>
			<a onClick={ resync }>Resync</a>
			<div>
				<span className="mailchimp__account-info" >{ translate( 'Products:' ) }</span>
				<span>{ products }</span>
				<span className="mailchimp__account-info" >{ ' ' + translate( 'Orders:' ) }</span>
				<span>{ orders || '' }</span>
			</div>
		</div>
	);
} );

const Settings = localize( ( { translate, settings, oldCheckbox, isRequesting, onChange } ) => {
	const onRadioChange = ( e ) => {
		onChange( { mailchimp_checkbox_defaults: e.target.value } );
	};

	const onNewslatterLabelChange = ( e ) => {
		onChange( { newsletter_label: e.target.value } );
	};

	const onToggle = ( e ) => {
		const visibleOption = oldCheckbox !== 'hide' ? oldCheckbox : 'check';
		onChange( { mailchimp_checkbox_defaults: e ? visibleOption : 'hide' } );
	};

	const checkbox = settings.mailchimp_checkbox_defaults;
	const toggle = checkbox === 'check' || checkbox === 'uncheck';
	return (
		<div className="mailchimp__dashboard-settings">
			<span className="mailchimp__dashboard-settings-form">
				<FormFieldset>
					<FormLegend>{ translate( 'Newsletter subscriptions' ) }</FormLegend>
					<FormLabel>
						<FormToggle
							checked={ toggle }
							onChange={ onToggle }
							id="show-subscribe-message"
						/>
						<span>{ translate( 'Show a subscribe message to ustomer at checkout' ) }</span>
					</FormLabel>
					<FormLabel>
						<FormRadio
							disabled={ ! toggle }
							value="check"
							checked={ 'check' === checkbox }
							onChange={ onRadioChange }
						/>
						<span>{ translate( 'Subscribe message is checked by default' ) }</span>
					</FormLabel>
					<FormLabel>
						<FormRadio
							disabled={ ! toggle }
							value="uncheck"
							checked={ 'uncheck' === checkbox }
							onChange={ onRadioChange }
						/>
						<span>{ translate( 'Subscribe message is unchecked by default' ) }</span>
					</FormLabel>
					<FormLabel>
						{ translate( 'Subscribe message is unchecked by default' ) }
					</FormLabel>
					<FormTextInput
						name={ 'newsletter_label' }
						onChange={ onNewslatterLabelChange }
						value={ settings.newsletter_label }
					/>
				</FormFieldset>
			</span>
			<span className="mailchimp__dashboard-settings-preview">
				<div>{ translate( 'PREVIEW' ) }</div>
				<div className="mailchimp__dashboard-settings-preview-view">
					{toggle && <FormLabel>
							<FormCheckbox checked={ checkbox === 'check' } />
							<span>{ settings.newsletter_label }</span>
						</FormLabel>}
				</div>
			</span>
		</div>
	);
} );

class MailChimpDashboard extends React.Component {

	constructor( props ) {
		super( props );
		// make this react to the real phase the execution is.
		this.state = {
			syncStatus: null,
			settings: props.settings
		};
	}

	onSettingsChange = ( change ) => {
		this.setState( { settings: Object.assign( {}, this.state.settings, change ) } );
	}

	onSave = () => {
		const { submitMailchimpNewsletterSettings: submit, siteId } = this.props;
		const settings = this.state.settings;
		const message = {
			mailchimp_list: settings.mailchimp_list,
			newsletter_label: settings.newsletter_label,
			mailchimp_auto_subscribe: settings.mailchimp_auto_subscribe,
			mailchimp_checkbox_defaults: settings.mailchimp_checkbox_defaults,
			mailchimp_checkbox_action: settings.mailchimp_checkbox_action,
		};
		submit( siteId, message );
	}

	render() {
		const { translate } = this.props;
		const slogan = translate( 'Allow customers to subscribe to your MailChimp email list' );

		return (
			<div>
				<QueryMailChimpSyncStatus siteId={ this.props.siteId } />
				<Card className="mailchimp__dashboard" >
					<div className="mailchimp__dashboard-first-section" >
						<span className="mailchimp__dashboard-title-and-slogan">
							<div className="mailchimp__dashboard-title">Mailchimp</div>
							<div>{ slogan }</div>
						</span>
						<span className="mailchimp__dashboard-sync-status" >
							<SyncTab syncState={ this.props.syncStatusData } />
						</span>
					</div>
					<div className="mailchimp__dashboard-second-section" >
						<Settings
							settings={ this.state.settings }
							isRequesting={ this.props.isRequestingSettings }
							onChange={ this.onSettingsChange }
							oldCheckbox={ this.props.settings.mailchimp_checkbox_defaults } />
					</div>
					<Button className="mailchimp__getting-started-button" onClick={ this.props.onClick }>
						Start setup wizard.
					</Button>
					<Button
						primary
						onClick={ this.onSave }
						busy={ this.props.isSubmittingNewsletterSetting }
						disabled={ this.props.isSubmittingNewsletterSetting }>
						{ translate( 'Save' ) }
					</Button>
				</Card>
			</div>
		);
	}
}

export default connect(
	( state, { siteId } ) => ( {
		siteId,
		syncStatusData: syncStatus( state, siteId ),
		isRequestingSettings: isRequestingSettings( state, siteId ),
		isSubmittingNewsletterSetting: isSubmittingNewsletterSetting( state, siteId ),
		settings: mailchimpSettings( state, siteId ),
	} ),
	{
		submitMailchimpNewsletterSettings
	}
)( localize( MailChimpDashboard ) );