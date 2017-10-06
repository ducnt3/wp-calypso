/** @format */
/**
 * External dependencies
 *
 * @format
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { find, get } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { activatePlugin, installPlugin, fetchPlugins } from 'state/plugins/installed/actions';
import analytics from 'lib/analytics';
import Button from 'components/button';
import { fetchPluginData } from 'state/plugins/wporg/actions';
import { getPlugin } from 'state/plugins/wporg/selectors';
import { getPlugins } from 'state/plugins/installed/selectors';
import { getSelectedSiteWithFallback } from 'woocommerce/state/sites/selectors';
import ProgressBar from 'components/progress-bar';
import QueryJetpackPlugins from 'components/data/query-jetpack-plugins';
import SetupHeader from './setup-header';
import { setFinishedInstallOfRequiredPlugins } from 'woocommerce/state/sites/setup-choices/actions';
import QuerySites from 'components/data/query-sites';
import { getSiteOptions } from 'state/selectors';
import { getAutomatedTransferStatus as fetchAutomatedTransferStatus } from 'state/automated-transfer/actions';
import { getAutomatedTransferStatus } from 'state/automated-transfer/selectors';
import { transferStates } from 'state/automated-transfer/constants';
import { isSiteAutomatedTransfer as isSiteAutomatedTransferSelector } from 'state/selectors';

class RequiredPluginsInstallView extends Component {
	static propTypes = {
		site: PropTypes.shape( {
			ID: PropTypes.number.isRequired,
		} ),
		isInSignup: PropTypes.bool,
	};

	constructor( props ) {
		super( props );
		this.state = {
			engineState: 'CONFIRMING',
			toActivate: [],
			toInstall: [],
			workingOn: '',
			stepIndex: 0,
			numTotalSteps: 0,
			requestedTransferStatus: false,
		};
		this.updateTimer = false;
	}

	componentDidMount = () => {
		const { isInSignup } = this.props;

		this.createUpdateTimer();

		if ( isInSignup ) {
			this.fetchAutomatedTransferStatus();
			this.startSetup();
		}
	};

	componentWillUnmount = () => {
		this.destroyUpdateTimer();
	};

	fetchAutomatedTransferStatus() {
		const { atomicStoreDoingTransfer, isInSignup } = this.props;
		const { requestedTransferStatus } = this.state;

		if ( ( atomicStoreDoingTransfer || isInSignup ) && ! requestedTransferStatus ) {
			this.props.fetchAutomatedTransferStatus( this.props.siteId );

			this.setState( {
				engineState: 'DOING_TRANSFER',
				requestedTransferStatus: true,
				stepIndex: 1,
				numTotalSteps: 6,
			} );
		}
	}

	componentWillReceiveProps = () => {
		this.fetchAutomatedTransferStatus();
	};

	createUpdateTimer = () => {
		if ( this.updateTimer ) {
			return;
		}

		// Proceed at rate of approximately 60 fps
		this.updateTimer = window.setInterval( () => {
			this.updateEngine();
		}, 17 );
	};

	destroyUpdateTimer = () => {
		if ( this.updateTimer ) {
			window.clearInterval( this.updateTimer );
			this.updateTimer = false;
		}
	};

	getRequiredPluginsList = () => {
		const { translate } = this.props;

		return {
			woocommerce: translate( 'WooCommerce' ),
			'woocommerce-gateway-stripe': translate( 'WooCommerce Stripe Gateway' ),
			'woocommerce-services': translate( 'WooCommerce Services' ),
			'taxjar-simplified-taxes-for-woocommerce': translate(
				'TaxJar - Sales Tax Automation for WooCommerce'
			),
		};
	};

	doTransferStatusPolling = () => {
		const { automatedTransferStatus, siteId } = this.props;

		const { COMPLETE } = transferStates;

		if ( automatedTransferStatus === COMPLETE ) {
			this.setState( {
				engineState: 'INITIALIZING',
				workingOn: '',
				stepIndex: 3,
				numTotalSteps: 6,
			} );

			this.props.fetchPlugins( [ siteId ] );
		}
	};

	doInitialization = () => {
		const { site, sitePlugins, wporg, isInSignup } = this.props;
		const { workingOn } = this.state;

		if ( ! site ) {
			return;
		}

		let waitingForPluginListFromSite = false;
		if ( ! sitePlugins ) {
			waitingForPluginListFromSite = true;
		} else if ( ! Array.isArray( sitePlugins ) ) {
			waitingForPluginListFromSite = true;
		} else if ( 0 === sitePlugins.length ) {
			waitingForPluginListFromSite = true;
		}

		if ( waitingForPluginListFromSite ) {
			if ( workingOn === 'WAITING_FOR_PLUGIN_LIST_FROM_SITE' ) {
				return;
			}

			this.setState( {
				workingOn: 'WAITING_FOR_PLUGIN_LIST_FROM_SITE',
			} );
			return;
		}

		// Iterate over the required plugins, fetching plugin
		// data from wordpress.org for each into state
		const requiredPlugins = this.getRequiredPluginsList();
		let pluginDataLoaded = true;
		for ( const requiredPluginSlug in requiredPlugins ) {
			const pluginData = getPlugin( wporg, requiredPluginSlug );
			// pluginData will be null until the action has had
			// a chance to try and fetch data for the plugin slug
			// given. Note that non-wp-org plugins
			// will be accepted too, but with
			// { fetched: false, wporg: false }
			// as their response
			if ( ! pluginData ) {
				this.props.fetchPluginData( requiredPluginSlug );
				pluginDataLoaded = false;
			}
		}
		if ( ! pluginDataLoaded ) {
			if ( workingOn === 'LOAD_PLUGIN_DATA' ) {
				return;
			}

			this.setState( {
				workingOn: 'LOAD_PLUGIN_DATA',
			} );
			return;
		}

		const toInstall = [];
		const toActivate = [];
		let numTotalSteps = this.state.numTotalSteps;
		for ( const requiredPluginSlug in requiredPlugins ) {
			const pluginFound = find( sitePlugins, { slug: requiredPluginSlug } );
			if ( ! pluginFound ) {
				toInstall.push( requiredPluginSlug );
				toActivate.push( requiredPluginSlug );
				numTotalSteps++;
			} else if ( ! pluginFound.active ) {
				toActivate.push( requiredPluginSlug );
				numTotalSteps++;
			}
		}

		let stepIndex = this.state.stepIndex;

		if ( isInSignup ) {
			stepIndex += numTotalSteps - this.state.numTotalSteps;
		}

		if ( toInstall.length ) {
			this.setState( {
				engineState: 'INSTALLING',
				toActivate,
				toInstall,
				workingOn: '',
				numTotalSteps,
				stepIndex,
			} );
			return;
		}

		if ( toActivate.length ) {
			this.setState( {
				engineState: 'ACTIVATING',
				toActivate,
				workingOn: '',
				numTotalSteps,
				stepIndex,
			} );
			return;
		}

		this.setState( {
			engineState: 'DONESUCCESS',
		} );
	};

	doInstallation = () => {
		const { site, sitePlugins, wporg } = this.props;

		// If we are working on nothing presently, get the next thing to install and install it
		if ( 0 === this.state.workingOn.length ) {
			const toInstall = this.state.toInstall;

			// Nothing left to install? Advance to activation step
			if ( 0 === toInstall.length ) {
				this.setState( {
					engineState: 'ACTIVATING',
				} );
				return;
			}

			const workingOn = toInstall.shift();
			this.props.installPlugin( site.ID, getPlugin( wporg, workingOn ) );

			this.setState( {
				toInstall,
				workingOn,
			} );
			return;
		}

		// Otherwise, if we are working on something presently, see if it has appeared in state yet
		const pluginFound = find( sitePlugins, { slug: this.state.workingOn } );
		if ( pluginFound ) {
			this.setState( {
				workingOn: '',
				stepIndex: this.state.stepIndex + 1,
			} );
		}
	};

	doActivation = () => {
		const { site, sitePlugins } = this.props;

		// If we are working on nothing presently, get the next thing to activate and activate it
		if ( 0 === this.state.workingOn.length ) {
			const toActivate = this.state.toActivate;

			// Nothing left to activate? Advance to done success
			if ( 0 === toActivate.length ) {
				this.setState( {
					engineState: 'DONESUCCESS',
				} );
				return;
			}

			const workingOn = toActivate.shift();

			// It is best to use sitePlugins to get the right id since the
			// plugin id isn't always slug/slug unless the main plugin PHP
			// file is the same name as the plugin folder
			const pluginToActivate = find( sitePlugins, { slug: workingOn } );
			// Already active? Skip it
			if ( pluginToActivate.active ) {
				this.setState( {
					toActivate,
					workingOn: '',
				} );
				return;
			}

			// Otherwise, activate!
			this.props.activatePlugin( site.ID, pluginToActivate );

			this.setState( {
				toActivate,
				workingOn,
			} );
			return;
		}

		// See if activation has appeared in state yet
		const pluginFound = find( sitePlugins, { slug: this.state.workingOn } );
		if ( pluginFound && pluginFound.active ) {
			this.setState( {
				workingOn: '',
				stepIndex: this.state.stepIndex + 1,
			} );
		}
	};

	doneSuccess = () => {
		const { site } = this.props;
		this.props.setFinishedInstallOfRequiredPlugins( site.ID, true );

		this.setState( {
			engineState: 'IDLE',
		} );
	};

	updateEngine = () => {
		switch ( this.state.engineState ) {
			case 'DOING_TRANSFER':
				this.doTransferStatusPolling();
				break;
			case 'INITIALIZING':
				this.doInitialization();
				break;
			case 'INSTALLING':
				this.doInstallation();
				break;
			case 'ACTIVATING':
				this.doActivation();
				break;
			case 'DONESUCCESS':
				this.doneSuccess();
				break;
		}
	};

	getProgress = () => {
		const { stepIndex, numTotalSteps } = this.state;

		return stepIndex / numTotalSteps * 100;
	};

	startSetup = () => {
		const { atomicStoreDoingTransfer, isInSignup } = this.props;

		analytics.tracks.recordEvent( 'calypso_woocommerce_dashboard_action_click', {
			action: 'initial-setup',
		} );

		let engineState = 'INITIALIZING';

		if ( atomicStoreDoingTransfer || isInSignup ) {
			engineState = 'DOING_TRANSFER';
		}

		this.setState( {
			engineState,
		} );
	};

	renderConfirmScreen = () => {
		const { translate } = this.props;
		return (
			<div className="card dashboard__setup-wrapper dashboard__setup-confirm">
				<SetupHeader
					imageSource={ '/calypso/images/extensions/woocommerce/woocommerce-setup.svg' }
					imageWidth={ 160 }
					title={ translate( 'Have something to sell?' ) }
					subtitle={ translate(
						"If you're in the {{strong}}United States{{/strong}} " +
							'or {{strong}}Canada{{/strong}}, you can sell your products right on ' +
							'your site and ship them to customers in a snap!',
						{
							components: { strong: <strong /> },
						}
					) }
				>
					<Button onClick={ this.startSetup } primary>
						{ translate( 'Set up my store!' ) }
					</Button>
				</SetupHeader>
			</div>
		);
	};

	fetchSiteData = () => {
		const {
			automatedTransferStatus,
			isSiteAutomatedTransfer,
			atomicStoreDoingTransfer,
			siteId,
		} = this.props;
		const { COMPLETE } = transferStates;

		if ( ! siteId ) {
			return;
		}

		if (
			! atomicStoreDoingTransfer ||
			( automatedTransferStatus === COMPLETE && ! isSiteAutomatedTransfer )
		) {
			return <QuerySites siteId={ siteId } />;
		}
	};

	render = () => {
		const { site, translate, isInSignup } = this.props;
		const { engineState } = this.state;

		if ( ! isInSignup && 'CONFIRMING' === engineState ) {
			return this.renderConfirmScreen();
		}

		const progress = this.getProgress();

		return (
			<div className="card dashboard__setup-wrapper">
				{ site && <QueryJetpackPlugins siteIds={ [ site.ID ] } /> }
				{ this.fetchSiteData() }
				<SetupHeader
					imageSource={ '/calypso/images/extensions/woocommerce/woocommerce-store-creation.svg' }
					imageWidth={ 160 }
					title={ translate( 'Setting up your store' ) }
					subtitle={ translate( "Give us a minute and we'll move right along." ) }
				>
					<ProgressBar value={ progress } isPulsing />
				</SetupHeader>
			</div>
		);
	};
}

function mapStateToProps( state ) {
	const site = getSelectedSiteWithFallback( state );
	const siteId = site.ID;

	const sitePlugins = site ? getPlugins( state, [ siteId ] ) : [];
	const siteOptions = getSiteOptions( state, siteId );

	const atomicStoreDoingTransfer = get( siteOptions, [ 'atomic_store_doing_transfer' ], false );

	return {
		site,
		siteId,
		sitePlugins,
		atomicStoreDoingTransfer,
		wporg: state.plugins.wporg.items,
		automatedTransferStatus: getAutomatedTransferStatus( state, siteId ),
		isSiteAutomatedTransfer: isSiteAutomatedTransferSelector( state, siteId ),
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			activatePlugin,
			fetchPluginData,
			installPlugin,
			setFinishedInstallOfRequiredPlugins,
			fetchAutomatedTransferStatus,
			fetchPlugins,
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )(
	localize( RequiredPluginsInstallView )
);
