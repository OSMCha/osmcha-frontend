// @flow
import React from 'react';
import moment from 'moment';
import AnchorifyText from 'react-anchorify-text';

import AssemblyAnchor from '../assembly_anchor';
import { CommentForm } from './comment';
import TranslateButton from './translate_button';

export class Discussions extends React.PureComponent {
  props: {
    discussions: List<*>,
    changesetId: number,
    changesetIsHarmful: boolean
  };
  render() {
    const { discussions, changesetId, changesetIsHarmful } = this.props;
    return (
      <div className="px12 py6">
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">
          Discussions
        </h2>
        {discussions.size === 0
          ? <div className="flex-parent flex-parent--column flex-parent--center-cross mb12">
              <svg className="icon icon--xxl color-darken25">
                <use xlinkHref="#icon-contact" />
              </svg>
              <p className="txt-m">{`No discussions found for ${changesetId}.`}</p>
            </div>
          : <div className="">
              {discussions.map((f, k) =>
                <div
                  key={k}
                  className="flex-parent flex-parent--column justify--space-between border border--gray-light round p6 my6 mt12"
                >
                  <div className="flex-parent flex-parent--row justify--space-between txt-s ">
                    <span>
                      By{' '}
                      <span className="txt-bold">
                        {f.get('userName')}&nbsp;
                      </span>
                    </span>
                    <span>{moment(f.get('timestamp')).fromNow()}</span>
                  </div>
                  <div className="flex-parent flex-parent--column mt6 mb3">
                    <p className="txt-break-url">
                      <AnchorifyText text={f.get('comment')}>
                        <AssemblyAnchor />
                      </AnchorifyText>
                    </p>
                  </div>
                  <div className="flex-parent justify--flex-end">
                    <TranslateButton text={f.get('comment')} />
                  </div>
                </div>
              )}
            </div>}
        <div className="flex-parent flex-parent--center-main my12">
          <CommentForm
            changesetId={changesetId}
            changesetIsHarmful={changesetIsHarmful}
          >
          </CommentForm>
        </div>
      </div>
    );
  }
}
