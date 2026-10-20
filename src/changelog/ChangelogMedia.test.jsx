import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import ChangelogMedia from './ChangelogMedia';
let root,container,notify,reduce=false;
const media={id:'demo',kind:'ui',caption:'Choose a filter',transcript:'Choose a property and apply a condition to the event list.'};
beforeEach(()=>{
 container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);
 window.matchMedia=jest.fn(()=>({matches:reduce,addEventListener:jest.fn(),removeEventListener:jest.fn()}));
 window.IntersectionObserver=jest.fn(callback=>{notify=callback;return {observe:jest.fn(),disconnect:jest.fn()};});
 jest.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue();jest.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});
});
afterEach(()=>{act(()=>root.unmount());container.remove();jest.restoreAllMocks();reduce=false;});
test('no video source until visible, muted inline autoplay and pause outside viewport',()=>{
 act(()=>root.render(<ChangelogMedia media={media}/>));const video=container.querySelector('video');expect(video.hasAttribute('src')).toBe(false);expect(video.muted).toBe(true);expect(video.hasAttribute('playsinline')).toBe(true);
 act(()=>notify([{isIntersecting:true,intersectionRatio:1}]));expect(video.getAttribute('src')).toBe('/changelog/media/demo.mp4');expect(video.play).toHaveBeenCalled();
 Object.defineProperty(video,'paused',{configurable:true,value:false});
 act(()=>notify([{isIntersecting:false,intersectionRatio:0}]));expect(video.pause).toHaveBeenCalled();
});
test('reduced motion keeps a poster until explicit playback; equivalent text remains available',()=>{
 reduce=true;act(()=>root.render(<ChangelogMedia media={media}/>));act(()=>notify([{isIntersecting:true,intersectionRatio:1}]));expect(container.querySelector('video').hasAttribute('src')).toBe(false);
 act(()=>container.querySelector('button').click());expect(container.querySelector('video').play).toHaveBeenCalled();expect(container.querySelector('details').textContent).toContain(media.transcript);
});
test('failed video has a readable fallback and no broken repeated playback control',()=>{
 act(()=>root.render(<ChangelogMedia media={media}/>));act(()=>container.querySelector('video').dispatchEvent(new Event('error')));expect(container.querySelector('[role="status"]').textContent).toContain('Video unavailable');expect(container.querySelector('img').alt).toBe(media.caption);
});
test('Save-Data prevents automatic loading',()=>{
 Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true}});
 act(()=>root.render(<ChangelogMedia media={media}/>));act(()=>notify([{isIntersecting:true,intersectionRatio:1}]));
 expect(container.querySelector('video').hasAttribute('src')).toBe(false);
 Object.defineProperty(navigator,'connection',{configurable:true,value:undefined});
});
test('a viewer’s pause is respected when the clip re-enters the viewport',()=>{
 act(()=>root.render(<ChangelogMedia media={media}/>));act(()=>notify([{isIntersecting:true,intersectionRatio:1}]));
 const v=container.querySelector('video');act(()=>v.dispatchEvent(new Event('pause')));v.play.mockClear();
 act(()=>notify([{isIntersecting:false,intersectionRatio:0}]));act(()=>notify([{isIntersecting:true,intersectionRatio:1}]));
 expect(v.play).not.toHaveBeenCalled();
});
