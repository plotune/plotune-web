import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Seo from '../components/Seo';
import { buildBenchmarkView, buildScatterChart, formatMetricValue as format, metricDefinitions, rankMetricRows } from './content/benchmark';
import ScatterMetricChart from '../components/research/ScatterMetricChart';
import './ResearchExplorer.css';

const metrics = ['performance', 'cost', 'latency'];
const labels = { performance: 'Validation index', cost: 'Cost per task', latency: 'Time per task' };
const symbols = { performance: '↗', cost: '$', latency: '◷' };
const taskLabel = (task) => task === 'All tasks' ? 'All workflows' : task;
const workflowDescriptions = {
  'All tasks': 'The full benchmark, with validation scores averaged across all six engineering workflows.',
  'Industrial data analysis': 'Compare model validation scores for industrial data analysis workflows.',
  'Automated test flows': 'Compare model validation scores for automated test workflows.',
  'Calibration & software': 'Compare model validation scores for calibration and software workflows.',
  'Real-time stream validation': 'Compare model validation scores for real-time stream validation workflows.',
  'Safety & evidence': 'Compare model validation scores for safety and evidence workflows.',
  'V-cycle': 'Compare model validation scores for engineering V-cycle workflows.',
};

const ResearchOverview = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const allTasks = useMemo(() => buildBenchmarkView().taskGroups, []);
  const task = allTasks.includes(params.get('task')) ? params.get('task') : 'All tasks';
  const metric = metrics.includes(params.get('metric')) ? params.get('metric') : 'performance';
  const landscape = params.get('landscape') === 'latency' ? 'latency' : 'cost';
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const view = useMemo(() => buildBenchmarkView({ taskGroup: task }), [task]);
  const ranked = useMemo(() => rankMetricRows(view.rows, metric, 13), [view, metric]);
  const scatter = useMemo(() => buildScatterChart(view.rows, landscape, 'performance'), [view, landscape]);
  const config = metricDefinitions[metric];
  const best = ranked[0];
  const max = Math.max(...ranked.map(row => row[config.key]));
  const transition = { duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] };
  const update = (changes) => {
    const next = new URLSearchParams(params);
    next.delete('page');
    Object.entries(changes).forEach(([key, value]) => value === 'All tasks' ? next.delete(key) : next.set(key, value));
    // Preserve the explorer anchor: the site's route scroll handler watches hash changes.
    navigate({ search: next.toString(), hash: location.hash }, { preventScrollReset: true });
  };

  return <>
    <Seo title="Agentic Test & Validation | Plotune Research" description="Explore Plotune's final agentic engineering benchmark. Compare model performance, cost, and task duration across six workflows." path="/research" />
    <section className="research-page explorer-page">
      <header className="explorer-hero">
        <div className="explorer-edition"><span><i /> Final benchmark · v1.0</span><span>20 Sep 2026</span></div>
        <div className="explorer-hero-grid"><div><span className="section-label">Engineering intelligence, measured.</span><h1>How well do agents<br />handle the real work?</h1><p>Agentic Test &amp; Validation. Explore the performance, cost, and speed of AI models across engineering workflows.</p></div><div className="explorer-index"><strong>13<span>models</span></strong><strong>06<span>workflows</span></strong><Link to="/research/methodology">Inside the benchmark <span aria-hidden="true">↗</span></Link></div></div>
        <a className="explorer-jump" href="#benchmark-explorer">Explore the benchmark <span aria-hidden="true">↓</span></a>
      </header>

      <section id="benchmark-explorer" className="explorer-workspace" aria-labelledby="explorer-title">
        <div className="explorer-section-heading"><div><span className="section-label">01 / Explore the benchmark</span><h2 id="explorer-title">Find the right tradeoff.</h2></div><p>Choose a workflow, then a measure. <br />Select any model to see its breakdown.</p></div>
        <div className="explorer-workflows" role="group" aria-label="Filter by workflow">
          {allTasks.map((item) => <button key={item} aria-pressed={task === item} aria-controls="workflow-results" onClick={() => update({ task: item })} className={task === item ? 'selected' : ''}><span aria-hidden="true">{task === item ? '✓' : '+'}</span>{taskLabel(item)}</button>)}
        </div>
        <motion.div key={task} id="workflow-results" className="explorer-workflow-scene" role="region" aria-labelledby="workflow-scene-title" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}>
        <header className="explorer-workflow-context">
          <span className="explorer-workflow-number" aria-hidden="true">{task === 'All tasks' ? '∑' : String(allTasks.indexOf(task)).padStart(2, '0')}</span>
          <div><span className="section-label">{task === 'All tasks' ? 'Benchmark overview' : `Workflow ${String(allTasks.indexOf(task)).padStart(2, '0')} / 06`}</span><h3 id="workflow-scene-title">{taskLabel(task)}</h3><p>{workflowDescriptions[task]}</p></div>
        </header>
        <div className="explorer-metric-grid" role="group" aria-label="Rank models by">
          {metrics.map(key => {
            const leader = rankMetricRows(view.rows, key, 1)[0];
            return <button key={key} className={`explorer-metric ${metric === key ? 'selected' : ''}`} aria-pressed={metric === key} onClick={() => update({ metric: key })} aria-controls="explorer-ranking">
              <span className="explorer-metric-top"><span><i aria-hidden="true">{symbols[key]}</i>{labels[key]}</span><span className="explorer-radio" aria-hidden="true">{metric === key ? '●' : '○'}</span></span>
              <strong>{format(leader[metricDefinitions[key].key], key)}<small>{key === 'performance' ? ' / 100' : ' / task'}</small></strong>
              <span className="explorer-leader">{leader.modelName}<span>{key === 'performance' ? 'Highest score' : key === 'cost' ? 'Lowest cost' : 'Fastest'}</span></span>
              <span className="explorer-metric-action">{metric === key ? 'Viewing ranking' : 'View ranking'} <span aria-hidden="true">{metric === key ? '✓' : '↗'}</span></span>
            </button>;
          })}
        </div>
        <div className="explorer-ranking" id="explorer-ranking">
          <div className="explorer-ranking-header"><div><span className="section-label">{taskLabel(task)}</span><h3>Ranked by {labels[metric].toLowerCase()}</h3></div><span className="explorer-direction">{config.higher ? '↑ Higher is better' : '↓ Lower is better'}</span></div>
          <div className="explorer-feedback" role="status" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.p key={`${task}-${metric}`} initial={{ opacity: 0, y: reduceMotion ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition}><span aria-hidden="true">✓</span> Showing {showAll ? '13' : '7'} of 13 models · {taskLabel(task)} · {labels[metric]}{task !== 'All tasks' && metric !== 'performance' ? ' · Cost and time are benchmark-wide averages.' : ''}</motion.p></AnimatePresence></div>
          <div className="explorer-rank-columns" aria-hidden="true"><span>Model / provider</span><span>{labels[metric]}</span></div>
          <motion.div layout={!reduceMotion} transition={transition} className="explorer-rank-list">
            {ranked.slice(0, showAll ? 13 : 7).map((row, index) => <motion.div layout={!reduceMotion} transition={transition} className={`explorer-model ${expanded === row.model ? 'is-expanded' : ''}`} key={row.model}>
              <button className="explorer-model-toggle" onClick={() => setExpanded(expanded === row.model ? null : row.model)} aria-expanded={expanded === row.model} aria-controls={`model-detail-${view.rows.findIndex(item => item.model === row.model)}`}>
                <span className={`explorer-position ${index === 0 ? 'first' : ''}`}>{String(index + 1).padStart(2, '0')}</span>
                <span className="explorer-model-name"><b>{row.modelName}</b><small><i style={{ background: row.color }} />{row.provider}</small></span>
                <span className="explorer-bar" aria-hidden="true"><motion.i initial={reduceMotion ? false : { width: 0 }} animate={{ width: `${max ? (row[config.key] / max) * 100 : 0}%` }} transition={{ ...transition, delay: reduceMotion ? 0 : index * 0.025 }} style={{ background: row.color }} /></span>
                <motion.strong key={`${metric}-${row[config.key]}`} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={transition}>{format(row[config.key], metric)}</motion.strong>
                <span className="explorer-expand" aria-hidden="true">{expanded === row.model ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>{expanded === row.model && <motion.div id={`model-detail-${view.rows.findIndex(item => item.model === row.model)}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={transition} className="explorer-model-detail">
                <div className="explorer-detail-inner"><div className="explorer-model-measures">{metrics.map(key => <div key={key}><span>{labels[key]}</span><strong>{format(row[metricDefinitions[key].key], key)}</strong><small>{key === 'performance' ? taskLabel(task) : 'Benchmark-wide average'}</small></div>)}</div>
                <h4>Validation index by workflow</h4><div className="explorer-task-scores">{allTasks.slice(1).map((name, i) => <div key={name} className={task === name ? 'current' : ''}><span>{name}</span><b>{row.scores[i].toFixed(1)}</b><i aria-hidden="true"><span style={{ width: `${row.scores[i]}%` }} /></i></div>)}</div></div>
              </motion.div>}</AnimatePresence>
            </motion.div>)}
          </motion.div>
          <button className="explorer-show-all" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? 'Show top 7 models' : 'Show all 13 models'} <span aria-hidden="true">{showAll ? '↑' : '↓'}</span></button>
          <p className="explorer-footnote">{metric === 'performance' ? 'Category-normalized validation index. Equal scores share the same performance; ordering does not break ties.' : `Bars show actual ${metric === 'cost' ? 'cost' : 'duration'}. Shorter bars are better.`} <Link to="/research/methodology">How we measure ↗</Link></p>
        </div>
        <aside className="explorer-takeaway"><span className="section-label">Reading the results</span><p><b>{best.modelName}</b>{metric === 'performance' ? ' shares or holds the highest validation index' : metric === 'cost' ? ' has the lowest average cost per task' : ' has the shortest average task duration'}{metric === 'performance' ? ` for ${taskLabel(task).toLowerCase()}` : ' in this benchmark'}. Open a model above to compare its strengths across all six workflows.</p></aside>
        </motion.div>
      </section>

      <section className="explorer-landscape" aria-labelledby="landscape-title"><div className="explorer-section-heading"><div><span className="section-label">02 / The bigger picture</span><h2 id="landscape-title">Performance landscape</h2></div><p>What does better performance cost? <br />Explore where each model lands.</p></div>
        <div className="explorer-landscape-toolbar"><div className="explorer-segment" role="group" aria-label="Compare performance against">{['cost', 'latency'].map(key => <button aria-pressed={landscape === key} key={key} onClick={() => update({ landscape: key })} className={landscape === key ? 'selected' : ''}>Performance vs {key === 'cost' ? 'cost' : 'time'} {landscape === key && <span aria-hidden="true">✓</span>}</button>)}</div><span>{taskLabel(task)}</span></div>
        <div key={`${task}-${landscape}`} className="explorer-chart-enter"><ScatterMetricChart chart={scatter} label={`Performance versus ${metricDefinitions[landscape].label}, one point per model`} /></div>
        <p className="explorer-chart-tip">Hover or tap a point for model details. Tap a provider in the legend to hide or show its models.</p>
        <details className="chart-explainer"><summary><b>How to read this chart</b><i>+</i></summary><p>Each point is one model, colored by provider. Higher and further left is better. The dotted Pareto frontier connects models where no other model scores at least as well on both axes and strictly better on one. The shaded corner marks a strong combination of performance and {landscape === 'cost' ? 'cost' : 'speed'}. Cost and time are benchmark-wide averages; the workflow filter changes the validation index.</p></details>
      </section>
      <div className="explorer-onward"><div><span className="section-label">Beyond the numbers</span><h2>Understand the work behind the results.</h2></div><Link to="/research/reports">Read the latest report <span aria-hidden="true">↗</span></Link><Link to="/research/methodology">Explore the methodology <span aria-hidden="true">↗</span></Link></div>
    </section>
  </>;
};
export default ResearchOverview;
