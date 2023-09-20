import "./card.scss";
import img from "../../images/song/forgetmenow.jpg";
import playButton from "../../images/playButton.svg";

export default function Card({ type, mixImg }) {
    const handleMouseMove = (e) => {
        const card = e.target;
        const cardRect = card.getBoundingClientRect();
        const x = e.pageX - cardRect.left;
        const y = e.pageY - cardRect.top;

        card.style.setProperty("--x", x);
        card.style.setProperty("--y", y);
    };

    const handleOnClickButton = (e) => {
        e.preventDefault();
    }

    return (
        <div className={`card ${type === "artist" && "artist"}`} onMouseMove={handleMouseMove}>
            <div className="inner">
                <div className="card-button" onClick={handleOnClickButton}>
                    <img src={playButton} alt="Play button" />
                </div>
                <div className="card-img">
                    {mixImg
                        ? <>
                            <div className="row first">
                                <div className="wrapper-img">
                                    <img src={img} alt="Img 1" />
                                </div>
                                <div className="wrapper-img">
                                    <img src={img} alt="Img 2" />
                                </div>
                            </div>
                            <div className="row second">
                                <div className="wrapper-img">
                                    <img src={img} alt="Img 3" />
                                </div>
                                <div className="wrapper-img">
                                    <img src={img} alt="Img 4" />
                                </div>
                            </div>
                        </>
                        : <img src={img} alt="Name of card" />}
                </div>
                <div className="card-content" >
                    <h4 className="name">Name</h4>
                    <div className="content">
                        <span>This is the content of this card.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
