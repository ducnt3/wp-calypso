/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import { localize } from 'i18n-calypso';
import Dialog from 'components/dialog';
import ProgressIndicator from 'components/wizard/progress-indicator';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormLegend from 'components/forms/form-legend';
import FormRadio from 'components/forms/form-radio';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import FormTextInput from 'components/forms/form-text-input';
import FormInputValidation from 'components/forms/form-input-validation';
import { submitMailChimpApiKey } from 'woocommerce/state/sites/settings/email/actions.js';
import { isSubbmittingApiKey, isApiKeyCorrect } from 'woocommerce/state/sites/settings/email/selectors';
import StoreInfoStep from './setup-steps/store-info.js';

const LOG_INTO_MAILCHIMP_STEP = 'log_into';
const KEY_INPUT_STEP = 'key_input';
const STORE_INFO_STEP = 'store_info';
const CAMPAIGN_DEFAULTS_STEP = 'campaign_defaults';
const NEWSLETTER_SETTINGS_STEP = 'newsletter_settings';

const steps = {
	[ LOG_INTO_MAILCHIMP_STEP ]: { number: 0, nextStep: KEY_INPUT_STEP },
	[ KEY_INPUT_STEP ]: { number: 1, nextStep: STORE_INFO_STEP },
	[ STORE_INFO_STEP ]: { number: 2, nextStep: CAMPAIGN_DEFAULTS_STEP },
};

const LogIntoMailchimp = localize( ( { translate } ) => (
	<Button href="https://login.mailchimp.com/" target="_blank" >
		{ translate( 'Signup or log in to MailChimp' ) }
	</Button>
) );

const KeyInputStep = localize( ( { translate, onChange, apiKey, isKeyCorrect } ) => (
	<FormFieldset className="mailchimp__setup-mailchimp-key-input">
		<FormLabel required={ true }>
			{ translate( 'Mailchimp API Key:' ) }
		</FormLabel>
		<FormTextInput
			name={ 'api_key' }
			isError={ ! isKeyCorrect }
			placeholder={ 'Enter your MailChimp API key' }
			onChange={ onChange }
			value={ apiKey }
		/>
		{ ! isKeyCorrect && <FormInputValidation isError text="Key appears to be invalid" /> }
		<div>
			<span>{ translate( 'To find your Mailchimp API key, go to ' ) }</span>
			<span>{ translate( 'settting > Extras > API keys' ) }</span>
			<div>{ translate( 'From there, grab an existing key or generate a new on for your store' ) } </div>
		</div>
	</FormFieldset>
) );

class MailChimpSetup extends React.Component {

	constructor( props ) {
		super( props );
		// make this react to the real phase the execution is.
		this.state = {
			step: LOG_INTO_MAILCHIMP_STEP,
			api_key_input: this.props.settings.mailchimp_api_key
		};
	}

	componentWillReceiveProps( nextProps ) {
		if ( ( nextProps.settings.active_tab === STORE_INFO_STEP ) &&
			( this.state.step === KEY_INPUT_STEP ) ) {
			this.setState( { step: STORE_INFO_STEP } );
		}
	}

	onClose = () => {
		this.props.onClose();
	}

	next = () => {
		if ( this.state.step === KEY_INPUT_STEP ) {
			this.props.submitMailChimpApiKey( this.props.siteId, this.state.api_key_input );
			return;
		}
		this.setState( { step: steps[ this.state.step ].nextStep } );
	}

	onKeyInputChange = ( e ) => {
		this.setState( { api_key_input: e.target.value } );
	}

	onStoreInfoChange = ( e ) => {
		console.log( 'store info change ' + e.target.name + ' ' + e.target.value );
	}

	renderStep = () => {
		const { step } = this.state;
		if ( step === LOG_INTO_MAILCHIMP_STEP ) {
			return <LogIntoMailchimp />;
		}
		if ( step === KEY_INPUT_STEP ) {
			return <KeyInputStep
				onChange={ this.onKeyInputChange }
				apiKey={ this.state.api_key_input }
				isKeyCorrect={ this.props.isKeyCorrect } />;
		}
		if ( step === STORE_INFO_STEP ) {
			return <StoreInfoStep
				onChange={ this.onStoreInfoChange }
				storeData={ {} }
				validateFields={ false }
			/>;
		}

		return <div></div>;
	}

	render() {
		const { translate } = this.props;
		const isButtonBusy = this.props.isBusy ? 'is-busy' : '';
		const buttons = [
			{ action: 'cancel', label: translate( 'Cancel' ) },
			{ action: 'next', label: translate( 'Next' ), onClick: this.next, isPrimary: true, additionalClassNames: isButtonBusy },
		];

		console.log( this.state.api_key_input );
		return (
			<Dialog
				isVisible={ true }
				buttons={ buttons }
				onClose={ this.onClose }>
				<ProgressIndicator
					stepNumber={ steps[ this.state.step ].number }
					totalSteps={ 3 } />
				{ this.renderStep() }
			</Dialog>
		);
	}
}

export default localize( connect(
	( state, props ) => {
		const subbmittingApiKey = isSubbmittingApiKey( state, props.siteId );
		const isKeyCorrect = isApiKeyCorrect( state, props.siteId );
		const isBusy = subbmittingApiKey;
		return {
			isBusy,
			isKeyCorrect
		};
	},
	{
		submitMailChimpApiKey
	}
)( MailChimpSetup ) );
