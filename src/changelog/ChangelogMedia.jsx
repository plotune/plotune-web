import React, {useEffect, useId, useRef, useState} from 'react';

const players = new Set();
export default function ChangelogMedia({media}) {
  const holder = useRef(null), video = useRef(null);
  const userPaused = useRef(false), managedPause = useRef(false);
  const [loaded,setLoaded] = useState(false), [failed,setFailed] = useState(false);
  const id = useId();
  const base = `/changelog/media/${media.id}`;
  useEffect(()=>{
    const el = video.current;
    if (!el || failed) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    const pause = ()=>{ if(!el.paused) {managedPause.current=true;el.pause();} };
    const start = ()=>{
      players.forEach(other=>{if(other!==el) other.pause();});
      if (!el.getAttribute('src')) {el.src = `${base}.mp4`; setLoaded(true);}
      el.play()?.catch(()=>{}); // Native controls remain available if autoplay is blocked.
    };
    players.add(el);
    let visible = false;
    const update = ()=>{
      if (visible && !document.hidden && !reduce.matches && !connection?.saveData && !userPaused.current) start();
      else pause();
    };
    const observer = new IntersectionObserver(([entry])=>{visible = entry.isIntersecting && entry.intersectionRatio >= .5; update();},{threshold:[0,.5]});
    observer.observe(holder.current);
    document.addEventListener('visibilitychange',update);
    reduce.addEventListener('change',update);
    connection?.addEventListener?.('change',update);
    const onPlay=()=>{userPaused.current=false;players.forEach(other=>{if(other!==el)other.pause();});};
    const onPause=()=>{if(managedPause.current)managedPause.current=false;else userPaused.current=true;};
    el.addEventListener('play',onPlay);el.addEventListener('pause',onPause);
    return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);reduce.removeEventListener('change',update);connection?.removeEventListener?.('change',update);el.removeEventListener('play',onPlay);el.removeEventListener('pause',onPause);pause();players.delete(el);};
  },[base,failed]);
  const play = ()=>{video.current.src = `${base}.mp4`;setLoaded(true);video.current.play()?.catch(()=>{});};
  return <figure className="changelog-media" ref={holder}>
    <div className="changelog-video-frame">
      {failed ? <img src={`${base}.webp`} alt={media.caption} width="1280" height="720" /> : <video ref={video} muted playsInline loop controls preload="none" poster={`${base}.webp`} width="1280" height="720" aria-label={media.caption} aria-describedby={id} onError={()=>setFailed(true)} />}
      {!loaded && !failed && <button className="changelog-play" onClick={play} aria-label={`Play: ${media.caption}`}>Play video</button>}
    </div>
    <figcaption id={id}>{media.caption}</figcaption>
    <details><summary>Read the walkthrough</summary><p>{media.transcript}</p></details>
    {failed && <p role="status">Video unavailable. The written walkthrough is still available.</p>}
  </figure>;
}
