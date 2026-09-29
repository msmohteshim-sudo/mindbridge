import { useState } from 'react';
import { Plus, Heart, Calendar, Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { MemoryItem } from '../types';

const CATEGORY_CONFIG = {
  photo: { icon: '📸', label: 'Photo', color: 'bg-sky-100 text-sky-700' },
  place: { icon: '📍', label: 'Place', color: 'bg-sage-100 text-sage-700' },
  person: { icon: '👤', label: 'Person', color: 'bg-warm-100 text-warm-700' },
  event: { icon: '🎉', label: 'Event', color: 'bg-lavender-100 text-lavender-700' },
  music: { icon: '🎵', label: 'Music', color: 'bg-amber-100 text-amber-700' },
  story: { icon: '📖', label: 'Story', color: 'bg-rose-100 text-rose-700' },
};

function MemoryCard({ memory, onClick }: { memory: MemoryItem; onClick: () => void }) {
  const config = CATEGORY_CONFIG[memory.category];

  return (
    <button
      onClick={onClick}
      className="card card-hover text-left w-full overflow-hidden p-0"
    >
      {memory.imageUrl && (
        <div className="relative h-44 overflow-hidden rounded-t-3xl">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className={`badge text-xs ${config.color}`}>
              {config.icon} {config.label}
            </span>
          </div>
          {memory.year && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {memory.year}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <h3 className="font-display font-700 text-gray-900 mb-2 text-lg">{memory.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{memory.description}</p>

        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {memory.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
          <span>Added by {memory.uploadedBy}</span>
        </div>
      </div>
    </button>
  );
}

function MemoryDetail({ memory, onClose }: { memory: MemoryItem; onClose: () => void }) {
  const config = CATEGORY_CONFIG[memory.category];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {memory.imageUrl && (
          <div className="relative h-56 overflow-hidden rounded-t-3xl">
            <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className={`badge text-sm mb-2 ${config.color}`}>
                {config.icon} {config.label}
              </span>
              <h2 className="text-2xl font-display font-800 text-gray-900">{memory.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost p-2 min-h-[36px] min-w-[36px]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{memory.description}</p>

          {memory.year && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Year: {memory.year}</span>
            </div>
          )}
          {memory.relationship && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Relationship: {memory.relationship}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-6">
            {memory.tags.map(tag => (
              <span key={tag} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* AI Generated Activity Prompt */}
          <div className="p-4 bg-lavender-50 rounded-2xl border border-lavender-200">
            <p className="text-sm font-700 text-lavender-800 mb-2">💜 AI Memory Activity</p>
            <p className="text-sm text-lavender-700 leading-relaxed">
              {memory.category === 'place'
                ? `"Do you remember visiting this place? What did you love most about it? What sounds, smells, or feelings come to mind?"`
                : memory.category === 'event'
                ? `"This looks like a special occasion! Who was there with you? What was your favourite moment of the day?"`
                : memory.category === 'music'
                ? `"Do you remember this musical gathering? Can you hum the melody that comes to mind?"`
                : `"Look at this wonderful memory. Who are the people you see? What story does this bring to mind?"`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn-primary w-full mt-4"
          >
            Use this in an activity →
          </button>
        </div>
      </div>
    </div>
  );
}

function AddMemoryModal({ onClose, onAdd }: { onClose: () => void; onAdd: (m: MemoryItem) => void }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'photo' as MemoryItem['category'],
    year: '',
    relationship: '',
    tags: '',
  });

  const handleSubmit = () => {
    if (!form.title) return;
    onAdd({
      id: `mem-${Date.now()}`,
      title: form.title,
      description: form.description,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      uploadedBy: 'Priya Sharma',
      uploadedAt: new Date().toISOString().split('T')[0],
      year: form.year ? parseInt(form.year) : undefined,
      relationship: form.relationship || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-800 text-gray-900">Add a Memory</h2>
            <button onClick={onClose} className="btn-ghost p-2 min-h-[36px] min-w-[36px]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-600 text-gray-700 mb-1.5">Memory Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Family reunion in Jaipur"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-600 text-gray-700 mb-1.5">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setForm(f => ({ ...f, category: key as MemoryItem['category'] }))}
                    className={`p-3 rounded-2xl border-2 text-sm font-600 transition-all ${
                      form.category === key
                        ? 'border-sky-400 bg-sky-50 text-sky-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-600 text-gray-700 mb-1.5">Description / Story</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe this memory in detail..."
                className="input-field resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1.5">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  placeholder="e.g. 2018"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1.5">Relationship</label>
                <input
                  type="text"
                  value={form.relationship}
                  onChange={e => setForm(f => ({ ...f, relationship: e.target.value }))}
                  placeholder="e.g. daughter"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-600 text-gray-700 mb-1.5">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="family, celebration, home"
                className="input-field"
              />
            </div>

            <div className="p-4 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-gray-600">
              <strong>📷 Photo upload:</strong> In the full version, you can upload photos directly. For this prototype, add an image URL or leave blank.
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={!form.title}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Memory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MemoryGallery() {
  const { memories, addMemory } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<MemoryItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = memories.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all' || m.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-header">Memory Gallery</h1>
          <p className="section-subheader">यादों की गैलरी · {memories.length} memories</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary py-3 px-5 text-base"
        >
          <Plus className="w-4 h-4" />
          Add Memory
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search memories..."
          className="input-field pl-12"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
        {[{ id: 'all', label: 'All', icon: '✨' }, ...Object.entries(CATEGORY_CONFIG).map(([id, c]) => ({ id, label: c.label, icon: c.icon }))].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-600 transition-all border-2 ${
              filter === f.id
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
            }`}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-gray-500 text-lg mb-4">No memories found</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add your first memory
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(memory => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onClick={() => setSelected(memory)}
            />
          ))}
        </div>
      )}

      {selected && <MemoryDetail memory={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddMemoryModal onClose={() => setShowAdd(false)} onAdd={addMemory} />}
    </div>
  );
}
