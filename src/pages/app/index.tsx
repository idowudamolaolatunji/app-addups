import React, { useState } from "react";
import Header from "../../components/layout/Header";
import ExplorePage from '../../components/pageComponent/ExplorePage';
import ListingPage from '../../components/pageComponent/ListingPage';
import MobileMenu from "../../components/layout/MobileMenu";
import ProfilePage from '../../components/pageComponent/ProfilePage';
import PointPage from '../../components/pageComponent/PointPage';
import AddListing from "../../components/pageComponent/AddListing";
import { useDataContext } from "../../context/DataContext";
import { useAuthContext } from "../../context/AuthContext";
import ExtraSmall from "../../components/modal/ExtraSmall";
import { capFirst } from "../../utils/helper";
import { GiCrownCoin } from "react-icons/gi";
import CustomAlert from "../../components/elements/CustomAlert";

const pointAmount = 1000;
const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function index() {
	const { user, headers, handleUser } = useAuthContext();
	const { tabShown, handleTabShown } = useDataContext();
	//////////////////////////////////////////////////////
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState({ status: "", message: "" });
	

	async function handleClaimFirstTimePoints() {
		setLoading(true);
		handleUser({ ...user, pointBalance: user?.pointBalance + pointAmount });

		const res = await fetch(`${BASE_API_URL}/points/reward/recieve`, {
			method: 'PATCH', headers,
			body: JSON.stringify({ amount: pointAmount }),
		});

		const data = await res.json();
		setResponse({ status: "success", message: data?.message })
		handleUser(data?.data?.user);
		setLoading(false);
	}

	return (
		<React.Fragment>
			{response?.message && <CustomAlert type={response?.status} message={response?.message} />}

			{(user?.isNewUser) && (
				<ExtraSmall removeCloseAbility={true}>
					<div className="modal--details" style={{ alignItems: "center" }}>
						<span style={{ marginLeft: "1.4rem" }}>
							<picture>
								<source srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
								<img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="90" height="90" />
							</picture>
						</span>
						<h3 style={{ margin: "1rem 0 0" }}>Hi {capFirst(user?.name)} 😍, Welcome!</h3>
						<p style={{ textAlign: "center" }}>Welcome to Addups, Claim your <span className="bold-extra">{pointAmount} poins</span>, start racking more points and get your own WhatsApp profile listed!</p>
						<button className="promote--btn" style={{ gap: "0.48rem" }} disabled={loading} onClick={handleClaimFirstTimePoints}>
							{loading ? "Claiming..." : (<>Claim your<span className="number">{pointAmount}</span> <GiCrownCoin /> Addups Points</>)}
						</button>
					</div>
				</ExtraSmall>
			)}

			{(tabShown == "explore" || tabShown == "listing" || tabShown == "points") && (
				<Header />
			)}

			{tabShown == "explore" && <ExplorePage />}
			{tabShown == "listing" && <ListingPage />}
			{tabShown == "points" && <PointPage />}

			{tabShown == "add-listing" && <AddListing />}

			{tabShown == "profile" && <ProfilePage />}

			{(tabShown != "add-listing" || tabShown != "add-listing") && (
				<MobileMenu tabShown={tabShown} setTabShown={handleTabShown} />
			)}
		</React.Fragment>
	);
}