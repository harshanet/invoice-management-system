import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const TYPES = ['article', 'video', 'course', 'book', 'tool', 'other'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50";

const ResourceForm = ({ initial = {}, onSubmit, loading, error, onCancel }) => {
    const [form, setForm] = useState({
        title:       initial.title       || '',
        description: initial.description || '',
        type:        initial.type        || '',
        category:    initial.category    || '',
        url:         initial.url         || '',
        tags:        initial.tags?.join(', ') || '',
        difficulty:  initial.difficulty  || 'beginner',
        image:       initial.image       || '',
    });
    const [errors, setErrors]       = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axiosInstance.get('/api/categories').then(r => setCategories(r.data)).catch(() => {});
    }, []);

    const handle = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const validate = () => {
        const e = {};
        if (!form.title.trim())    e.title = 'Title is required.';
        if (!form.url.trim())      e.url   = 'URL is required.';
        else if (!/^https?:\/\/.+/.test(form.url.trim())) e.url = 'URL must start with http:// or https://';
        if (!form.type)            e.type  = 'Type is required.';
        if (!form.category.trim()) e.category = 'Category is required.';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const e2 = validate();
        if (Object.keys(e2).length) return setErrors(e2);
        setErrors({});
        onSubmit({
            ...form,
            title:       form.title.trim(),
            url:         form.url.trim(),
            description: form.description.trim(),
            category:    form.category.trim(),
            image:       form.image.trim(),
            tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Title */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Title *</label>
                <input
                    type="text"
                    value={form.title}
                    onChange={handle('title')}
                    className={inputClass}
                    placeholder="Enter resource title"
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={form.description}
                    onChange={handle('description')}
                    className={inputClass}
                    rows={4}
                    placeholder="Describe the resource..."
                />
            </div>

            {/* Type + Category row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Type *</label>
                    <select value={form.type} onChange={handle('type')} className={inputClass}>
                        <option value="">Select type</option>
                        {TYPES.map(t => (
                            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                        ))}
                    </select>
                    {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Category *</label>
                    <select value={form.category} onChange={handle('category')} className={inputClass}>
                        <option value="">Select category</option>
                        {categories.map(c => (
                            <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                </div>
            </div>

            {/* URL */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">External URL *</label>
                <input
                    type="text"
                    value={form.url}
                    onChange={handle('url')}
                    className={inputClass}
                    placeholder="https://example.com/resource"
                />
                {errors.url && <p className="text-red-500 text-xs">{errors.url}</p>}
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <input
                    type="text"
                    value={form.tags}
                    onChange={handle('tags')}
                    className={inputClass}
                    placeholder="Add tags separated by commas (e.g. python, beginner)"
                />
            </div>

            {/* Difficulty radio */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Difficulty *</label>
                <div className="flex gap-6">
                    {DIFFICULTIES.map(d => (
                        <label key={d} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input
                                type="radio"
                                name="difficulty"
                                value={d}
                                checked={form.difficulty === d}
                                onChange={handle('difficulty')}
                                className="accent-gray-800"
                            />
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                        </label>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="border border-gray-300 text-sm font-medium px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Resource'}
                </button>
            </div>
        </form>
    );
};

export default ResourceForm;
