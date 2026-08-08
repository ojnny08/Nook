import { ArrowRight, Clock, Layers } from "lucide-react";
import NavBar from "../../components/NavBar";
import { Button } from "../../components/ui/Button";
import Upload from "../../components/Upload";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useProjects } from "../../lib/useProjects";

export default function Home() {
  const { projects, addProject } = useProjects();
  const nav = useNavigate();

  // Upload reports that the file landed; Home decides what that means.
  const handleUploadComplete = useCallback(
    async (uid: string, file: File) => {
      const saved = await addProject(uid, file);
      if (!saved) return;

      nav(`/visualizer/${saved.id}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage ?? null,
          name: saved.name,
        },
      });
    },
    [addProject, nav],
  );

  return (
      <div className="home">
        <NavBar />
        <section className="hero">
          <div className="dot">
            <div className="pulse"></div>
          </div>

          <h1>Build your home with Nook</h1>

          <div className="actions">
            <a href="#upload" className="cta">
              Start Building <ArrowRight className="icon"/>
            </a>

            <Button variant="outline" size="lg" className="demo">
              Watch Demo
            </Button>
          </div>

          <div id="upload" className="upload-shell">
            <div className="grid-overlay" />

            <div className="upload-card">
              <div className="upload-head">
                <div className="upload-icon">
                  <Layers className="icon" />
                </div>

                <h3>Upload your floor plan</h3>
                <p>Supports JPG, PNG, up to 10MB</p>
              </div>

              <Upload onUploadComplete={handleUploadComplete} />
            </div>
          </div>
        </section>

        <section className="projects">
          <div className="section-inner">
            <div className="section-head">
              <div className="copy">
                <h2>Projects</h2>
                <p>Your work and community projects</p>
              </div>

              {projects.length === 0 ? (
                <p className="projects-empty">
                  No projects yet — upload a floor plan to get started.
                </p>
              ) : (
                <div className="projects-grid">
                  {projects.map((project) => (
                    <div key={project.id} className="projects-card group">
                      <div className="preview">
                        <img
                          src={project.renderedImage ?? project.sourceImage}
                          alt={project.name ?? "Floor plan"}
                        />
                      </div>

                      <div className="card body">
                        <div>
                          <h3>{project.name ?? "Untitled"}</h3>
                          <div className="meta">
                            <Clock size={12}/>
                            <span>{new Date(project.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
  );
}
