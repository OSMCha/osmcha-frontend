// $(function() {
//     var id = CHANGESET_ID; // defined in changeset_detail template
//     var url = 'https://osm-comments-api.mapbox.com/api/v1/changesets/' + id;
//     var $xhr = $.get(url);
//     var tmpl = jsrender.templates($('#discussionsTpl').html());

//     $xhr.success(function(data) {
//         var html = tmpl.render({
//             'comments': data.properties.comments.length ? data.properties.comments : null,
//             'count': data.properties.comments.length
//         });
//         $('#changesetDiscussions').html(html);
//     });
//     $xhr.fail(function(err) {
//         if (err.status === 404) {
//             var html = tmpl.render({'comments': null});
//             $('#changesetDiscussions').html(html);
//         }
//     });
// });

// @flow
import React from 'react';
import {Map} from 'immutable';

export class Discussions extends React.PureComponent {
  props: {
    properties: Map<string, *>,
    changesetId: number,
  };
  state = {
    discussions: [],
  };
  constructor(props) {
    super(props);
    this.getData(props.changesetId);
  }
  getData = changesetId => {
    fetch(
      `https://osm-comments-api.mapbox.com/api/v1/changesets/${changesetId}`,
    )
      .then(r => r.json())
      .then(x => {
        if (x && x.properties && Array.isArray(x.properties.comments)) {
          this.setState({
            discussions: x.properties.comments,
          });
        }
      });
  };
  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.changesetId);
  }
  render() {
    return (
      <div className="p12">
        <h2 className="txt-l mr6">Discussions</h2>
        <div className="ml6">
          {this.state.discussions.map((f, k) => (
            <div
              key={k}
              className="flex-parent flex-parent--row justify--space-between border-b border--gray-light pb3"
            >
              <span className="wmin96 txt-em">{f.userName}&nbsp; -</span>
              <span className="wmin240 txt-break-word">
                {f.comment}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
