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
		{ name: 'campaign_from_name', label: translate( 'From' ) },
		{ name: 'campaign_from_email', label: translate( 'From Email' ) },
		{ name: 'campaign_subject', label: translate( 'Subject' ) },
		{ name: 'campaign_language', label: translate( 'Language' ) },
		{ name: 'campaign_permission_reminder', label: translate( 'Permission reminder' ) },
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
							isError={ validateFields && ! storeData[ item.name ] }
							onChange={ onChange }
							value={ storeData[ item.name ] }
						/>
						{ ( validateFields && ! storeData[ item.name ] ) && <FormInputValidation iserror text="field is required" /> }
					</div>
				) ) }
			</FormFieldset>
		</div>
	);
};
