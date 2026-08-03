import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServiceView from './components/ServiceView';
import CityView from './components/CityView';
import FaqView from './components/FaqView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import LegalViews from './components/LegalViews';
import ServiceAreasView from './components/ServiceAreasView';
import WhyChooseUsView from './components/WhyChooseUsView';
import BlogIndexView from './components/BlogIndexView';
import BlogPostView from './components/BlogPostView';
import { getPostBySlug } from './lib/blog';
import { servicesData } from './data/servicesData';
import { citiesData } from './data/citiesData';

export default function App() {
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const GSC_VERIFICATION_ID = import.meta.env.VITE_GSC_VERIFICATION_ID;

  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '') || 'home';
    return path;
  });

  // Monitor URL history state routing
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '') || 'home';
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Google Analytics & Google Search Console Initialization
  useEffect(() => {
    // 1. Inject Google Search Console verification meta tag if provided
    if (GSC_VERIFICATION_ID) {
      let gscMeta = document.querySelector('meta[name="google-site-verification"]');
      if (!gscMeta) {
        gscMeta = document.createElement('meta');
        gscMeta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(gscMeta);
      }
      gscMeta.setAttribute('content', GSC_VERIFICATION_ID);
    }

    // 2. Dynamically load and initialize Google Analytics gtag.js if provided
    if (GA_MEASUREMENT_ID) {
      const scriptId = 'google-tag-manager-script';
      if (!document.getElementById(scriptId)) {
        // Insert async tag script
        const gaScript = document.createElement('script');
        gaScript.id = scriptId;
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(gaScript);

        // Insert config and gtag inline script
        const initScript = document.createElement('script');
        initScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `;
        document.head.appendChild(initScript);
      }
    }
  }, [GA_MEASUREMENT_ID, GSC_VERIFICATION_ID]);

  // Dynamic SEO Tag and Schema Injection
  useEffect(() => {
    // 1. Determine Title & Description based on currentPath
    let title = 'Garage Door Repair DeKalb IL | Same-Day Service';
    let description = 'Premium, fast-loading garage door repair, spring replacement, opener installation, and 24/7 emergency services in DeKalb, IL and surrounding Northern Illinois areas.';
    let schemaJson: any = null;

    const baseDomain = 'https://dekalbgaragerepair.com';
    const canonicalUrl = `${baseDomain}/${currentPath === 'home' || currentPath === '' ? '' : currentPath}`;

    const serviceIds = [
      'garage-door-repair',
      'garage-door-spring-repair',
      'garage-door-opener-repair',
      'garage-door-opener-installation',
      'garage-door-installation',
      'emergency-garage-door-repair'
    ];

    let cleanServiceId = '';
    if (currentPath.startsWith('service/')) {
      cleanServiceId = currentPath.split('/')[1];
    } else if (serviceIds.includes(currentPath)) {
      cleanServiceId = currentPath;
    }

    if (cleanServiceId && servicesData[cleanServiceId]) {
      const service = servicesData[cleanServiceId];
      title = service.metaTitle;
      description = service.metaDescription;

      // Build Service Schema & FAQ Schema
      const mainSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': service.title.split('|')[0].trim(),
        'description': service.shortDesc,
        'provider': {
          '@type': 'LocalBusiness',
          'name': 'DeKalb Garage Door Repair',
          'telephone': '+18155558240',
          'priceRange': '$$',
          'image': 'https://dekalbgaragerepair.com/images/garage-door-repair.webp',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': '1100 Lincoln Hwy',
            'addressLocality': 'DeKalb',
            'addressRegion': 'IL',
            'postalCode': '60115',
            'addressCountry': 'US'
          }
        },
        'areaServed': [
          { '@type': 'AdministrativeArea', 'name': 'DeKalb, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Sycamore, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Cortland, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Malta, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Genoa, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Hinckley, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Kingston, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Maple Park, IL' }
        ]
      };

      if (service.faqs && service.faqs.length > 0) {
        schemaJson = [
          mainSchema,
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': service.faqs.map(faq => ({
              '@type': 'Question',
              'name': faq.question,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer
              }
            }))
          }
        ];
      } else {
        schemaJson = mainSchema;
      }
    } else if (currentPath.startsWith('city/')) {
      const cityId = currentPath.split('/')[1];
      if (citiesData[cityId]) {
        const city = citiesData[cityId];
        title = city.metaTitle;
        description = city.metaDescription;

        schemaJson = {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          'name': `DeKalb Garage Door Repair - ${city.cityName}`,
          'description': city.intro,
          'telephone': '+18155558240',
          'priceRange': '$$',
          'url': canonicalUrl,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': city.cityName.split(',')[0].trim(),
            'addressRegion': 'IL',
            'addressCountry': 'US'
          }
        };
      }
    } else if (currentPath === 'blog') {
      title = 'Garage Door Maintenance & Repair Blog | DeKalb Garage Door Repair';
      description = 'Read expert garage door repair guides, troubleshooting checklists, winter maintenance tips, and spring replacement articles from certified DeKalb IL technicians.';

      schemaJson = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        'name': 'DeKalb Garage Door Repair & Maintenance Blog',
        'url': canonicalUrl,
        'description': 'Expert troubleshooting guides, winter prep checklists, spring replacement advice, and local tips from certified DeKalb technicians.'
      };
    } else if (currentPath.startsWith('blog/')) {
      const slug = currentPath.split('/')[1];
      const post = getPostBySlug(slug);
      if (post) {
        title = `${post.title} | DeKalb Garage Door Repair`;
        description = post.description;

        schemaJson = [
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': post.title,
            'description': post.description,
            'image': [post.featuredImage],
            'datePublished': post.date,
            'dateModified': post.updatedDate || post.date,
            'author': {
              '@type': 'Person',
              'name': post.author
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'DeKalb Garage Door Repair',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://dekalbgaragerepair.com/images/garage-door-repair.webp'
              }
            },
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': canonicalUrl
            },
            'keywords': post.primaryKeyword
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': `${baseDomain}/`
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Blog',
                'item': `${baseDomain}/blog`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': post.title,
                'item': canonicalUrl
              }
            ]
          }
        ];
      }
    } else {
      switch (currentPath) {
        case 'about':
          title = 'About Us | DeKalb Garage Door Repair DeKalb IL';
          description = 'Learn about DeKalb Garage Door Repair in DeKalb, IL. Licensed, bonded, and insured local overhead door specialists.';
          break;
        case 'why-choose-us':
          title = 'Why Choose Us | DeKalb Garage Door Repair DeKalb IL';
          description = 'Discover why homeowners and businesses in DeKalb, IL trust us for their garage door repairs and installations. Same-day service, clear warranties.';
          break;
        case 'service-areas':
          title = 'Service Areas | Garage Door Repair in DeKalb IL';
          description = 'We proudly serve DeKalb, Sycamore, Cortland, Malta, Genoa, Hinckley, Kingston, Maple Park, and surrounding Northern Illinois communities.';
          break;
        case 'faqs':
          title = 'Frequently Asked Questions | Garage Door Repair DeKalb IL';
          description = 'Got questions about broken springs, opener issues, or new door installations? Check out our helpful FAQs or call today for immediate help.';
          break;
        case 'contact':
          title = 'Contact Us | DeKalb Garage Door Repair DeKalb IL';
          description = 'Get in touch with our local team for emergency repairs or free estimates in DeKalb, IL. We\'re available 24/7 at (815) 555-8240.';
          break;
        case 'privacy-policy':
          title = 'Privacy Policy | DeKalb Garage Door Repair';
          description = 'Read our privacy policy to understand how we protect your information when you contact us for garage door services.';
          break;
        case 'terms-and-conditions':
          title = 'Terms & Conditions | DeKalb Garage Door Repair';
          description = 'Review our service terms and conditions for residential and commercial garage door services.';
          break;
        default:
          title = 'Garage Door Repair DeKalb IL | Same-Day Service';
          description = 'Premium, fast-loading garage door repair, spring replacement, opener installation, and 24/7 emergency services in DeKalb, IL and surrounding Northern Illinois areas.';
          break;
      }

      // Default LocalBusiness Schema for static views / home
      schemaJson = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': 'DeKalb Garage Door Repair',
        'image': 'https://dekalbgaragedoorrepair.com/src/assets/images/garage_door_hero_1784628372796.jpg',
        '@id': 'https://dekalbgaragedoorrepair.com/',
        'url': 'https://dekalbgaragedoorrepair.com/',
        'telephone': '+18155558240',
        'priceRange': '$$',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '1100 Lincoln Hwy',
          'addressLocality': 'DeKalb',
          'addressRegion': 'IL',
          'postalCode': '60115',
          'addressCountry': 'US'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': 41.929474,
          'longitude': -88.750365
        },
        'openingHoursSpecification': {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          'opens': '00:00',
          'closes': '23:59'
        },
        'areaServed': [
          { '@type': 'AdministrativeArea', 'name': 'DeKalb, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Sycamore, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Cortland, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Malta, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Genoa, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Hinckley, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Kingston, IL' },
          { '@type': 'AdministrativeArea', 'name': 'Maple Park, IL' }
        ]
      };
    }

    // 2. Set Document Title
    document.title = title;

    // 3. Set Description Meta tag
    let metaDescriptionEl = document.querySelector('meta[name="description"]');
    if (!metaDescriptionEl) {
      metaDescriptionEl = document.createElement('meta');
      metaDescriptionEl.setAttribute('name', 'description');
      document.head.appendChild(metaDescriptionEl);
    }
    metaDescriptionEl.setAttribute('content', description);

    // 4. Set Canonical Link tag
    let canonicalLinkEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalLinkEl) {
      canonicalLinkEl = document.createElement('link');
      canonicalLinkEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLinkEl);
    }
    canonicalLinkEl.setAttribute('href', canonicalUrl);

    // 5. Inject/Update Schema JSON-LD script
    let schemaScriptEl = document.getElementById('seo-schema-markup');
    if (schemaScriptEl) {
      schemaScriptEl.remove();
    }
    if (schemaJson) {
      schemaScriptEl = document.createElement('script');
      schemaScriptEl.setAttribute('id', 'seo-schema-markup');
      schemaScriptEl.setAttribute('type', 'application/ld+json');
      schemaScriptEl.textContent = JSON.stringify(schemaJson);
      document.head.appendChild(schemaScriptEl);
    }

    // 6. Track Page View dynamically in Google Analytics
    const gaPath = currentPath === 'home' || currentPath === '' ? '/' : `/${currentPath}`;
    if (GA_MEASUREMENT_ID) {
      if ((window as any).gtag) {
        (window as any).gtag('config', GA_MEASUREMENT_ID, {
          page_path: gaPath,
          page_title: title
        });
      } else {
        // Fallback or backup dataLayer pushing if loaded asynchronously
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: 'pageview',
          page_path: gaPath,
          page_title: title
        });
      }
    } else {
      console.log(`[Google Analytics Debug] Pageview tracked: ${gaPath} - "${title}"`);
    }
  }, [currentPath, GA_MEASUREMENT_ID]);

  const handleNavigate = (path: string) => {
    const targetPath = path === 'home' || path === '' ? '/' : `/${path}`;
    window.history.pushState(null, '', targetPath);
    setCurrentPath(path === 'home' ? 'home' : path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Render correct view based on path
  const renderContent = () => {
    if (currentPath === 'home' || currentPath === '') {
      return <HomeView onNavigate={handleNavigate} />;
    }
    
    const serviceIds = [
      'garage-door-repair',
      'garage-door-spring-repair',
      'garage-door-opener-repair',
      'garage-door-opener-installation',
      'garage-door-installation',
      'emergency-garage-door-repair'
    ];

    if (currentPath.startsWith('service/')) {
      const serviceId = currentPath.split('/')[1];
      return <ServiceView serviceId={serviceId} onNavigate={handleNavigate} />;
    }

    if (serviceIds.includes(currentPath)) {
      return <ServiceView serviceId={currentPath} onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('city/')) {
      const cityId = currentPath.split('/')[1];
      return <CityView cityId={cityId} onNavigate={handleNavigate} />;
    }

    if (currentPath === 'blog') {
      return <BlogIndexView onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('blog/')) {
      const slug = currentPath.split('/')[1];
      const post = getPostBySlug(slug);
      if (post) {
        return <BlogPostView post={post} onNavigate={handleNavigate} />;
      }
      return <BlogIndexView onNavigate={handleNavigate} />;
    }

    switch (currentPath) {
      case 'about':
        return <AboutView onNavigate={handleNavigate} />;
      case 'why-choose-us':
        return <WhyChooseUsView onNavigate={handleNavigate} />;
      case 'service-areas':
        return <ServiceAreasView onNavigate={handleNavigate} />;
      case 'faqs':
        return <FaqView onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactView onNavigate={handleNavigate} />;
      case 'privacy-policy':
        return <LegalViews type="privacy" onNavigate={handleNavigate} />;
      case 'terms-and-conditions':
        return <LegalViews type="terms" onNavigate={handleNavigate} />;
      default:
        // Default Fallback
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Dynamic Header */}
      <Header currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Primary Page Content */}
      <main className="flex-grow w-full">
        {renderContent()}
      </main>

      {/* Unified Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
