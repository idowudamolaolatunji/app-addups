 
import { useEffect } from "react";
import HeroTyped from "../../components/elements/HeroTyped";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";


export default function Home() {
	const navigate = useNavigate();
	const { user } = useAuthContext();

	useEffect(function () {
		window?.scrollTo(0, 0)

		if (user) {
			navigate("/home");
		}
	}, [user])

	return (
		<div className="hero__section">
			<div className="hero__text--box">
				<h1 className="hero--heading">
					Get More <HeroTyped /> <br /> and Boost Your Online Presence Today
				</h1>

				<p className="hero--text">Follow or Add new friends, gather up points, and get your social profile listed for others to follow or add you back..</p>

				<div className="hero--actions">
					<Link to="/signup" className="hero--btn filled">
						Get started
					</Link>
					<Link to="/login" className="hero--btn outline">
						Login
					</Link>
				</div>
			</div>
		</div>
	);
}
