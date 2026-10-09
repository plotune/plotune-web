/* Serve a built SPA locally for fixture-only browser checks. */
const fs=require('fs'),http=require('http'),path=require('path');
const root=path.resolve(process.env.QA_BUILD||'build');
http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(!path.extname(file))file=path.join(file,'index.html');if(!fs.existsSync(file))file=path.join(root,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)}).listen(Number(process.env.QA_PORT)||4184,'127.0.0.1',()=>console.log('Local QA server ready'));
