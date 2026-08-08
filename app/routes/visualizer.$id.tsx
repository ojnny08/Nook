import { useParams } from "react-router";
import { useLocation } from "react-router";

const VisualizerId = () => {
    const { id } = useParams();
    const location = useLocation();
    const { initialImage, name} = location.state || {};
    return (
        <section>
            <h1> {name || 'Untitled Porject'}</h1>
            <div className="image-container">
                <h2>Source Image</h2>
                <img src={initialImage} />
            </div>
        </section>
    );
}

export default VisualizerId;
