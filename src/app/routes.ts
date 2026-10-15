export type CaseTab =
  | 'inspect'
  | 'import'
  | 'assessment'
  | 'review'
  | 'simulate'
  | 'decision';

export type AppRoute =
  | { type: 'overview' }
  | { type: 'workspace' }
  | { type: 'batteries' }
  | { type: 'battery-new' }
  | { type: 'battery-case'; batteryId: string; tab: CaseTab }
  | { type: 'dossiers' }
  | { type: 'history' }
  | { type: 'settings' };

export function parseHash(hash: string): AppRoute {
  const clean = hash.replace(/^#\/?/, '').trim();
  const parts = clean.split('/').filter(Boolean);

  if (parts.length === 0 || parts[0] === 'overview') {
    return { type: 'overview' };
  }

  if (parts[0] === 'workspace') {
    return { type: 'workspace' };
  }

  if (parts[0] === 'assessments' || parts[0] === 'batteries') {
    if (parts[1] === 'new') {
      return { type: 'battery-new' };
    }
    if (parts[1]) {
      const batteryId = parts[1];
      const validTabs: CaseTab[] = ['inspect', 'import', 'assessment', 'review', 'simulate', 'decision'];
      let rawTab = (parts[2] || 'inspect').toLowerCase();
      // Map synonyms
      if (rawTab === 'inspection') rawTab = 'inspect';
      if (rawTab === 'evidence') rawTab = 'import';
      if (rawTab === 'report') rawTab = 'decision';
      const tab: CaseTab = validTabs.includes(rawTab as CaseTab) ? (rawTab as CaseTab) : 'inspect';
      return { type: 'battery-case', batteryId, tab };
    }
    return { type: 'batteries' };
  }

  if (parts[0] === 'dossiers' || parts[0] === 'reports') {
    return { type: 'dossiers' };
  }
  if (parts[0] === 'history') {
    return { type: 'history' };
  }
  if (parts[0] === 'settings') {
    return { type: 'settings' };
  }

  return { type: 'overview' };
}

export function routeToHash(route: AppRoute): string {
  switch (route.type) {
    case 'overview':
      return '#/overview';
    case 'workspace':
      return '#/workspace';
    case 'batteries':
      return '#/assessments';
    case 'battery-new':
      return '#/assessments/new';
    case 'battery-case':
      return `#/assessments/${route.batteryId}/${route.tab}`;
    case 'dossiers':
      return '#/dossiers';
    case 'history':
      return '#/history';
    case 'settings':
      return '#/settings';
  }
}

export function navigate(path: string) {
  const target = path.startsWith('#') ? path : `#/${path.replace(/^\//, '')}`;
  if (window.location.hash !== target) {
    window.location.hash = target;
  }
}
