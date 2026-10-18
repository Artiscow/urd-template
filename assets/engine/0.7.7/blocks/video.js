/**
 * Core block: video. Two sources. `embed` (the default): paste a YouTube or
 * Vimeo link and a privacy-friendly embed is rendered (youtube-nocookie /
 * dnt=1); the CSP in _headers has a deliberate frame-src exception for
 * exactly these two hosts, and other embeds need a plugin and the owner's own
 * CSP choice. `file`: a self-hosted mp4 or webm from media/ in a native
 * <video> with the browser's own controls, an optional poster, loop and
 * muted. It starts by itself only when it is muted, which is the one case
 * browsers allow, and never under reduced motion.
 */
import { t, ta } from '../i18n.js';
import { isSafeImage } from '../nav-model.js';
import { isSafeVideo } from '../backgrounds/video.js';

/** Where the film comes from; an embed for anything unknown. */
export const VIDEO_SOURCES = ['embed', 'file'];

/** The source, with the embed (what the block began as) for anything unknown. */
export function videoSource(source) {
  return source === 'file' ? 'file' : 'embed';
}

/**
 * How a file video plays, from the props: looping and muted as chosen, and
 * starting by itself only when it is muted and the visitor has not asked for
 * reduced motion. Pure.
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

/** Returns the embed URL for a known video service, otherwise null. */
export function embedUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');

  // YouTube ids are alphanumeric with hyphens/underscores; anything else (including extra path segments) is rejected.
  const ytId = (id) => (/^[\w-]{5,}$/.test(id ?? '') ? id : null);

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const id = ytId(url.pathname.startsWith('/embed/')
      ? url.pathname.slice('/embed/'.length)
      : url.pathname.startsWith('/shorts/')
        ? url.pathname.slice('/shorts/'.length)
        : url.searchParams.get('v'));
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
  }
  if (host === 'youtu.be') {
    const id = ytId(url.pathname.slice(1));
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
  }
  if (host === 'vimeo.com') {
    // Private links have the form vimeo.com/<id>/<hash>; the hash must be passed as ?h= for the player to accept the video.
    const [id, hash] = url.pathname.split('/').filter(Boolean);
    if (!/^\d+$/.test(id ?? '')) return null;
    const h = /^[a-f0-9]+$/i.test(hash ?? '') ? `h=${hash}&` : '';
    return `https://player.vimeo.com/video/${id}?${h}dnt=1`;
  }
  if (host === 'player.vimeo.com') {
    // Only real player paths (/video/<id>) are accepted, and any private hash (?h=) is kept.
    const m = /^\/video\/(\d+)\/?$/.exec(url.pathname);
    if (!m) return null;
    const hash = url.searchParams.get('h');
    const h = /^[a-f0-9]+$/i.test(hash ?? '') ? `h=${hash}&` : '';
    return `https://player.vimeo.com/video/${m[1]}?${h}dnt=1`;
  }
  return null;
}

export const videoBlock = {
  version: 1,
  label: 'Video',
  labelKey: 'blocks.video',
  defaults: () => ({ url: '', title: 'Video' }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{url: string, title?: string, source?: 'embed'|'file', src?: string, poster?: string,
   *          loop?: boolean, muted?: boolean, autoplay?: boolean}} props
   * @param {object} ctx
   */
  render(el, props, ctx) {
    const editing = Boolean(ctx.preview) && ctx.viewport !== 'mobile';
    if (videoSource(props.source) === 'file') {
      if (!isSafeVideo(props.src)) {
        // No film yet: a hint in the editor, nothing at all for visitors.
        if (ctx.preview) {
          const hint = document.createElement('div');
          hint.className = 'urd-video-empty';
          hint.textContent = ta('canvas.videoFileEmpty');
          el.appendChild(hint);
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
      el.appendChild(video);
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
      // Without a valid URL: a quiet placeholder, never a crash.
      const hint = document.createElement('div');
      hint.className = 'urd-video-empty';
      hint.textContent = props.url ? t('video.unknownUrl') : t('video.emptyHint');
      el.appendChild(hint);
      return;
    }
    const frame = document.createElement('iframe');
    frame.src = src;
    frame.title = props.title || 'Video';
    frame.setAttribute('allowfullscreen', '');
    frame.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture';
    frame.loading = 'lazy';
    frame.style.cssText = 'width:100%;height:100%;border:0;display:block;';
    el.appendChild(frame);
    // In edit mode a click selects the block instead of starting the player.
    if (editing) {
      const shield = document.createElement('div');
      shield.className = 'urd-video-shield';
      shield.title = ta('canvas.videoOnPublished');
      el.appendChild(shield);
    }
  },
};
