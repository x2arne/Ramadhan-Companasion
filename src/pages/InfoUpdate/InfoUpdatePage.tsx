import React from 'react';
import { updates } from '../../data/updates';

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export const InfoUpdatePage: React.FC = () => (
  <div className="space-y-8">
    <header>
      <h1 className="text-3xl font-semibold text-ink-100">Info Update</h1>
      <p className="mt-2 max-w-prose text-base text-ink-300">Catatan pembaruan Ramadan Companion, dari yang terbaru.</p>
    </header>

    <ol className="divide-y divide-ink-700 border-y border-ink-700">
      {updates.map((u, i) => (
        <li key={`${u.date}-${u.title}`} className="py-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <time dateTime={u.date} className="text-sm tabular-nums text-ink-400">
              {formatDate(u.date)}
            </time>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                u.tag === 'Baru' ? 'bg-accent-400/20 text-accent-800' : 'bg-ink-800 text-ink-300'
              }`}
            >
              {u.tag}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-ink-100">{u.title}</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base text-ink-200 marker:text-accent-600">
            {u.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </div>
);

export default InfoUpdatePage;
