const difficultyStyles = {
    beginner:     'text-green-600 bg-green-50',
    intermediate: 'text-yellow-600 bg-yellow-50',
    advanced:     'text-red-600 bg-red-50',
};

const ResourceCard = ({ resource }) => {
    const diffStyle = difficultyStyles[resource.difficulty] || 'text-gray-600 bg-gray-50';

    return (
        <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {resource.type}
                </span>
                <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${diffStyle}`}>
                    {resource.difficulty}
                </span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">{resource.title}</h2>
            {resource.description && (
                <p className="text-sm text-gray-600 line-clamp-3">{resource.description}</p>
            )}
            {resource.category && (
                <p className="text-xs text-gray-400">Category: {resource.category}</p>
            )}
            <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="mt-auto text-sm text-blue-500 hover:underline"
            >
                Open resource →
            </a>
        </div>
    );
};

export default ResourceCard;
