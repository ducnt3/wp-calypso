/**
 * External dependencies
 */
import { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { requestSettings } from './actions';
import { isRequestingSettings } from './selectors';

class QueryMailChimpSettings extends Component {
	static propTypes = {
		siteId:	PropTypes.number.isRequired,
		isRequesting: PropTypes.bool.isRequired,
		requestTheme: PropTypes.func.isRequired,
	}

	componentDidMount() {
		this.request( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.siteId === nextProps.siteId &&
			this.props.themeId === nextProps.themeId ) {
			return;
		}
		this.request( nextProps );
	}

	request( props ) {
		if ( ! props.isRequesting ) {
			props.requestTheme( props.themeId, props.siteId );
		}
	}

	render() {
		return null;
	}
}

export default connect(
	( state, { siteId } ) => ( {
		isRequesting: isRequestingSettings( state, siteId ),
	} ),
	{ requestSettings }
)( QueryMailChimpSettings );
