 
import { useEffect } from "react";
import img from "../../assets/png-resources/home.png"
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
			<div className="image--container">
				<img src={img} alt="hero image" />
			</div>

			<div className="hero__text--box">
				<h1 className="hero--heading">
					Want more <span className="bold-extra">WhatsApp</span> contacts? Join Us
				</h1>

				<p className="hero--text">Add contacts, gather up points, and get your WhatsApp profile listed for others to add you back</p>

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
