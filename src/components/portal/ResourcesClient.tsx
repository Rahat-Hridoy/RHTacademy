'use client';

import React, { useState } from 'react';
import { ExternalLink, Folder, Grid2X2, List } from 'lucide-react';

interface ResourceFolder {
  id: string;
  name: string;
  created_at: string;
}

interface Resource {
  id: string;
  folder_id: string | null;
  folder_name: string | null;
  subject: string;
  drive_link: string;
  thumbnail_url: string | null;
  note: string | null;
  created_at: string;
}

interface ResourcesClientProps {
  folders: ResourceFolder[];
  resources: Resource[];
}

const FOLDER_COLORS = [
  'bg-blue-50 text-blue-700',
  'bg-teal-50 text-teal-700',
  'bg-indigo-50 text-indigo-700',
  'bg-emerald-50 text-emerald-700',
  'bg-amber-50 text-amber-700',
  'bg-purple-50 text-purple-700',
];

export const ResourcesClient = ({ folders, resources }: ResourcesClientProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // If a folder is selected, show its resources; otherwise show all folders
  const folderResources = selectedFolder
    ? resources.filter((r) => r.folder_id === selectedFolder)
    : [];

  const selectedFolderName = folders.find((f) => f.id === selectedFolder)?.name ?? '';

  // Resources without any folder
  const orphanResources = resources.filter((r) => !r.folder_id);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      {/* Header */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          {selectedFolder ? (
            <>
              <button
                onClick={() => setSelectedFolder(null)}
                className="mb-1 flex items-center gap-1 text-xs font-semibold text-blue-800 hover:underline"
              >
                ← All Folders
              </button>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Folder</p>
              <h2 className="mt-1 text-2xl font-semibold">{selectedFolderName}</h2>
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Your materials</p>
              <h2 className="mt-1 text-2xl font-semibold">Resources</h2>
              <p className="mt-1 text-sm text-slate-500">All resource folders shared with you by your teacher.</p>
            </>
          )}
        </div>
        <div className="flex rounded-lg border border-slate-200 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-800 shadow-sm' : 'text-slate-400'}`}
            aria-label="Grid view"
          >
            <Grid2X2 size={17} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-800 shadow-sm' : 'text-slate-400'}`}
            aria-label="List view"
          >
            <List size={17} />
          </button>
        </div>
      </div>

      {/* Folder view */}
      {!selectedFolder && (
        <>
          {folders.length === 0 && orphanResources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <Folder className="mx-auto text-slate-300" size={40} />
              <h3 className="mt-3 font-semibold text-slate-800">No resources yet</h3>
              <p className="mt-1 text-sm text-slate-500">Your teacher's uploads will appear here.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid gap-5 md:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
              {folders.map((folder, idx) => {
                const colorClass = FOLDER_COLORS[idx % FOLDER_COLORS.length];
                const count = resources.filter((r) => r.folder_id === folder.id).length;
                return (
                  <article
                    key={folder.id}
                    className={`rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}
                  >
                    <div className={`${viewMode === 'grid' ? 'mb-7' : ''} inline-flex rounded-xl p-3 ${colorClass}`}>
                      <Folder size={25} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{folder.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{count} file{count !== 1 ? 's' : ''}</p>
                    </div>
                    <div className={`${viewMode === 'grid' ? 'mt-6' : ''} flex items-center justify-between`}>
                      <button
                        onClick={() => setSelectedFolder(folder.id)}
                        className="rounded-lg bg-blue-800 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900"
                      >
                        Open folder
                      </button>
                    </div>
                  </article>
                );
              })}

              {/* Orphan resources (no folder) shown inline */}
              {orphanResources.map((resource) => (
                <article key={resource.id} className="rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  {resource.thumbnail_url && (
                    <img
                      src={resource.thumbnail_url}
                      alt={resource.subject}
                      className="mb-4 h-28 w-full rounded-xl object-cover"
                    />
                  )}
                  <h3 className="text-lg font-semibold">{resource.subject}</h3>
                  {resource.note && <p className="mt-1 text-sm text-slate-500">{resource.note}</p>}
                  <a
                    href={resource.drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900"
                  >
                    <ExternalLink size={14} /> Open
                  </a>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {/* Folder contents view */}
      {selectedFolder && (
        <>
          {folderResources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <Folder className="mx-auto text-slate-300" size={40} />
              <h3 className="mt-3 font-semibold text-slate-800">No files in this folder</h3>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid gap-5 md:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
              {folderResources.map((resource) => (
                <article
                  key={resource.id}
                  className="rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {resource.thumbnail_url && (
                    <img
                      src={resource.thumbnail_url}
                      alt={resource.subject}
                      className="mb-4 h-28 w-full rounded-xl object-cover"
                    />
                  )}
                  <h3 className="text-base font-semibold">{resource.subject}</h3>
                  {resource.note && (
                    <p className="mt-1 text-sm text-slate-500">{resource.note}</p>
                  )}
                  <a
                    href={resource.drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900"
                  >
                    <ExternalLink size={14} /> Open in Drive
                  </a>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};
