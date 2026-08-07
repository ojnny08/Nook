import { useParams } from "react-router";

const VisualizerId = () => {
    const { id } = useParams();

    return (
        <div className="visualizer-route loading">
            Loading project {id}
        </div>
    );
}

export default VisualizerId;
