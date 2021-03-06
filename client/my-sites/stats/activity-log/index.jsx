/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import debugFactory from 'debug';
import scrollTo from 'lib/scroll-to';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { get, groupBy, includes, isEmpty, isNull } from 'lodash';

/**
 * Internal dependencies
 */
import ActivityLogBanner from '../activity-log-banner';
import ActivityLogConfirmDialog from '../activity-log-confirm-dialog';
import ActivityLogDay from '../activity-log-day';
import ActivityLogDayPlaceholder from '../activity-log-day/placeholder';
import ActivityLogRewindToggle from './activity-log-rewind-toggle';
import DatePicker from 'my-sites/stats/stats-date-picker';
import EmptyContent from 'components/empty-content';
import ErrorBanner from '../activity-log-banner/error-banner';
import JetpackColophon from 'components/jetpack-colophon';
import Main from 'components/main';
import ProgressBanner from '../activity-log-banner/progress-banner';
import QueryActivityLog from 'components/data/query-activity-log';
import QueryRewindStatus from 'components/data/query-rewind-status';
import QuerySiteSettings from 'components/data/query-site-settings'; // For site time offset
import SidebarNavigation from 'my-sites/sidebar-navigation';
import StatsFirstView from '../stats-first-view';
import StatsNavigation from 'blocks/stats-navigation';
import StatsPeriodNavigation from 'my-sites/stats/stats-period-navigation';
import SuccessBanner from '../activity-log-banner/success-banner';
import { adjustMoment, getActivityLogQuery, getStartMoment } from './utils';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getSiteSlug, getSiteTitle } from 'state/sites/selectors';
import { recordTracksEvent as recordTracksEventAction } from 'state/analytics/actions';
import {
	rewindRequestDismiss as rewindRequestDismissAction,
	rewindRequestRestore as rewindRequestRestoreAction,
	rewindRestore as rewindRestoreAction,
} from 'state/activity-log/actions';
import {
	canCurrentUser,
	getActivityLog,
	getActivityLogs,
	getRequestedRewind,
	getRestoreProgress,
	getRewindStatusError,
	getSiteGmtOffset,
	getSiteTimezoneValue,
	isRewindActive as isRewindActiveSelector,
} from 'state/selectors';

/**
 * Module constants
 */
const debug = debugFactory( 'calypso:activity-log' );
const rewindEnabledByConfig = config.isEnabled( 'jetpack/activity-log/rewind' );

class ActivityLog extends Component {
	static propTypes = {
		restoreProgress: PropTypes.shape( {
			errorCode: PropTypes.string.isRequired,
			failureReason: PropTypes.string.isRequired,
			message: PropTypes.string.isRequired,
			percent: PropTypes.number.isRequired,
			restoreId: PropTypes.number,
			status: PropTypes.oneOf( [
				'finished',
				'queued',
				'running',

				// These are other VP restore statuses.
				// We should _never_ see them for Activity Log rewinds
				// 'aborted',
				// 'fail',
				// 'success',
				// 'success-with-errors',
			] ).isRequired,
			timestamp: PropTypes.number.isRequired,
		} ),
		recordTracksEvent: PropTypes.func.isRequired,
		requestedRestoreActivity: PropTypes.shape( {
			activityTs: PropTypes.number.isRequired,
		} ),
		requestedRestoreActivityId: PropTypes.string,
		rewindRequestDismiss: PropTypes.func.isRequired,
		rewindRequestRestore: PropTypes.func.isRequired,
		rewindRestore: PropTypes.func.isRequired,
		rewindStatusError: PropTypes.shape( {
			error: PropTypes.string.isRequired,
			message: PropTypes.string.isRequired,
		} ),
		siteId: PropTypes.number,
		siteTitle: PropTypes.string,
		slug: PropTypes.string,

		// FIXME: Testing only
		isPressable: PropTypes.bool,

		// localize
		moment: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
	};

	componentDidMount() {
		window.scrollTo( 0, 0 );
	}

	getStartMoment() {
		const { gmtOffset, startDate, timezone } = this.props;
		return getStartMoment( { gmtOffset, startDate, timezone } );
	}

	handlePeriodChange = ( { date, direction } ) => {
		this.props.recordTracksEvent( 'calypso_activitylog_monthpicker_change', {
			date: date.utc().toISOString(),
			direction,
		} );
	};

	handlePeriodChangeBottom = ( ...args ) => {
		scrollTo( {
			x: 0,
			y: 0,
			duration: 250,
		} );
		this.handlePeriodChange( ...args );
	};

	handleRequestRestore = ( activityId, from ) => {
		const { recordTracksEvent, rewindRequestRestore, siteId } = this.props;

		recordTracksEvent( 'calypso_activitylog_restore_request', { from } );
		rewindRequestRestore( siteId, activityId );
	};

	handleRestoreDialogClose = () => {
		const { recordTracksEvent, rewindRequestDismiss, siteId } = this.props;
		recordTracksEvent( 'calypso_activitylog_restore_cancel' );
		rewindRequestDismiss( siteId );
	};

	handleRestoreDialogConfirm = () => {
		const { recordTracksEvent, requestedRestoreActivity, rewindRestore, siteId } = this.props;
		const { activityTs: timestamp } = requestedRestoreActivity;

		debug( 'Restore requested for after activity %o', requestedRestoreActivity );
		recordTracksEvent( 'calypso_activitylog_restore_confirm', { timestamp } );
		rewindRestore( siteId, timestamp );
	};

	/**
	 * Adjust a moment by the site timezone or gmt offset. Use the resulting function wherever log
	 * times need to be formatted for display to ensure all times are displayed as site times.
	 *
	 * @param   {object} moment Moment to adjust.
	 * @returns {object}        Moment adjusted for site timezone or gmtOffset.
	 */
	applySiteOffset = moment => {
		const { timezone, gmtOffset } = this.props;
		return adjustMoment( { timezone, gmtOffset, moment } );
	};

	isRestoreInProgress() {
		return includes( [ 'queued', 'running' ], get( this.props, [ 'restoreProgress', 'status' ] ) );
	}

	renderBanner() {
		const { restoreProgress, siteId } = this.props;

		if ( ! restoreProgress ) {
			return null;
		}
		const {
			errorCode,
			failureReason,
			freshness,
			percent,
			restoreId,
			siteTitle,
			status,
			timestamp,
		} = restoreProgress;

		if ( status === 'finished' ) {
			return (
				<div>
					<QueryActivityLog siteId={ siteId } />
					{ errorCode ? (
						<ErrorBanner
							errorCode={ errorCode }
							failureReason={ failureReason }
							requestRestore={ this.handleRequestRestore }
							siteId={ siteId }
							siteTitle={ siteTitle }
							timestamp={ timestamp }
						/>
					) : (
						<SuccessBanner
							applySiteOffset={ this.applySiteOffset }
							siteId={ siteId }
							timestamp={ timestamp }
						/>
					) }
				</div>
			);
		}
		return (
			<ProgressBanner
				applySiteOffset={ this.applySiteOffset }
				freshness={ freshness }
				percent={ percent }
				restoreId={ restoreId }
				siteId={ siteId }
				status={ status }
				timestamp={ timestamp }
			/>
		);
	}

	renderErrorMessage() {
		if ( ! rewindEnabledByConfig ) {
			return null;
		}

		const { isPressable, rewindStatusError, translate } = this.props;

		// Do not match null
		// FIXME: This is for internal testing
		if ( false === isPressable ) {
			return (
				<ActivityLogBanner status="info" icon={ null }>
					{ translate( 'Rewind is currently only available for Pressable sites' ) }
				</ActivityLogBanner>
			);
		}

		if ( rewindStatusError ) {
			return (
				<ActivityLogBanner status="error" icon={ null }>
					{ translate( 'Rewind error: %s', { args: rewindStatusError.message } ) }
					<br />
					{ translate( 'Do you have an appropriate plan?' ) }
				</ActivityLogBanner>
			);
		}
	}

	renderLogs() {
		const {
			isPressable,
			isRewindActive,
			logs,
			moment,
			requestedRestoreActivity,
			requestedRestoreActivityId,
			siteId,
			translate,
		} = this.props;
		const startMoment = this.getStartMoment();

		if ( isNull( logs ) ) {
			return (
				<section className="activity-log__wrapper">
					<ActivityLogDayPlaceholder />
					<ActivityLogDayPlaceholder />
					<ActivityLogDayPlaceholder />
				</section>
			);
		}

		if ( isEmpty( logs ) ) {
			return (
				<EmptyContent
					title={ translate( 'No activity for %s', {
						args: startMoment.format( 'MMMM YYYY' ),
					} ) }
				/>
			);
		}

		const disableRestore = this.isRestoreInProgress();
		const logsGroupedByDay = groupBy( logs, log =>
			this.applySiteOffset( moment.utc( log.activityTs ) )
				.endOf( 'day' )
				.valueOf()
		);
		const rewindConfirmDialog = requestedRestoreActivity && (
			<ActivityLogConfirmDialog
				applySiteOffset={ this.applySiteOffset }
				key="activity-rewind-dialog"
				onClose={ this.handleRestoreDialogClose }
				onConfirm={ this.handleRestoreDialogConfirm }
				timestamp={ requestedRestoreActivity.activityTs }
			/>
		);

		const activityDays = [];
		// loop backwards through each day in the month
		for (
			const m = moment.min(
					startMoment
						.clone()
						.endOf( 'month' )
						.startOf( 'day' ),
					this.applySiteOffset( moment.utc() ).startOf( 'day' )
				),
				startOfMonth = startMoment
					.clone()
					.startOf( 'month' )
					.valueOf();
			startOfMonth <= m.valueOf();
			m.subtract( 1, 'day' )
		) {
			const dayEnd = m.endOf( 'day' ).valueOf();
			activityDays.push(
				<ActivityLogDay
					applySiteOffset={ this.applySiteOffset }
					requestedRestoreActivityId={ requestedRestoreActivityId }
					rewindConfirmDialog={ rewindConfirmDialog }
					disableRestore={ disableRestore }
					hideRestore={ ! rewindEnabledByConfig || ! isPressable }
					isRewindActive={ isRewindActive }
					key={ dayEnd }
					logs={ get( logsGroupedByDay, dayEnd, [] ) }
					requestRestore={ this.handleRequestRestore }
					siteId={ siteId }
					tsEndOfSiteDay={ dayEnd }
				/>
			);
		}

		return <section className="activity-log__wrapper">{ activityDays }</section>;
	}

	renderMonthNavigation( position ) {
		const { logs, slug } = this.props;
		const startOfMonth = this.getStartMoment().startOf( 'month' );
		const query = {
			period: 'month',
			date: startOfMonth.format( 'YYYY-MM-DD' ),
		};

		if ( position === 'bottom' && ( ! isNull( logs ) && isEmpty( logs ) ) ) {
			return null;
		}

		return (
			<StatsPeriodNavigation
				date={ startOfMonth }
				onPeriodChange={
					position === 'bottom' ? this.handlePeriodChangeBottom : this.handlePeriodChange
				}
				period="month"
				url={ `/stats/activity/${ slug }` }
			>
				<DatePicker isActivity={ true } period="month" date={ startOfMonth } query={ query } />
			</StatsPeriodNavigation>
		);
	}

	render() {
		const {
			canViewActivityLog,
			gmtOffset,
			isPressable,
			isRewindActive,
			siteId,
			slug,
			startDate,
			timezone,
			translate,
		} = this.props;

		if ( false === canViewActivityLog ) {
			return (
				<Main>
					<SidebarNavigation />
					<EmptyContent
						title={ translate( 'You are not authorized to view this page' ) }
						illustration={ '/calypso/images/illustrations/illustration-404.svg' }
					/>
				</Main>
			);
		}

		return (
			<Main wideLayout>
				{ rewindEnabledByConfig && <QueryRewindStatus siteId={ siteId } /> }
				<QueryActivityLog
					siteId={ siteId }
					{ ...getActivityLogQuery( { gmtOffset, startDate, timezone } ) }
				/>
				<QuerySiteSettings siteId={ siteId } />
				<StatsFirstView />
				<SidebarNavigation />
				<StatsNavigation selectedItem={ 'activity' } siteId={ siteId } slug={ slug } />
				{ this.renderErrorMessage() }
				{ this.renderMonthNavigation() }
				{ this.renderBanner() }
				{ ! isRewindActive && !! isPressable && <ActivityLogRewindToggle siteId={ siteId } /> }
				{ this.renderLogs() }
				{ this.renderMonthNavigation( 'bottom' ) }
				<JetpackColophon />
			</Main>
		);
	}
}

export default connect(
	( state, { startDate } ) => {
		const siteId = getSelectedSiteId( state );
		const gmtOffset = getSiteGmtOffset( state, siteId );
		const timezone = getSiteTimezoneValue( state, siteId );
		const requestedRestoreActivityId = getRequestedRewind( state, siteId );

		return {
			canViewActivityLog: canCurrentUser( state, siteId, 'manage_options' ),
			gmtOffset,
			isRewindActive: isRewindActiveSelector( state, siteId ),
			logs: getActivityLogs(
				state,
				siteId,
				getActivityLogQuery( { gmtOffset, startDate, timezone } )
			),
			requestedRestoreActivity: getActivityLog( state, siteId, requestedRestoreActivityId ),
			requestedRestoreActivityId,
			restoreProgress: getRestoreProgress( state, siteId ),
			rewindStatusError: getRewindStatusError( state, siteId ),
			siteId,
			siteTitle: getSiteTitle( state, siteId ),
			slug: getSiteSlug( state, siteId ),
			timezone,

			// FIXME: Testing only
			isPressable: get( state.activityLog.rewindStatus, [ siteId, 'isPressable' ], null ),
		};
	},
	{
		recordTracksEvent: recordTracksEventAction,
		rewindRequestDismiss: rewindRequestDismissAction,
		rewindRequestRestore: rewindRequestRestoreAction,
		rewindRestore: rewindRestoreAction,
	}
)( localize( ActivityLog ) );
