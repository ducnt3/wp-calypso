/**
 * External dependencies
 *
 * @format
 */

import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import React from 'react';
import { connect } from 'react-redux';
import { noop, partial } from 'lodash';

/**
 * Internal dependencies
 */
import DetailItem from './detail-item';
import MediaUtils from 'lib/media/utils';
import HeaderCake from 'components/header-cake';
import preloadImage from '../preload-image';
import { ModalViews } from 'state/ui/media-modal/constants';
import { setEditorMediaModalView } from 'state/ui/editor/actions';

export const EditorMediaModalDetail = React.createClass( {
	propTypes: {
		site: PropTypes.object,
		items: PropTypes.array,
		selectedIndex: PropTypes.number,
		onSelectedIndexChange: PropTypes.func,
		onReturnToList: PropTypes.func,
		onEdit: PropTypes.func,
		onRestore: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			selectedIndex: 0,
			onSelectedIndexChange: noop,
		};
	},

	componentDidMount: function() {
		this.preloadImages();
	},

	componentDidUpdate: function() {
		this.preloadImages();
	},

	preloadImages: function() {
		MediaUtils.filterItemsByMimePrefix( this.props.items, 'image' ).forEach( function( image ) {
			var src = MediaUtils.url( image, {
				photon: this.props.site && ! this.props.site.is_private,
			} );

			preloadImage( src );
		}, this );
	},

	incrementIndex: function( increment ) {
		this.props.onSelectedIndexChange( this.props.selectedIndex + increment );
	},

	render: function() {
		const {
			items,
			selectedIndex,
			site,

			onEditImageItem,
			onEditVideoItem,
			onRestoreItem,
			onReturnToList,
		} = this.props;

		const item = items[ selectedIndex ];
		const mimePrefix = MediaUtils.getMimePrefix( item );

		return (
            <div className="editor-media-modal-detail">
				<HeaderCake onClick={ onReturnToList } backText={ this.props.translate( 'Media Library' ) } />
				<DetailItem
					site={ site }
					item={ item }
					hasPreviousItem={ selectedIndex - 1 >= 0 }
					hasNextItem={ selectedIndex + 1 < items.length }
					onShowPreviousItem={ this.incrementIndex.bind( this, -1 ) }
					onShowNextItem={ this.incrementIndex.bind( this, 1 ) }
					onRestore={ onRestoreItem }
					onEdit={ 'video' === mimePrefix ? onEditVideoItem : onEditImageItem }
				/>
			</div>
        );
	},
} );

export default connect( null, {
	onReturnToList: partial( setEditorMediaModalView, ModalViews.LIST ),
	onEditImageItem: partial( setEditorMediaModalView, ModalViews.IMAGE_EDITOR ),
	onEditVideoItem: partial( setEditorMediaModalView, ModalViews.VIDEO_EDITOR ),
} )( localize(EditorMediaModalDetail) );
