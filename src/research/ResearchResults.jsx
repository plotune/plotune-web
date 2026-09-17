import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { buildBenchmarkView } from './content/benchmark';

const PAGE_SIZE = 7;
const format = (value, kind) => kind === 'cost' ? `$${value.toFixed(3)}` : kind === 'time' ? `${value.toFixed(1)} min` : kind === 'reliability' ? `${value.toFixed(1)}%` : value.toFixed(1);
const ResearchResults = () => {
  const [params, setParams] = useSearchParams();
  const task = params.get('task') || 'All tasks';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const view = useMemo(() => buildBenchmarkView({ taskGroup: task, sort: 'performance' }), [task]);
  const pageCount = Math.ceil(view.rows.length / PAGE_SIZE);
  const rows = view.rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const setPage = (next) => { const query = new URLSearchParams(params); next > 1 ? query.set('page', next) : query.delete('page'); setParams(query); };
  return <section className="research-page results-page"><Seo title="Model Results | Plotune Research" description="Model results for the Agentic Test and Validation benchmark." path="/research/results" /><header className="page-heading"><span className="section-label">Results</span><h1>Model results</h1><p>Seven models per page, with all core measures visible without opening a dense dashboard table.</p></header><div className="result-page-layout"><aside className="results-context"><span className="section-label">Current view</span><strong>{task === 'All tasks' ? 'Overall index' : task}</strong><Link to={`/research?${params.toString()}`}>Return to benchmark</Link></aside><div><div className="result-card-grid">{rows.map((row) => <article className="model-result-card" key={row.model}><header><span className="rank-chip">#{row.rank}</span><i style={{ backgroundColor: row.color }} /><div><h2>{row.modelName}</h2><p>{row.provider}</p></div></header><div className="result-measures"><span><small>Score</small><b>{format(row.score, 'score')}</b></span><span><small>Cost / task</small><b>{format(row.cost, 'cost')}</b></span><span><small>Time / task</small><b>{format(row.time, 'time')}</b></span><span><small>Reliability</small><b>{format(row.reliability, 'reliability')}</b></span></div></article>)}</div><nav className="pagination" aria-label="Results pages">{Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <button key={item} className={item === page ? 'active' : ''} onClick={() => setPage(item)}>{item}</button>)}</nav></div></div></section>;
};
export default ResearchResults;
