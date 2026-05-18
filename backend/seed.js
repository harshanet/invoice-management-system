const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('./models/Category');
const Resource = require('./models/Resource');

const categories = [
  { name: 'Programming',   description: 'Coding tutorials, languages, and software engineering' },
  { name: 'Design',        description: 'UI/UX, graphic design, and visual communication' },
  { name: 'Data Science',  description: 'Machine learning, data analysis, and statistics' },
  { name: 'DevOps',        description: 'CI/CD, cloud infrastructure, and deployment' },
  { name: 'Career',        description: 'Job hunting, interviews, and professional growth' },
];

const resources = [
  // Programming
  {
    title: 'The Odin Project',
    description: 'A free, open-source coding curriculum covering full-stack web development from scratch. Covers HTML, CSS, JavaScript, Node, and React with real projects.',
    type: 'course',
    url: 'https://www.theodinproject.com',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    category: 'Programming',
    tags: ['web development', 'javascript', 'full-stack', 'free'],
    difficulty: 'beginner',
  },
  {
    title: 'JavaScript: The Good Parts',
    description: 'Douglas Crockford\'s classic book distilling the best features of JavaScript. Essential reading for understanding the language deeply.',
    type: 'book',
    url: 'https://www.oreilly.com/library/view/javascript-the-good/9780596517748/',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1200&q=80',
    category: 'Programming',
    tags: ['javascript', 'fundamentals'],
    difficulty: 'intermediate',
  },
  {
    title: 'CS50x – Introduction to Computer Science',
    description: 'Harvard\'s legendary introduction to computer science. Covers algorithms, data structures, memory, and more across C, Python, SQL, and JavaScript.',
    type: 'course',
    url: 'https://cs50.harvard.edu/x/',
    image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80',
    category: 'Programming',
    tags: ['computer science', 'algorithms', 'python', 'c', 'free'],
    difficulty: 'beginner',
  },
  {
    title: 'Refactoring Guru – Design Patterns',
    description: 'A beautifully illustrated guide to all 23 classic design patterns with real-world examples in multiple languages.',
    type: 'article',
    url: 'https://refactoring.guru/design-patterns',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80',
    category: 'Programming',
    tags: ['design patterns', 'architecture', 'oop'],
    difficulty: 'intermediate',
  },
  {
    title: 'Build Your Own React',
    description: 'Step-by-step tutorial walking through building a simplified version of React from scratch to understand how it works under the hood.',
    type: 'article',
    url: 'https://pomb.us/build-your-own-react/',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    category: 'Programming',
    tags: ['react', 'javascript', 'deep dive'],
    difficulty: 'advanced',
  },

  // Design
  {
    title: 'Figma – Learn Design',
    description: 'Figma\'s own free course teaching UI design fundamentals: layout, typography, colour, and component-driven design systems.',
    type: 'course',
    url: 'https://www.figma.com/resources/learn-design/',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    category: 'Design',
    tags: ['ui', 'figma', 'free', 'beginners'],
    difficulty: 'beginner',
  },
  {
    title: 'Laws of UX',
    description: 'A collection of the best psychological principles that designers can use to build more intuitive products, with clear explanations and examples.',
    type: 'article',
    url: 'https://lawsofux.com',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    category: 'Design',
    tags: ['ux', 'psychology', 'principles'],
    difficulty: 'beginner',
  },
  {
    title: 'Refactoring UI',
    description: 'Practical UI design tips from the creators of Tailwind CSS. Teaches developers how to make their UIs look good without a design background.',
    type: 'book',
    url: 'https://www.refactoringui.com',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
    category: 'Design',
    tags: ['ui', 'tailwind', 'practical'],
    difficulty: 'beginner',
  },

  // Data Science
  {
    title: 'fast.ai – Practical Deep Learning',
    description: 'A top-down, practical approach to deep learning. Get models working first, then learn the theory. Free and highly regarded.',
    type: 'course',
    url: 'https://course.fast.ai',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&q=80',
    category: 'Data Science',
    tags: ['deep learning', 'python', 'pytorch', 'free'],
    difficulty: 'intermediate',
  },
  {
    title: 'Kaggle Learn',
    description: 'Free micro-courses on Python, pandas, ML, SQL, and more. Includes hands-on notebooks you can run in the browser.',
    type: 'course',
    url: 'https://www.kaggle.com/learn',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    category: 'Data Science',
    tags: ['python', 'pandas', 'machine learning', 'sql', 'free'],
    difficulty: 'beginner',
  },
  {
    title: 'Seeing Theory – Visual Statistics',
    description: 'An interactive, visual introduction to probability and statistics. Makes abstract concepts intuitive through beautiful animations.',
    type: 'article',
    url: 'https://seeing-theory.brown.edu',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    category: 'Data Science',
    tags: ['statistics', 'probability', 'interactive', 'visual'],
    difficulty: 'beginner',
  },

  // DevOps
  {
    title: 'Docker Getting Started',
    description: 'The official Docker tutorial. Covers containers, images, volumes, networks, and Docker Compose with a hands-on sample app.',
    type: 'article',
    url: 'https://docs.docker.com/get-started/',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    category: 'DevOps',
    tags: ['docker', 'containers', 'official'],
    difficulty: 'beginner',
  },
  {
    title: 'The Twelve-Factor App',
    description: 'A methodology for building modern, scalable, maintainable software-as-a-service apps. Essential reading for anyone deploying to the cloud.',
    type: 'article',
    url: 'https://12factor.net',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    category: 'DevOps',
    tags: ['architecture', 'cloud', 'saas', 'best practices'],
    difficulty: 'intermediate',
  },
  {
    title: 'GitHub Actions Documentation',
    description: 'Complete guide to automating workflows with GitHub Actions — CI/CD pipelines, scheduled jobs, and custom automation.',
    type: 'article',
    url: 'https://docs.github.com/en/actions',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
    category: 'DevOps',
    tags: ['ci/cd', 'github', 'automation', 'official'],
    difficulty: 'intermediate',
  },

  // Career
  {
    title: 'Tech Interview Handbook',
    description: 'A comprehensive, community-driven guide to cracking software engineering interviews — from resume tips to system design and coding questions.',
    type: 'article',
    url: 'https://www.techinterviewhandbook.org',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    category: 'Career',
    tags: ['interviews', 'leetcode', 'system design', 'resume'],
    difficulty: 'intermediate',
  },
  {
    title: 'Levels.fyi',
    description: 'Crowdsourced compensation data for tech roles across hundreds of companies. Useful for salary negotiation and benchmarking offers.',
    type: 'tool',
    url: 'https://www.levels.fyi',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
    category: 'Career',
    tags: ['salary', 'compensation', 'jobs'],
    difficulty: 'beginner',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Category.deleteMany({});
  await Resource.deleteMany({});
  console.log('Cleared existing categories and resources');

  const createdCategories = await Category.insertMany(categories);
  console.log(`Inserted ${createdCategories.length} categories`);

  const createdResources = await Resource.insertMany(resources);
  console.log(`Inserted ${createdResources.length} resources`);

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch((err) => { console.error(err); process.exit(1); });
