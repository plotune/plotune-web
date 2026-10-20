import React,{act} from 'react';import {createRoot} from 'react-dom/client';import {HelmetProvider} from 'react-helmet-async';import Changelog from './Changelog';
let mockSlug;const mockLoad=jest.fn();
jest.mock('react-router-dom',()=>({Link:({to,children,...props})=><a href={to} {...props}>{children}</a>,useParams:()=>({slug:mockSlug})}));
jest.mock('./catalog',()=>({editions:[{slug:'2026-10-12',weekStart:'2026-10-12',publishedAt:'2026-10-19',title:'A useful update',summary:'Practical improvements.',products:['Nexus'],sections:[{title:'Technical behavior',id:'technical-behavior'}],media:[{id:'selection',kind:'diagram',caption:'Selection flow'}],load:(...args)=>mockLoad(...args)}]}));
jest.mock('./ChangelogMedia',()=>({media})=><figure data-media={media.id}>{media.caption}</figure>);
let container,root;beforeEach(()=>{container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);mockSlug=undefined;mockLoad.mockReset().mockResolvedValue({default:()=> <p>Technical instructions</p>});});afterEach(()=>{act(()=>root.unmount());container.remove();});
const render=()=>act(async()=>root.render(<HelmetProvider><Changelog/></HelmetProvider>));
test('latest edition opens directly with edition navigation',async()=>{await render();expect(container.querySelector('h1').textContent).toBe('A useful update');expect(container.textContent).toContain('12 October 2026');expect(container.querySelector('video')).toBeNull();expect(container.querySelector('a[href="/changelog/2026-10-12"]')).toBeTruthy();});
test('unknown editions have a clear way back and noindex metadata',async()=>{mockSlug='missing';await render();expect(container.textContent).toContain('We couldn’t find that edition.');expect(container.querySelector('a[href="/changelog"]')).toBeTruthy();});
test('failed content load can be retried without a reload',async()=>{mockSlug='2026-10-12';mockLoad.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({default:()=> <p>Confirmed edition content</p>});await render();expect(container.querySelector('[role="alert"]')).toBeTruthy();await act(async()=>container.querySelector('button').click());expect(container.textContent).toContain('Confirmed edition content');expect(container.querySelector('[role="alert"]')).toBeNull();});

test('technical sections have contents anchors and reviewed media render in context',async()=>{
 mockLoad.mockResolvedValue({default:({components})=>{const H=components.h2,P=components.p;return <><H>Technical behavior</H><P>Explain the selection.</P><P>{':::media selection'}</P><P>Describe the next step.</P></>;}});
 await render();
 expect(container.querySelector('a[href="#technical-behavior"]')).toBeTruthy();
 expect(container.querySelector('h2').id).toBe('technical-behavior');
 const figure=container.querySelector('figure');expect(figure.dataset.media).toBe('selection');
 expect(figure.previousElementSibling.textContent).toBe('Explain the selection.');
 expect(figure.nextElementSibling.textContent).toBe('Describe the next step.');
 expect(container.textContent).not.toContain(':::media');
});
