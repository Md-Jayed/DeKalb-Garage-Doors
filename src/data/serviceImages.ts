// Central mapping of all services to professional, realistic, high-quality images.
// These are shared consistently between the home page cards and the individual service detail pages.

export const serviceImages: Record<string, string> = {
  'garage-door-repair': '/src/assets/images/garage_technician_1784628389548.jpg',
  'garage-door-spring-repair': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', // Technical steel spring/mechanic
  'garage-door-opener-repair': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80', // Electronic motor circuit repair
  'garage-door-opener-installation': 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=1200&q=80', // Technical maintenance worker installing/tuning
  'garage-door-installation': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', // Beautiful residential modern garage doors
  'emergency-garage-door-repair': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', // Nighttime glowing garage
};

// Default high-quality fallback image (technician on site)
export const DEFAULT_SERVICE_IMAGE = '/src/assets/images/garage_technician_1784628389548.jpg';

export function getServiceImage(serviceId: string): string {
  return serviceImages[serviceId] || DEFAULT_SERVICE_IMAGE;
}
