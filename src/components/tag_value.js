// @ts-check
import { Fragment } from 'react';
import tag2linkRaw from 'tag2link';

const RANKS = ['deprecated', 'normal', 'preferred'];

/**
 * @typedef {{
 *  key: `Key:${string}`;
 *  url: string;
 *  source: string;
 *  rank: "normal" | "preferred";
 * }} Tag2LinkItem
 */

/** @param {Tag2LinkItem[]} input */
function convertSourceData(input) {
  /** @type {Record<string, string>} */
  const output = {};

  const allKeys = new Set(input.map(item => item.key));

  for (const key of allKeys) {
    // find the item with the best rank
    const bestDefinition = input
      .filter(item => item.key === key)
      .sort((a, b) => RANKS.indexOf(b.rank) - RANKS.indexOf(a.rank))[0];

    output[key.replace('Key:', '')] = bestDefinition.url;
  }

  return output;
}

export const TAG2LINK = convertSourceData(tag2linkRaw);

/** @type {React.FC<{ k: string; v: string }>} */
export const TagValue = ({ k, v }) => {
  const placeholderUrl = TAG2LINK[k];

  // simple key, not clickable
  if (!placeholderUrl) return v;

  // clickable values
  return v.split(';').map((chunk, index) => ((
    <Fragment key={index}>
      {!!index && ';'}
      <a
        href={
          /^https?:\/\//i.test(chunk)
            ? chunk
            : placeholderUrl.replaceAll('$1', chunk)
        }
        target="_blank"
        rel="noreferrer"
      >
        {chunk}
      </a>
    </Fragment>
  )));
};
