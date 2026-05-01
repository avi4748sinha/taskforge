import { Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Project } from "../types";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function loadProjects() {
    const response = await api.projects();
    setProjects(response.items);
  }

  useEffect(() => {
    loadProjects().catch((err) => setError(err.message));
  }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    await api.createProject({ name, description });
    setName("");
    setDescription("");
    await loadProjects();
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Projects</span>
          <h1>Active workspaces</h1>
        </div>
      </header>
      <section className="panel">
        <form className="inline-form" onSubmit={handleCreate}>
          <input placeholder="Project name" value={name} onChange={(event) => setName(event.target.value)} required />
          <input placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
          <button className="primary-button">
            <Plus size={16} /> Create
          </button>
        </form>
      </section>
      {error && <div className="error">{error}</div>}
      <section className="project-grid">
        {projects.map((project) => (
          <Link to={`/projects/${project.id}`} className="project-card" key={project.id}>
            <div>
              <h2>{project.name}</h2>
              <p>{project.description ?? "No description yet."}</p>
            </div>
            <span>{project._count?.tasks ?? 0} tasks</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
