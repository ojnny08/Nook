import { ArrowRight, Clock, Layers } from "lucide-react";
import NavBar from "../../components/NavBar";
import { Button } from "../../components/ui/Button";
import Upload from "../../components/Upload";

export default function Home() {
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

              <Upload />
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

              <div className="projects-grid">
                <div className="projects-card group">
                  <div className="preview">
                    <img src="https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png"/>
                  </div>

                  <div className="card body">
                    <div>
                      <h3>Title</h3>
                      <div className="meta">
                        <Clock size={12}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}
