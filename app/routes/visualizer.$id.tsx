import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router";
import { generate3DView } from "../../lib/ai.action";
import { Box, Download, RefreshCcw, X } from "lucide-react";
import { Button } from "../../components/ui/Button";

const VisualizerId = () => {
    const nav = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { initialImage, initialRendered, name} = location.state || {};

    const hasInitalGenerated = useRef(false)

    const [isProcessing, setIsProcessing] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(initialRendered ?? null);

    const handleBack = () => nav('/');

    const createGeneration = async () => {
        if (!initialImage) return;
        try {
            setIsProcessing(true);
            const result = await generate3DView({ sourceImage: initialImage});
            
            if (result.renderedImage) {
                setCurrentImage(result.renderedImage);
            }

        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsProcessing(false);
        }
    }

    // The upload redirects here as soon as the file lands, so the render kicks
    // off on arrival. The ref keeps it to one run per visit.
    useEffect(() => {
        if (!initialImage || hasInitalGenerated.current) return;

        hasInitalGenerated.current = true;

        if (initialRendered) {
            setCurrentImage(initialRendered);
            return;
        }

        createGeneration();
    },[initialImage, initialRendered])

    return (
        <div className="visualizer">
            <nav className="topbar">
                <div className="brand">
                    <Box className="logo"/>
                    <span className="name">Nook</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
                    <X className="icon" />
                    Exit
                </Button>
            </nav>
            <section className="content">
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-meta">
                            <p>Project</p>
                            <h2>{name ?? 'Untitled'}</h2>
                            <p className="note">Created by you</p>
                        </div>

                        <div className="panel-actions">
                            <Button
                                size="sm"
                                onClick={() => {}}
                                className="export"
                                disabled={!currentImage}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            <Button className="share" size="sm" onClick={() => {}}>Share</Button>
                        </div>
                    </div>

                    <div className={`render-area ${isProcessing ? 'is-processing' : ''}`}>
                        {currentImage ? (
                            <img src={currentImage} alt="Ai Render" className="render-img"/>
                        ) : (
                            <div className="render-placeholder">
                                {initialImage && (
                                    <img src={initialImage} alt="Original" className="render-fallback"/>
                                )}
                            </div>
                        )}

                        {isProcessing && (
                            <div className="render-overlay">
                                <div className="rendering-card">
                                    <RefreshCcw className="spinner"/>
                                    <span className="title">Rendering...</span>
                                    <span className="subtitle">Generating 3D Floorplan...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </section>
        </div>
            
    );
}

export default VisualizerId;
