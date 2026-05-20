export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  category?: string;
  images: string[]; // base64 encoded
  createdAt: number;
}

const STORAGE_KEY = 'synthetix_projects';

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

export function saveProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  projects.unshift(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return newProject;
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function updateProject(id: string, data: Omit<Project, 'id' | 'createdAt'>): void {
  const projects = getProjects().map((p) =>
    p.id === id ? { ...p, ...data } : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
