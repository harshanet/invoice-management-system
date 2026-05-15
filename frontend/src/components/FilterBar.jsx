const TYPES = ['', 'article', 'video', 'course', 'book', 'tool', 'other'];
const DIFFICULTIES = ['', 'beginner', 'intermediate', 'advanced'];

const FilterBar = ({ filters, onChange }) => {
    const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

    const selectClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

    return (
        <div className="flex flex-wrap gap-3">
            <select value={filters.type} onChange={handle('type')} className={selectClass}>
                <option value="">All types</option>
                {TYPES.filter(Boolean).map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
            </select>

            <select value={filters.difficulty} onChange={handle('difficulty')} className={selectClass}>
                <option value="">All difficulties</option>
                {DIFFICULTIES.filter(Boolean).map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
            </select>
        </div>
    );
};

export default FilterBar;
