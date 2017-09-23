/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import FormInputValidation from 'components/forms/form-input-validation';
import SettingsPaymentsLocationCurrency from 'woocommerce/app/settings/payments/payments-location-currency.js';
import { translate } from 'i18n-calypso';

const fields = [
	{ name: 'store_name', label: translate( 'Store Name' ) },
	{ name: 'store_phone', label: translate( 'Phone' ) },
	{ name: 'store_locale', label: translate( 'Locale' ) },
	{ name: 'admin_email', label: translate( 'Admin Email' ) },
];

export default ( { storeData, onChange, validateFields } ) => {
	return (
		<FormFieldset className="setup-steps__store-info-field">
			<div>Make sure that store informatin is correct. Every field is required</div>
			<SettingsPaymentsLocationCurrency />
			{ fields.map( ( item, index ) => (
				<div key={ index }>
					<FormLabel>
						{ item.label }
					</FormLabel>
					<FormTextInput
						name={ item.name }
						isError={ validateFields && ! storeData[ item.name ] }
						onChange={ onChange }
						value={ storeData[ item.name ] }
					/>
					{ ( validateFields && ! storeData.store_name ) && <FormInputValidation iserror text="field is required" /> }
				</div>
			) ) }
		</FormFieldset>
	);
};
