import React from "react";
import Header from "../../components/layout/Header";
import ExplorePage from '../../components/pageComponent/ExplorePage';
import ListingPage from '../../components/pageComponent/ListingPage';
import MobileMenu from "../../components/layout/MobileMenu";
import ProfilePage from '../../components/pageComponent/ProfilePage';
import PointPage from '../../components/pageComponent/PointPage';
import AddListing from "../../components/pageComponent/AddListing";
import { useDataContext } from "../../context/DataContext";


export default function index() {
	const { tabShown, handleTabShown } = useDataContext();

	return (
		<React.Fragment>
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