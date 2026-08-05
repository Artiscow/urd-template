/**
 * Kjerneblokk: video/embed. Lim inn en YouTube- eller Vimeo-lenke, så
 * rendres personvernvennlig innbygging (youtube-nocookie / dnt=1).
 * CSP-en i _headers har et bevisst frame-src-unntak for akkurat disse
 * to vertene - andre embeds krever plugin og eget CSP-valg hos eieren.
 */
import { t } from '../i18n.js';

/** Finner innbyggings-URL for en kjent videotjeneste, ellers null. */
export function embedUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');

  // YouTube-id-er er alfanumeriske med bindestrek/understrek; alt annet (deriblant ekstra sti-segmenter) avvises.
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
    // Privatlenker har formen vimeo.com/<id>/<hash>; hashen må med som ?h= for at spilleren skal godta videoen.
    const [id, hash] = url.pathname.split('/').filter(Boolean);
    if (!/^\d+$/.test(id ?? '')) return null;
    const h = /^[a-f0-9]+$/i.test(hash ?? '') ? `h=${hash}&` : '';
    return `https://player.vimeo.com/video/${id}?${h}dnt=1`;
  }
  if (host === 'player.vimeo.com') {
    // Kun ekte spiller-stier (/video/<id>) godtas, og en eventuell privathash (?h=) beholdes.
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
   * @param {{url: string, title?: string}} props
   * @param {object} ctx
   */
  render(el, props, ctx) {
    const src = embedUrl(props.url);
    if (!src) {
      // Uten (gyldig) URL: rolig plassholder, aldri krasj.
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
    // I redigeringsmodus skal klikk markere blokken, ikke starte spilleren.
    if (ctx.preview && ctx.viewport !== 'mobile') {
      const shield = document.createElement('div');
      shield.className = 'urd-video-shield';
      shield.title = 'Videoen spilles på den publiserte siden';
      el.appendChild(shield);
    }
  },
};
