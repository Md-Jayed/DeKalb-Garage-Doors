import React, { useState } from 'react';
import { getAllPosts, getAllCategories } from '../lib/blog';
import { Calendar, Clock, User, ArrowRight, Tag, Search, ShieldAlert, PhoneCall } from 'lucide-react';

interface BlogIndexViewProps {
  onNavigate: (path: string) => void;
}

export default function BlogIndexView({ onNavigate }: BlogIndexViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allPosts = getAllPosts();
  const categories = ['All', ...getAllCategories()];

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.primaryKeyword.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;

  const handlePostClick = (slug: string) => {
    onNavigate(`blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans">
      {/* Top Hero Banner */}
      <section className="bg-slate-900 text-white py-14 px-4 md:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="absolute inset-0 bg-blue-950/40 mix-blend-multiply" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Breadcrumb */}
          <nav className="flex justify-center items-center gap-2 text-xs text-slate-400 mb-4">
            <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors">
              Home
            </button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">Blog</span>
          </nav>

          <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-900/60 uppercase tracking-widest inline-block mb-3">
            DeKalb County Garage Door Insights
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
            Garage Door Repair & Maintenance Blog
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-4">
            Expert troubleshooting guides, winter prep checklists, spring replacement advice, and local tips from certified DeKalb technicians.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>
        </div>

        {/* Featured Post Spotlight (Only shown when not searching/filtering) */}
        {featuredPost && selectedCategory === 'All' && searchQuery === '' && (
          <div className="mb-12 bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative min-h-[260px] md:min-h-[340px]">
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.featuredImageAlt}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded shadow tracking-wider">
                  Featured Guide
                </span>
              </div>
              <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="bg-blue-50 text-blue-900 font-bold px-2.5 py-0.5 rounded border border-blue-100">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h2
                    onClick={() => handlePostClick(featuredPost.slug)}
                    className="text-xl md:text-2xl font-black text-slate-900 hover:text-blue-900 cursor-pointer transition-colors leading-tight"
                  >
                    {featuredPost.title}
                  </h2>
                  <p className="text-slate-600 text-xs md:text-sm mt-3 leading-relaxed line-clamp-3">
                    {featuredPost.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <User className="w-3.5 h-3.5 text-blue-900" />
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <button
                    onClick={() => handlePostClick(featuredPost.slug)}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    Read Post <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid (Reverse Chronological) */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => handlePostClick(post.slug)}>
                    <img
                      src={post.featuredImage}
                      alt={post.featuredImageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3
                      onClick={() => handlePostClick(post.slug)}
                      className="font-extrabold text-base text-slate-900 group-hover:text-blue-900 cursor-pointer transition-colors leading-snug line-clamp-2"
                    >
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-xs mt-2.5 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-500" />
                    {post.primaryKeyword}
                  </span>
                  <button
                    onClick={() => handlePostClick(post.slug)}
                    className="text-xs font-extrabold text-blue-900 hover:text-amber-600 transition-colors flex items-center gap-1"
                  >
                    Read Article &rarr;
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-extrabold text-lg text-slate-900">No Articles Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your category filter or search terms.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-blue-900 text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-blue-800">
          <div>
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider px-2.5 py-1 rounded uppercase">
              DEKALB EMERGENCY DISPATCH
            </span>
            <h3 className="text-xl md:text-2xl font-black mt-2">Need Immediate Garage Door Repair?</h3>
            <p className="text-blue-200 text-xs md:text-sm mt-1 max-w-xl">
              Our certified technicians are on standby 24/7 across DeKalb, Sycamore, and Cortland, IL with fully stocked service trucks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="tel:8155558240"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 px-6 rounded-xl text-xs tracking-wider transition-all text-center flex items-center justify-center gap-2 border border-amber-600 shadow-md"
            >
              <PhoneCall className="w-4 h-4 fill-current" />
              CALL (815) 555-8240
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-white hover:bg-slate-100 text-blue-900 font-extrabold py-3 px-6 rounded-xl text-xs transition-all text-center"
            >
              Book Service Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
