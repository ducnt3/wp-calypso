/** @format */

/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import reducer, { siteId, postId } from '../reducer';
import { EDITOR_LAST_DRAFT_SET } from 'state/action-types';

describe( 'reducer', () => {
	it( 'should include expected keys in return value', () => {
		expect( reducer( undefined, {} ) ).to.have.keys( [ 'siteId', 'postId' ] );
	} );

	describe( '#siteId()', () => {
		it( 'should default to null', () => {
			const state = siteId( undefined, {} );

			expect( state ).to.be.null;
		} );

		it( 'should track last draft site ID state', () => {
			const state = siteId( undefined, {
				type: EDITOR_LAST_DRAFT_SET,
				siteId: 2916284,
				postId: 841,
			} );

			expect( state ).to.equal( 2916284 );
		} );
	} );

	describe( '#postId()', () => {
		it( 'should default to null', () => {
			const state = postId( undefined, {} );

			expect( state ).to.be.null;
		} );

		it( 'should track last draft post ID state', () => {
			const state = postId( undefined, {
				type: EDITOR_LAST_DRAFT_SET,
				siteId: 2916284,
				postId: 841,
			} );

			expect( state ).to.equal( 841 );
		} );
	} );
} );
