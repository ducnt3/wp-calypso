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

// Get reed of this, this should not be visible to the user - he does not need this.

export default ( { storeData, onChange, validateFields } ) => {
	const fields = [
		{ name: 'campaign_from_name', label: translate( 'From' ), defaultValue: storeData.store_name },
		{ name: 'campaign_from_email', label: translate( 'From Email' ), defaultValue: storeData.admin_email },
		{ name: 'campaign_subject', label: translate( 'Subject' ), defaultValue: storeData.store_name },
		{ name: 'campaign_language', label: translate( 'Language' ), defaultValue: storeData.store_locale },
		{ name: 'campaign_permission_reminder', label: translate( 'Permission reminder' ),
			defaultValue: translate( 'You were subscribed to the newsletter from ' ) + storeData.store_name },
	];

	return (
		<div>
			<div>Campaign default values</div>
			<FormFieldset className="setup-steps__campaign-defaults">
				{ fields.map( ( item, index ) => (
					<div key={ index }>
						<FormLabel>
							{ item.label }
						</FormLabel>
						<FormTextInput
							name={ item.name }
							isError={ validateFields && ! storeData.store_name }
							onChange={ onChange }
							value={ storeData[ item.name ] ? storeData[ item.name ] : item.defaultValue }
						/>
						{ ( validateFields && ! storeData.store_name ) && <FormInputValidation iserror text="field is required" /> }
					</div>
				) ) }
			</FormFieldset>
		</div>
	);
};
