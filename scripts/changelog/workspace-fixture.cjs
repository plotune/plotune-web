// Recording-only HTTP fixtures. Never imported by the product bundle.
const assert=require('node:assert/strict');
async function workspaceFixture(context,origin) {
  const now=new Date().toISOString();
  const project={id:'robot-validation',name:'Robot validation',ownerId:'local-owner',revision:1,keyPrefix:'example',createdAt:now,updatedAt:now};
  const wrap=data=>({id:data.id,kind:'filter',data,revision:1,generation:'local-1',createdAt:now,updatedAt:now});
  const filters=[wrap({id:'real',name:'Real System',conditions:[{path:'environment',operator:'equals',value:'real'}]})];
  const events=Array.from({length:48},(_,i)=>({id:`sample-${i}`,event:'motor.sample',timestamp:new Date(Date.parse(now)-i*10000).toISOString(),properties:{environment:i%2?'simulation':'real',motor:{rpm:1600+i*5,temperature:72+i%10},sw_version:i%3?'v1.4':'v1.3'}}));
  const snapshots=new Map();let sequence=0;
  const calls=[];
  await context.addCookies([{name:'auth_token',value:'local-fixture',url:origin}]);
  await context.route('https://api.plotune.net/**',route=>{
    const pathname=new URL(route.request().url()).pathname;
    if(!['/auth/validate','/profile'].includes(pathname))return route.abort();
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(pathname==='/auth/validate'?{valid:true,username:'Alex'}:{user_id:'local-owner',username:'Alex',full_name:'Alex Engineer'})});
  });
  await context.route('https://stream.plotune.net/**',route=>{
    const req=route.request(),url=new URL(req.url()),p=url.pathname;
    if(req.method()==='OPTIONS')return route.fulfill({status:204});
    assert.equal(req.headers().authorization,'Bearer local-fixture');
    const q=req.postDataJSON()||{};
    calls.push({path:p,method:req.method(),query:q});
    let result;
    if(p==='/v1/projects')result={items:[project]};
    else if(p==='/v1/projects/robot-validation')result={project,membership:{role:'Owner'}};
    else if(p==='/v1/projects/robot-validation/filters')result={items:filters};
    else if(p==='/v1/projects/robot-validation/dashboards')result={items:[]};
    else if(p==='/v1/data/projects/robot-validation/discovery')result={eventNames:['motor.sample'],properties:[{path:'environment',types:['string'],values:['real','simulation']},{path:'motor.rpm',types:['number'],values:[1600,1720]}],deviceIds:[],sessionIds:[],truncated:false};
    else if(p==='/v1/data/projects/robot-validation/events/query') {
      let snapshot,offset,selected;
      if(q.cursor){[snapshot,offset]=q.cursor.split(':').map(Number);selected=snapshots.get(snapshot);assert(selected);}
      else {
        snapshot=++sequence;offset=0;
        const conditions=[...(q.conditions||[]),...(q.filterId?filters.find(f=>f.id===q.filterId).data.conditions:[])];
        selected=events.filter(e=>conditions.every(c=>c.path==='environment' && c.operator==='equals' && e.properties.environment===c.value));
        snapshots.set(snapshot,selected);
      }
      const limit=q.limit||20;
      result={items:selected.slice(offset,offset+limit),now:q.now||now,snapshot,nextCursor:offset+limit<selected.length?`${snapshot}:${offset+limit}`:null};
    } else if(p==='/v1/data/projects/robot-validation/realtime')result={ids:[],cursor:'0',reset:false};
    else throw new Error('Unreviewed recording API request');
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(result)});
  });
  return {calls,matchingCount:24};
}
module.exports={workspaceFixture};
