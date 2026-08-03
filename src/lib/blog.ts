import { BlogPost } from '../types';

function parseFrontMatter(fileContent: string): { data: Record<string, string>; content: string } {
  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = fileContent.match(frontMatterRegex);

  if (!match) {
    return { data: {}, content: fileContent };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, string> = {};

  const lines = yamlBlock.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx !== -1) {
      const key = trimmed.slice(0, colonIdx).trim();
      let val = trimmed.slice(colonIdx + 1).trim();

      // Strip unneeded quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      data[key] = val;
    }
  }

  return { data, content };
}

export function getAllPosts(): BlogPost[] {
  const modules = import.meta.glob('/content/blog/*.{md,mdx}', {
    eager: true,
    query: '?raw',
    import: 'default',
  });

  const posts: BlogPost[] = [];

  for (const path in modules) {
    const rawContent = modules[path] as string;
    if (!rawContent) continue;

    try {
      const { data, content } = parseFrontMatter(rawContent);

      const wordCount = content.trim().split(/\s+/).length;
      const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
      const readTime = `${readTimeMinutes} min read`;

      const post: BlogPost = {
        title: data.title || 'Untitled Post',
        description: data.description || '',
        slug: data.slug || path.replace(/^.*\/|\.[^.]+$/g, ''),
        date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
        updatedDate: data.updatedDate ? String(data.updatedDate) : undefined,
        author: data.author || 'DeKalb Garage Door Experts',
        featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
        featuredImageAlt: data.featuredImageAlt || data.title || 'Garage Door Repair Service',
        primaryKeyword: data.primaryKeyword || 'garage door repair DeKalb',
        category: data.category || 'General',
        content,
        readTime,
      };

      posts.push(post);
    } catch (err) {
      console.error(`Failed to parse markdown blog post at ${path}:`, err);
    }
  }

  // Sort posts in reverse chronological order
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  const posts = getAllPosts().filter((p) => p.slug !== currentSlug);
  const sameCategory = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const remaining = posts.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...remaining].slice(0, limit);
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((p) => p.category));
  return Array.from(categories);
}
