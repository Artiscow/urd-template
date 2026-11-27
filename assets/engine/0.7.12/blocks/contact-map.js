/**
 * The contact block's map design: OpenStreetMap's map behind the site's cover, loaded with the design (loadContactMap in blocks/contact.js).
 */
import { t } from '../i18n.js';
import { buildEmbedUrl, buildLargerMapUrl } from '../osm.js';
import { watchCspBlock } from './map.js';
import { coverFrame } from '../embed-cover.js';

/**
 * Fills the map design's figure: the map behind the site's one cover (embed-cover.js), so nothing reaches OpenStreetMap before the visitor presses.
 * @param {HTMLElement} figure The design's map box
 * @param {{lat: number, lon: number}} geo The site's point
 * @param {object} ctx Render context
 * @param {{askFirst?: boolean}} props The block's props: the map loads with the page where the owner chose so (`askFirst: false`)
 */
export function drawMapFigure(figure, geo, ctx, props) {
  const src = buildEmbedUrl({ ...geo, zoom: 16 });
  const makeFrame = () => {
    const frame = document.createElement('iframe');
    frame.className = 'urd-contact-mapframe';
    frame.src = src;
    frame.title = t('map.mapTitle');
    frame.setAttribute('referrerpolicy', 'no-referrer');
    watchCspBlock(figure, frame, ctx, buildLargerMapUrl({ ...geo, zoom: 16 }));
    return frame;
  };
  coverFrame(figure, { src, makeFrame, kind: 'map', preview: Boolean(ctx.preview), ask: props.askFirst !== false, extraClass: 'urd-contact-cover' });
}
