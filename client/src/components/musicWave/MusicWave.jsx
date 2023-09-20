import "./musicWave.scss";

export default function MusicWave() {
    return (
        <div className="music-wave">
            <div className="loader">
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
            </div>
        </div>
    )
}
