import img from "../../assets/logo/addups.png";
import { useAuthContext } from "../../context/AuthContext";
import { GiCrownCoin } from "react-icons/gi";
import { capFirst, shortenNumber } from "../../utils/helper";

export default function Header() {
	const { user } = useAuthContext();

	return (
		<header className="header">
			<div className="header--logo">
				<img src={img} alt="logo" />
			</div>

			<div className="header--others">
				<div className="header--point">
					<GiCrownCoin />
					<span>
						<span className="number">{shortenNumber(user?.pointBalance || 0)}</span>
						<span style={{ marginLeft: ".28rem", fontSize: "1rem",  }}>points</span>
					</span>
				</div>

				<div className="header--profile">
					<p>{capFirst(user?.name?.split(" ")[0])}</p>
				</div>
			</div>
		</header>
	);
}
