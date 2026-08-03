import React from 'react';
import ReactMarkdown from 'react-markdown';
import { BlogPost } from '../types';
import { getRelatedPosts } from '../lib/blog';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Tag, PhoneCall, ShieldCheck, MapPin, Wrench } from 'lucide-react';
import { servicesData } from '../data/servicesData';
import { citiesData } from '../data/citiesData';

interface BlogPostViewProps {
  post: BlogPost;
  onNavigate: (path: string) => void;
}

export default function BlogPostView({ post, onNavigate }: BlogPostViewProps) {
  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans">
      {/* Top Header / Breadcrumb Section */}
      <div className="bg-slate-900 text-white py-10 px-4 md:px-6 border-b-4 border-amber-500">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation: Home > Blog > Article Title */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4 flex-wrap">
            <button onClick={() => handleLinkClick('home')} className="hover:text-amber-400 transition-colors">
              Home
            </button>
            <span>&gt;</span>
            <button onClick={() => handleLinkClick('blog')} className="hover:text-amber-400 transition-colors">
              Blog
            </button>
            <span>&gt;</span>
            <span className="text-amber-400 font-semibold truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
          </nav>

          <span className="bg-amber-500 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded shadow inline-block mb-3">
            {post.category}
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-white">
            {post.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-4 pt-4 border-t border-slate-800">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-amber-500" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Published: {post.date}
            </span>
            {post.updatedDate && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                  Updated: {post.updatedDate}
                </span>
              </>
            )}
            {post.readTime && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 mb-8 bg-slate-900">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            className="w-full h-auto max-h-[460px] object-cover"
          />
          {post.featuredImageAlt && (
            <div className="bg-slate-900 text-slate-400 text-xs px-4 py-2 border-t border-slate-800 italic">
              {post.featuredImageAlt}
            </div>
          )}
        </div>

        {/* Primary Keyword & Tag Pill */}
        <div className="flex items-center gap-2 mb-6 bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
          <Tag className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-semibold text-slate-500">Focus Topic:</span>
          <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">{post.primaryKeyword}</span>
        </div>

        {/* Rendered Markdown Article Content */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 mb-10">
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-7 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg md:text-xl font-bold text-slate-900 mt-5 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="text-slate-700 leading-relaxed mb-4 text-sm md:text-base" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 mb-4 text-sm md:text-base text-slate-700" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 mb-4 text-sm md:text-base text-slate-700" {...props} />,
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-amber-500 bg-amber-50/60 p-4 rounded-r-lg text-slate-800 italic my-4" {...props} />,
                a: ({ node, href, children, ...props }) => {
                  const isInternal = href && (href.startsWith('/') || href.startsWith('#'));
                  return (
                    <a
                      href={href}
                      onClick={(e) => {
                        if (isInternal) {
                          e.preventDefault();
                          handleLinkClick(href.replace(/^\//, ''));
                        }
                      }}
                      className="text-blue-900 font-extrabold hover:underline"
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
                code: ({ node, ...props }) => <code className="bg-slate-100 text-slate-800 font-mono text-xs px-2 py-1 rounded border border-slate-200" {...props} />,
                pre: ({ node, ...props }) => <pre className="bg-slate-950 text-slate-100 font-mono text-xs p-4 rounded-xl overflow-x-auto my-4 border border-slate-800" {...props} />,
                hr: () => <hr className="my-8 border-slate-200" />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="bg-blue-900 text-white p-4 rounded-full font-black text-xl shrink-0">
            DK
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Written By</span>
            <h4 className="font-extrabold text-slate-900 text-base">{post.author}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Certified overhead door repair specialists serving DeKalb, Sycamore, Cortland, Malta, Genoa, and surrounding Northern Illinois communities.
            </p>
          </div>
        </div>

        {/* Internal Links & Direct Services Navigation Section */}
        <div className="bg-slate-100 p-6 md:p-8 rounded-2xl border border-slate-200 mb-10">
          <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-900" />
            Explore DeKalb Garage Door Services & Service Areas
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            Need fast assistance or looking for specific repair solutions in your city? Explore our direct service pages below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.values(servicesData).map((service) => (
              <button
                key={service.id}
                onClick={() => handleLinkClick(`${service.id}`)}
                className="bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-900 p-3 rounded-xl font-bold text-left border border-slate-200 transition-all flex items-center justify-between"
              >
                <span>{service.title.split('|')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Nearby Cities:
            </span>
            {Object.values(citiesData).map((city) => (
              <button
                key={city.id}
                onClick={() => handleLinkClick(`city/${city.id}`)}
                className="text-blue-900 hover:underline font-semibold bg-white px-2.5 py-1 rounded border border-slate-200"
              >
                {city.cityName.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-amber-500 text-slate-950 p-8 rounded-3xl border border-amber-600 shadow-lg text-center flex flex-col items-center gap-4 mb-12">
          <div className="bg-slate-950 text-amber-400 font-black text-[10px] tracking-wider px-3 py-1 rounded uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            24/7 SAME-DAY EMERGENCY REPAIR
          </div>
          <h3 className="font-black text-2xl leading-tight">
            Have Questions About Your Garage Door in DeKalb?
          </h3>
          <p className="text-slate-900 text-xs md:text-sm max-w-lg leading-relaxed font-medium">
            Don't leave your garage door broken or unsafe. Speak with our local dispatch manager now for a free price estimate and immediate same-day arrival.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
            <a
              href="tel:8155558240"
              className="bg-slate-950 hover:bg-slate-900 text-white font-black py-3.5 px-8 rounded-xl text-sm tracking-wider transition-all flex items-center justify-center gap-2 shadow"
            >
              <PhoneCall className="w-4 h-4 text-amber-400 fill-current" />
              CALL (815) 555-8240
            </a>
            <button
              onClick={() => handleLinkClick('contact')}
              className="bg-white hover:bg-slate-100 text-slate-950 font-extrabold py-3.5 px-8 rounded-xl text-sm transition-all"
            >
              Schedule Online Inspection
            </button>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl text-slate-900">Related Blog Articles</h3>
              <button
                onClick={() => handleLinkClick('blog')}
                className="text-xs font-bold text-blue-900 hover:text-amber-600 flex items-center gap-1"
              >
                View All Posts &rarr;
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <article
                  key={rPost.slug}
                  onClick={() => handleLinkClick(`blog/${rPost.slug}`)}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 overflow-hidden">
                      <img
                        src={rPost.featuredImage}
                        alt={rPost.featuredImageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                        {rPost.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-900 transition-colors mt-2 line-clamp-2">
                        {rPost.title}
                      </h4>
                    </div>
                  </div>
                  <div className="p-4 pt-0 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-50 mt-2">
                    <span>{rPost.date}</span>
                    <span className="font-bold text-blue-900">Read &rarr;</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => handleLinkClick('blog')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-900 bg-white border border-slate-200 px-5 py-2.5 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog Index
          </button>
        </div>
      </div>
    </div>
  );
}
