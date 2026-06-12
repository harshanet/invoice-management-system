import { Link } from 'react-router-dom';

const features = [
  { title: 'Curated resources', body: 'Hand-picked courses, books, articles and tools across programming, design, data science, DevOps and career growth.' },
  { title: 'Search & filter', body: 'Find what you need by keyword, category, type or difficulty — no noise, just relevant learning material.' },
  { title: 'Personal bookmarks', body: 'Save resources to your own collection and pick up exactly where you left off.' },
  { title: 'Admin-managed catalogue', body: 'Administrators keep the library accurate, with full control over resources and categories.' },
];

const About = () => (
  <div className="max-w-3xl mx-auto px-8 py-10">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-sm" />
      </div>
      <span className="font-bold text-gray-900 text-xl">LearnLib</span>
    </div>

    <h1 className="text-3xl font-bold text-gray-900 mb-3">About the Learning Resource Library</h1>
    <p className="text-gray-600 leading-relaxed mb-8">
      LearnLib is a curated library of educational resources that helps learners discover, organise and
      revisit quality material in one place. Browse the catalogue freely, bookmark your favourites, and
      let administrators maintain an accurate, well-organised collection.
    </p>

    <div className="grid sm:grid-cols-2 gap-4 mb-10">
      {features.map((f) => (
        <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-1">{f.title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
        </div>
      ))}
    </div>

    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-gray-900">Ready to start learning?</p>
        <p className="text-sm text-gray-500">Browse the full catalogue and build your bookmark collection.</p>
      </div>
      <Link to="/resources" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
        Browse resources
      </Link>
    </div>

    <p className="text-xs text-gray-400 mt-8">
      Built for IFQ636 · React, Node.js &amp; MongoDB · Deployed with AWS &amp; CI/CD.
    </p>
  </div>
);

export default About;
