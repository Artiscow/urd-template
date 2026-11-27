/**
 * Core block: video, an embed of YouTube or Vimeo behind a cover until pressed (embed-cover.js), or a file from media/ in a native <video>.
 * Notes: docs/engine-notes/blocks/video.md (Urd repository).
 */
import { t, ta } from '../i18n.js';
import { isSafeImage } from '../nav-model.js';
import { isSafeVideo } from '../backgrounds/video.js';
import { coverFrame, embedUrl } from '../embed-cover.js';
import { pictureStyle, drawOverlay } from '../picture.js';
import { aspectRatio, VIDEO_ASPECTS } from '../push-model.js';

/** A video's shape as its ratio, or null for none: only the video's own shapes count. */
const videoRatio = (aspect) => (VIDEO_ASPECTS.includes(aspect) ? aspectRatio(aspect) : null);

/** Where the film comes from; an embed for anything unknown. */
export const VIDEO_SOURCES = ['embed', 'file'];

/** The strongest colour over a film, which leaves the player's controls in sight (the menu's Strength stops there too). */
export const FILM_OVERLAY_MAX = 0.8;

/** The source, with the embed (what the block began as) for anything unknown. */
export function videoSource(source) {
  return source === 'file' ? 'file' : 'embed';
}

/**
 * How a file video plays: looping and muted as chosen, starting by itself only when muted and the visitor has not asked for reduced motion. Pure.
 * @param {{loop?: boolean, muted?: boolean, autoplay?: boolean}} props
 * @param {boolean} [reducedMotion]
 * @returns {{loop: boolean, muted: boolean, autoplay: boolean}}
 */
export function videoPlayback(props, reducedMotion = false) {
  const muted = props?.muted === true;
  return {
    loop: props?.loop === true,
    muted,
    autoplay: props?.autoplay === true && muted && !reducedMotion,
  };
}

/**
 * A player's address that starts the video as it loads (the press on the cover is the visitor's own start). Pure.
 * @param {string} src
 * @returns {string}
 */
export function withAutoplay(src) {
  try {
    const url = new URL(src);
    url.searchParams.set('autoplay', '1');
    return url.href;
  } catch {
    return src;
  }
}

// The embed address of a known video service lives with the embeds' other rules (embed-cover.js), so the privacy page reads it without this block.
export { embedUrl };

export const videoBlock = {
  version: 1,
  label: 'Video',
  labelKey: 'blocks.video',
  defaults: () => ({ url: '', title: 'Video', aspect: '16:9' }),
  migrations: {},
  // On the phone a video with a shape is that shape at the row's width; one without keeps its frame's height.
  autoGrow: (props) => videoRatio(props.aspect) !== null,
  /**
   * @param {HTMLElement} el
   * @param {{url: string, title?: string, source?: 'embed'|'file', src?: string, poster?: string (the file's poster, or the embed's cover image),
   *          loop?: boolean, muted?: boolean, autoplay?: boolean, aspect?: string, playOnPress?: boolean, coverStyle?: object, askFirst?: boolean,
   *          overlay?: {color: string, strength: number}}} props
   *   askFirst: false loads an embed with the page; aspect: one of VIDEO_ASPECTS; playOnPress: false keeps a pressed embed still; coverStyle, overlay: a picture's.
   * @param {object} ctx
   */
  render(el, props, ctx) {
    const editing = Boolean(ctx.preview) && ctx.viewport !== 'mobile';
    // A chosen shape: the video is that shape at the block's width, and the block's height follows it (keepsShape in push-model.js).
    const ratio = videoRatio(props.aspect);
    let box = el;
    if (ratio) {
      box = document.createElement('div');
      box.className = 'urd-video-ratio';
      box.style.setProperty('--urd-ratio', String(Math.round(ratio * 10000) / 10000));
      el.appendChild(box);
    }
    if (videoSource(props.source) === 'file') {
      if (!isSafeVideo(props.src)) {
        // No film yet: a hint in the editor, nothing at all for visitors.
        if (ctx.preview) {
          const hint = document.createElement('div');
          hint.className = 'urd-video-empty';
          hint.textContent = ta('canvas.videoFileEmpty');
          box.appendChild(hint);
        }
        return;
      }
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
      // While editing nothing starts by itself: the block is being placed, not watched.
      const play = videoPlayback(props, reduced || editing);
      const video = document.createElement('video');
      video.className = 'urd-video-file';
      video.controls = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      // Only the metadata until the visitor (or the autoplay) asks for the film.
      video.preload = 'metadata';
      video.loop = play.loop;
      video.muted = play.muted;
      if (play.muted) video.setAttribute('muted', '');
      video.autoplay = play.autoplay;
      if (props.title) video.setAttribute('aria-label', props.title);
      if (isSafeImage(props.poster)) video.poster = props.poster;
      video.src = props.src;
      // A film with an overlay stands in a frame that carries it; one without keeps the markup it has always had.
      const overlay = pictureStyle({ overlay: props.overlay }).overlay;
      if (overlay) {
        const film = document.createElement('div');
        film.className = 'urd-video-film';
        // The player's controls stand under the colour, so it stops short of hiding them (FILM_OVERLAY_MAX).
        drawOverlay(film, { ...overlay, strength: Math.min(overlay.strength, FILM_OVERLAY_MAX) });
        film.appendChild(video);
        box.appendChild(film);
      } else {
        box.appendChild(video);
      }
      if (editing) {
        const shield = document.createElement('div');
        shield.className = 'urd-video-shield';
        shield.title = ta('canvas.videoOnPublished');
        el.appendChild(shield);
      }
      return;
    }
    const src = embedUrl(props.url);
    if (!src) {
      // Without a valid URL: a hint in the editor, nothing at all for visitors.
      if (!ctx.preview) return;
      const hint = document.createElement('div');
      hint.className = 'urd-video-empty';
      hint.textContent = props.url ? t('video.unknownUrl') : t('video.emptyHint');
      box.appendChild(hint);
      return;
    }
    // The player behind its cover, reaching the provider only once pressed or let load; a pressed one starts as it loads unless the owner chose otherwise.
    const makeFrame = ({ pressed = false } = {}) => {
      const start = pressed && props.playOnPress !== false;
      const frame = document.createElement('iframe');
      frame.src = start ? withAutoplay(src) : src;
      frame.title = props.title || 'Video';
      frame.setAttribute('allowfullscreen', '');
      frame.allow = `accelerometer; encrypted-media; gyroscope; picture-in-picture${start ? '; autoplay' : ''}`;
      frame.loading = 'lazy';
      frame.style.cssText = 'width:100%;height:100%;border:0;display:block;';
      return frame;
    };
    coverFrame(box, { src, makeFrame, kind: 'video', image: props.poster, imageStyle: props.coverStyle, preview: Boolean(ctx.preview), ask: props.askFirst !== false });
    // In edit mode a click selects the block instead of starting the player.
    if (editing) {
      const shield = document.createElement('div');
      shield.className = 'urd-video-shield';
      shield.title = ta('canvas.videoOnPublished');
      el.appendChild(shield);
    }
  },
};
