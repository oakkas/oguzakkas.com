import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { experiences, earlierExperiences } from '../data/profile';

// The four areas I work across, how they connect, and which roles covered each.
// A role covers an area when its technologies or description mention one of the
// area's terms, so the map follows data/profile.ts. The colors are Tailwind's
// 600 steps, checked as a set for color-blind separation in both themes.

type AreaId = 'data' | 'pipelines' | 'ml' | 'platform';

const areas: { id: AreaId; name: string; short: string; summary: string; dot: string; fill: string; ring: string; terms: string[] }[] = [
  {
    id: 'data',
    name: 'Data',
    short: 'Data',
    summary: 'Lakes, warehouses, labeling, and analysis',
    dot: 'bg-sky-600',
    fill: 'fill-sky-600',
    ring: 'ring-sky-600/50',
    terms: ['s3', 'redshift', 'postgresql', 'databricks', 'pandas', 'sas', 'cloud analytics', 'ground truth', 'data lake', 'data warehouse', 'data labeling', 'eda', 'wrangled data', 'epidemiolog'],
  },
  {
    id: 'pipelines',
    name: 'Data pipelines',
    short: 'Pipe­lines', // soft hyphen, so the narrow table header can break it
    summary: 'ETL, extraction, and orchestration',
    dot: 'bg-orange-600',
    fill: 'fill-orange-600',
    ring: 'ring-orange-600/50',
    terms: ['etl', 'pipeline', 'extraction', 'airflow', 'spark', 'pyspark', 'prefect', 'aws batch'],
  },
  {
    id: 'ml',
    name: 'AI / ML',
    short: 'AI / ML',
    summary: 'LLMs, NLP, deep learning, and computer vision',
    dot: 'bg-emerald-600',
    fill: 'fill-emerald-600',
    ring: 'ring-emerald-600/50',
    terms: ['llm', 'gpt', 'openai', 'gemini', 'anthropic', 'bedrock', 'langchain', 'pytorch', 'huggingface', 'sklearn', 'tensorflow', 'keras', 'gensim', 'nlp', 'machine learning', 'deep learning', 'computer vision', 'data science', 'conversational', 'model'],
  },
  {
    id: 'platform',
    name: 'Platform & infrastructure',
    short: 'Platform',
    summary: 'Cloud, infrastructure as code, CI/CD, and MLOps under the other three',
    dot: 'bg-violet-600',
    fill: 'fill-violet-600',
    ring: 'ring-violet-600/50',
    terms: ['terraform', 'docker', 'kubernetes', 'github actions', 'ci/cd', 'sagemaker', 'lambda', 'aws batch', 'mlops', 'platform', 'gcp', 'google cloud', 'deploy'],
  },
];
const areaById = Object.fromEntries(areas.map(area => [area.id, area])) as Record<AreaId, (typeof areas)[number]>;
const flowAreas = areas.filter(area => area.id !== 'platform');

// Matches a term at the start of a word, so "llm" finds "LLMs" but "eda" skips "pedal"
const patterns = Object.fromEntries(
  areas.map(area => [area.id, new RegExp(`\\b(?:${area.terms.map(term => term.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).join('|')})`, 'i')])
) as Record<AreaId, RegExp>;

const sentences = (text: string) => text.split(/(?<=\.)\s+(?=[A-Z])/);

const years = (date: string) => {
  const [from, to] = date.split('—').map(part => part.match(/\d{4}/)?.[0] ?? 'now');
  return { start: Number(from), years: from === to ? from : `${from} – ${to}` };
};

type Evidence = { tools: string[]; work: string[]; covered: boolean };

const roles = [...experiences, ...earlierExperiences].map(role => {
  const lines = sentences(role.description);
  const coverage = Object.fromEntries(
    areas.map(area => {
      const tools = role.technologies.filter(tech => patterns[area.id].test(tech));
      const work = lines.filter(line => patterns[area.id].test(line));
      return [area.id, { tools, work, covered: tools.length + work.length > 0 }];
    })
  ) as Record<AreaId, Evidence>;
  return { title: role.title, company: role.company, ...years(role.date), lines, coverage };
});

const areaStats = Object.fromEntries(
  areas.map(area => {
    const covering = roles.filter(role => role.coverage[area.id].covered);
    return [area.id, { count: covering.length, since: Math.min(...covering.map(role => role.start)) }];
  })
) as Record<AreaId, { count: number; since: number }>;

const allFour = roles.filter(role => areas.every(area => role.coverage[area.id].covered));
const allFourSince = Math.min(...allFour.map(role => role.start));
const everyRoleSince = roles.filter(role => role.start >= allFourSince).length === allFour.length;

type Selection = { area: AreaId } | { role: number } | null;
type Box = { left: number; top: number; right: number; bottom: number; cx: number; cy: number };
type Layout = { width: number; height: number; stacked: boolean; boxes: Record<AreaId, Box> };
type Link = { id: string; from: AreaId; to: AreaId; d: string; length: number };
type Label = { id: string; text: string; style: React.CSSProperties; className: string };

const selectedBg = 'bg-slate-100 dark:bg-slate-700/50';

const CORNER = 10;
const GUTTER = 10; // where the side connectors run when the cards stack

// Connector paths between the measured cards: across on wide screens, down when stacked
const buildLinks = ({ boxes: b, stacked, width }: Layout): { links: Link[]; labels: Label[] } => {
  const flow = (from: AreaId, to: AreaId): Link => {
    const a = b[from], c = b[to];
    return stacked
      ? { id: `${from}-${to}`, from, to, d: `M${a.cx} ${a.bottom} V${c.top}`, length: c.top - a.bottom }
      : { id: `${from}-${to}`, from, to, d: `M${a.right} ${a.cy} H${c.left}`, length: c.left - a.right };
  };

  const ml = b.ml, data = b.data, platform = b.platform;
  let back: Link;
  if (stacked) {
    const x = width - GUTTER;
    back = {
      id: 'ml-data', from: 'ml', to: 'data', length: 2 * (x - ml.right) + (ml.cy - data.cy),
      d: `M${ml.right} ${ml.cy} H${x - CORNER} Q${x} ${ml.cy} ${x} ${ml.cy - CORNER} V${data.cy + CORNER} Q${x} ${data.cy} ${x - CORNER} ${data.cy} H${data.right}`,
    };
  } else {
    const y = data.top - 28;
    back = {
      id: 'ml-data', from: 'ml', to: 'data', length: 2 * (data.top - y) + (ml.cx - data.cx),
      d: `M${ml.cx} ${ml.top} V${y + CORNER} Q${ml.cx} ${y} ${ml.cx - CORNER} ${y} H${data.cx + CORNER} Q${data.cx} ${y} ${data.cx} ${y + CORNER} V${data.top}`,
    };
  }

  const support = flowAreas.map(({ id }): Link => {
    const c = b[id];
    return stacked
      ? {
          id: `platform-${id}`, from: 'platform', to: id, length: platform.cy - c.cy + 2 * (platform.left - GUTTER),
          d: `M${platform.left} ${platform.cy} H${GUTTER + CORNER} Q${GUTTER} ${platform.cy} ${GUTTER} ${platform.cy - CORNER} V${c.cy + CORNER} Q${GUTTER} ${c.cy} ${GUTTER + CORNER} ${c.cy} H${c.left}`,
        }
      : { id: `platform-${id}`, from: 'platform', to: id, d: `M${c.cx} ${platform.top} V${c.bottom}`, length: platform.top - c.bottom };
  });

  const flowLabel = (from: AreaId, to: AreaId, text: string): Label => {
    const a = b[from], c = b[to];
    return stacked
      ? { id: `${from}-${to}`, text, className: 'text-left whitespace-nowrap', style: { left: a.cx + 10, top: (a.bottom + c.top) / 2, transform: 'translateY(-50%)' } }
      : { id: `${from}-${to}`, text, className: 'text-center', style: { left: (a.right + c.left) / 2, top: a.cy - 6, width: c.left - a.right - 8, transform: 'translate(-50%, -100%)' } };
  };
  const backText = 'Predictions and extracted fields flow back';

  return {
    links: [flow('data', 'pipelines'), flow('pipelines', 'ml'), back, ...support],
    labels: [
      flowLabel('data', 'pipelines', 'raw data'),
      flowLabel('pipelines', 'ml', 'training data'),
      stacked
        ? { id: 'ml-data', text: backText, className: 'text-right', style: { right: GUTTER + 8, top: ml.bottom + 8, maxWidth: '70%' } }
        : { id: 'ml-data', text: backText, className: 'text-center whitespace-nowrap', style: { left: (data.cx + ml.cx) / 2, top: data.top - 32, transform: 'translate(-50%, -100%)' } },
    ],
  };
};

const AreaDot: React.FC<{ area: (typeof areas)[number]; size?: string }> = ({ area, size = 'h-2.5 w-2.5' }) => (
  <span className={`inline-block shrink-0 rounded-full ${size} ${area.dot}`} aria-hidden="true"></span>
);

const ExperienceMap: React.FC = () => {
  const [selection, setSelection] = useState<Selection>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRefs = useRef<Partial<Record<AreaId, HTMLButtonElement | null>>>({});
  const reduceMotion = useReducedMotion();
  const markerId = useId().replace(/[^\w-]/g, '');

  useLayoutEffect(() => {
    const root = diagramRef.current;
    if (!root) return;
    const measure = () => {
      const base = root.getBoundingClientRect();
      const boxes = {} as Record<AreaId, Box>;
      for (const area of areas) {
        const rect = cardRefs.current[area.id]!.getBoundingClientRect();
        const left = rect.left - base.left, top = rect.top - base.top;
        boxes[area.id] = { left, top, right: left + rect.width, bottom: top + rect.height, cx: left + rect.width / 2, cy: top + rect.height / 2 };
      }
      setLayout({ width: base.width, height: base.height, stacked: boxes.pipelines.top >= boxes.data.bottom, boxes });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    for (const area of areas) observer.observe(cardRefs.current[area.id]!);
    return () => observer.disconnect();
  }, []);

  // Stop the flowing dots while the diagram is off screen
  useEffect(() => {
    const root = diagramRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) svgRef.current?.unpauseAnimations();
      else svgRef.current?.pauseAnimations();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [layout !== null]);

  const selectedArea = selection && 'area' in selection ? selection.area : null;
  const selectedRole = selection && 'role' in selection ? selection.role : null;
  const isActive = (id: AreaId) =>
    selectedArea ? selectedArea === id : selectedRole !== null ? roles[selectedRole].coverage[id].covered : true;
  const isLit = (link: Link) =>
    selectedArea ? link.from === selectedArea || link.to === selectedArea : isActive(link.from) && isActive(link.to);

  const toggleArea = (id: AreaId) => setSelection(selectedArea === id ? null : { area: id });
  const toggleRole = (index: number) => setSelection(selectedRole === index ? null : { role: index });

  const { links, labels } = layout ? buildLinks(layout) : { links: [], labels: [] };

  let status: string;
  if (selectedArea) {
    const stats = areaStats[selectedArea];
    status = `${areaById[selectedArea].name}: ${stats.count} of ${roles.length} roles, since ${stats.since}.`;
  } else if (selectedRole !== null) {
    const role = roles[selectedRole];
    const count = areas.filter(area => role.coverage[area.id].covered).length;
    status = `${role.company}, ${role.title}: ${count} of ${areas.length} areas.`;
  } else {
    status = everyRoleSince
      ? `All four areas in every role since ${allFourSince}. Select an area or a role to see the work behind it.`
      : `All four areas in ${allFour.length} roles. Select an area or a role to see the work behind it.`;
  }

  const card = (area: (typeof areas)[number], wide = false) => {
    const stats = areaStats[area.id];
    const selected = selectedArea === area.id;
    return (
      <button
        key={area.id}
        ref={element => { cardRefs.current[area.id] = element; }}
        type="button"
        aria-pressed={selected}
        onClick={() => toggleArea(area.id)}
        className={`relative flex w-full flex-col rounded-xl border bg-white p-4 text-left shadow-xs transition dark:bg-slate-800 ${
          selected
            ? `border-slate-400 ring-2 ring-offset-2 ring-offset-white dark:border-slate-500 dark:ring-offset-slate-900 ${area.ring}`
            : 'border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500'
        } ${isActive(area.id) ? '' : 'opacity-40'} ${wide ? 'sm:flex-row sm:items-center sm:justify-between sm:gap-6' : ''}`}
      >
        <span className="block">
          <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <AreaDot area={area} />
            {area.name}
          </span>
          <span className="mt-1 block text-xs leading-snug text-slate-500 dark:text-slate-400">{area.summary}</span>
        </span>
        <span className={`block pt-3 text-xs font-medium text-slate-700 dark:text-slate-300 ${wide ? 'sm:shrink-0 sm:pt-0' : 'mt-auto'}`}>
          {stats.count} of {roles.length} roles · since {stats.since}
        </span>
      </button>
    );
  };

  return (
    <section id="experience-map" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Experience map">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">Experience map</h2>
      </div>
      <p className="mb-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
        I work across four areas that depend on each other. Data moves through pipelines into models, results flow back into the data,
        and the platform underneath runs all of it.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-sky-50 px-0.5 py-6 shadow-sm sm:px-8 sm:pb-8 sm:pt-4 dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div ref={diagramRef} className="relative px-7 sm:px-0 sm:pt-14">
          {layout && (
            <>
              <svg ref={svgRef} className="pointer-events-none absolute inset-0 overflow-visible" width={layout.width} height={layout.height} aria-hidden="true">
                <defs>
                  {(['lit', 'dim'] as const).map(kind => (
                    <marker
                      key={kind}
                      id={`${markerId}-${kind}`}
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="7"
                      markerHeight="7"
                      orient="auto"
                      className={kind === 'lit' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-200 dark:text-slate-700'}
                    >
                      <path d="M0 1 L10 5 L0 9 z" fill="currentColor" />
                    </marker>
                  ))}
                </defs>
                {links.map(link => {
                  const lit = isLit(link);
                  const duration = Math.max(1.4, link.length / 60);
                  return (
                    <g key={link.id}>
                      <path
                        d={link.d}
                        fill="none"
                        strokeWidth="1.5"
                        className={`transition-colors ${lit ? 'stroke-slate-400 dark:stroke-slate-500' : 'stroke-slate-200 dark:stroke-slate-700'}`}
                        markerEnd={`url(#${markerId}-${lit ? 'lit' : 'dim'})`}
                      />
                      {lit && !reduceMotion && [0, 1].map(i => (
                        <circle key={`${i}-${link.d}`} r="3.5" strokeWidth="1.5" className={`${areaById[link.from].fill} stroke-white dark:stroke-slate-900`}>
                          <animateMotion dur={`${duration}s`} begin={`${(-i * duration) / 2}s`} repeatCount="indefinite" path={link.d} />
                        </circle>
                      ))}
                    </g>
                  );
                })}
              </svg>
              {labels.map(label => (
                <span
                  key={label.id}
                  className={`pointer-events-none absolute text-[11px] leading-tight text-slate-500 dark:text-slate-400 ${label.className}`}
                  style={label.style}
                  aria-hidden="true"
                >
                  {label.text}
                </span>
              ))}
            </>
          )}

          <div className="relative grid gap-12 sm:grid-cols-3 sm:gap-16 xl:gap-24">{flowAreas.map(area => card(area))}</div>
          <div className="relative mt-20 sm:mt-14">{card(areaById.platform, true)}</div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">{status}</p>
        {selection && (
          <button type="button" onClick={() => setSelection(null)} className="text-sm font-semibold text-sky-700 hover:underline dark:text-sky-300">
            Show all
          </button>
        )}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-800/50">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Areas each role covered, newest role first. Select a role or an area to see the work behind it.</caption>
          <thead>
            <tr>
              <th scope="col" className="px-3 py-2 align-bottom text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4 dark:text-slate-400">Role</th>
              {areas.map(area => (
                <th key={area.id} scope="col" className={`w-12 px-0 py-1.5 align-bottom sm:w-24 ${selectedArea === area.id ? selectedBg : ''}`}>
                  <button
                    type="button"
                    aria-pressed={selectedArea === area.id}
                    aria-label={area.name}
                    onClick={() => toggleArea(area.id)}
                    className="mx-auto flex w-full flex-col items-center gap-1 rounded-md px-0.5 py-1 text-[10px] font-semibold leading-tight text-slate-600 hover:text-slate-900 sm:text-xs dark:text-slate-300 dark:hover:text-white"
                  >
                    <AreaDot area={area} />
                    <span aria-hidden="true">{area.short}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => {
              const isSelected = selectedRole === index;
              const dim = (selectedArea && !role.coverage[selectedArea].covered) || (selectedRole !== null && !isSelected);
              const showWork = isSelected || (selectedArea !== null && role.coverage[selectedArea].covered);
              return (
                <React.Fragment key={`${role.company}-${role.years}`}>
                  <tr className={`border-t border-slate-200/80 transition-opacity dark:border-slate-700/70 ${dim ? 'opacity-40' : ''} ${isSelected ? selectedBg : ''}`}>
                    <th scope="row" className="p-0 font-normal">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleRole(index)}
                        className={`block w-full px-3 py-2.5 text-left transition-colors sm:px-4 ${isSelected ? '' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                      >
                        <span className="block font-medium leading-snug text-slate-900 dark:text-slate-100">{role.company}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          {role.years}
                          <span className="hidden sm:inline"> · {role.title}</span>
                        </span>
                      </button>
                    </th>
                    {areas.map(area => {
                      const evidence = role.coverage[area.id];
                      return (
                        <td
                          key={area.id}
                          className={`text-center ${selectedArea === area.id ? selectedBg : ''}`}
                          title={evidence.covered ? `${area.name}: ${(evidence.tools.length ? evidence.tools : evidence.work).join(', ')}` : `${area.name}: not in this role`}
                        >
                          {evidence.covered ? (
                            <AreaDot area={area} size="h-3.5 w-3.5" />
                          ) : (
                            <span className="inline-block h-0.5 w-3 rounded-full bg-slate-300 align-middle dark:bg-slate-600" aria-hidden="true"></span>
                          )}
                          <span className="sr-only">
                            {evidence.covered ? `Yes${evidence.tools.length ? `: ${evidence.tools.join(', ')}` : ''}` : 'No'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  {showWork && (
                    <tr className={isSelected ? selectedBg : ''}>
                      <td colSpan={areas.length + 1} className="px-3 pb-4 pt-1 sm:px-4">
                        {isSelected ? <RoleWork role={role} /> : <AreaWork evidence={role.coverage[selectedArea!]} />}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 dark:border-slate-700">
              <th scope="row" className="px-3 py-2 text-xs font-semibold text-slate-500 sm:px-4 dark:text-slate-400">Roles</th>
              {areas.map(area => (
                <td key={area.id} className="py-2 text-center text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                  {areaStats[area.id].count}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

// One role's work, each sentence tagged with the areas it touches
const RoleWork: React.FC<{ role: (typeof roles)[number] }> = ({ role }) => (
  <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
    <p className="mb-1 font-medium text-slate-900 sm:hidden dark:text-slate-100">{role.title}</p>
    <ul className="space-y-1.5">
      {role.lines.map(line => (
        <li key={line}>
          {line}{' '}
          <span className="inline-flex flex-wrap gap-x-2 align-baseline">
            {areas.filter(area => patterns[area.id].test(line)).map(area => (
              <span key={area.id} className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <AreaDot area={area} size="h-2 w-2" />
                {area.name}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ul>
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
      {areas.filter(area => role.coverage[area.id].tools.length).map(area => (
        <li key={area.id} className="flex items-baseline gap-1.5">
          <AreaDot area={area} size="h-2 w-2" />
          <span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{area.name}:</span> {role.coverage[area.id].tools.join(', ')}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

// The work behind one area in one role
const AreaWork: React.FC<{ evidence: Evidence }> = ({ evidence }) => (
  <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
    {evidence.work.map(line => <p key={line}>{line}</p>)}
    {evidence.tools.length > 0 && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tools: {evidence.tools.join(', ')}</p>}
  </div>
);

export default ExperienceMap;
