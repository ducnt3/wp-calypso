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
import { translate } from 'i18n-calypso';

const fields = [
	{ name: 'store_name', label: translate( 'temp label' ) },
	{ name: 'store_street', label: translate( 'temp label' ) },
	{ name: 'store_city', label: translate( 'temp label' ) },
	{ name: 'store_state', label: translate( 'temp label' ) },
	{ name: 'store_postal_code', label: translate( 'temp label' ) },
	{ name: 'store_country', label: translate( 'temp label' ) },
	{ name: 'store_phone', label: translate( 'temp label' ) },
	{ name: 'store_locale', label: translate( 'temp label' ) },
	{ name: 'store_currency_code', label: translate( 'temp label' ) },
	{ name: 'store_phone', label: translate( 'temp label' ) }
];

export default ( { storeData, onChange, validateFields } ) => (
	<FormFieldset className="setup-steps__store-info-field">
		{ fields.map( ( item, index ) => (
			<div key={ index }>
				<FormLabel>
					{ item.label }
				</FormLabel>
				<FormTextInput
					name={ item.name }
					isError={ validateFields && ! storeData.store_name }
					onChange={ onChange }
					value={ storeData[ item.name ] }
				/>
				{ ( validateFields && ! storeData.store_name ) && <FormInputValidation iserror text="field is required" /> }
			</div>
  ) ) }
	</FormFieldset>
);
