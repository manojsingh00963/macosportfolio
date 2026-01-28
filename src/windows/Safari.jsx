import React from 'react';
import { WindowControls } from '#components';
import { blogPosts } from '#constants';
import WindowWrapper from '#hoc/windowWrapper';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MoveRight,
  PanelLeft,
  Plus,
  Search,
  Share,
  ShieldHalf,
} from 'lucide-react';

const Safari = () => {
  return (
    <>
      {/* Header */}
      <header className="window-header">
        <WindowControls target="safari" />

        <PanelLeft className="ml-10 icon" aria-label="Sidebar" />

        <div className="flex items-center gap-1 ml-5">
          <ChevronLeft className="icon" aria-label="Back" />
          <ChevronRight className="icon" aria-label="Forward" />
        </div>

        <div className="flex-1 flex items-center justify-center gap-3">
          <ShieldHalf className="icon" aria-label="Secure" />

          <div className="search">
            <Search className="icon" />
            <input
              type="text"
              placeholder="Search or enter website name"
              className="flex-1"
              aria-label="Search bar"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Share className="icon" aria-label="Share" />
          <Plus className="icon" aria-label="New Tab" />
          <Copy className="icon" aria-label="Copy URL" />
        </div>
      </header>

      {/* Blog Content */}
      <main className="blog h-[60vh] overflow-y-auto">
        <h2 className="mb-6 text-green-800  ">I Wroted Blogs.</h2>

        <div className="space-y-8">
          {blogPosts.map(({ id, image, title, date, link }) => (
            <article key={id} className="blog-post">
              <div className="col-span-2">
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="rounded-lg"
                />
              </div>

              <div className="content">
                <p className="text-sm opacity-70">{date}</p>
                <h3 className="mt-2">{title}</h3>

                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3"
                >
                  Check out the full post
                  <MoveRight className="icon-hover" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
};

const SafariWindow = WindowWrapper(Safari, 'safari');
export default SafariWindow;
