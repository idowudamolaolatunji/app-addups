 
import { useEffect, useState } from "react";
import Tab from "../layout/Tab";
import { BsSend } from "react-icons/bs";
import { CiBullhorn } from "react-icons/ci";
import { useFetchedContext } from "../../context/FetchedContext";
import OwnedListingCard from "../layout/OwnedListingCard";
import { AiOutlinePlus } from "react-icons/ai";
// import { Link } from "react-router-dom";
import { useDataContext } from "../../context/DataContext";
import { Fade } from "react-awesome-reveal";
import type { ListingType } from "../../utils/types";


export default function ListingPage() {
	const { myListings, myListingLoading } = useFetchedContext();
    const { handleTabShown } = useDataContext();
	const [activeTab, setActiveTab] = useState("active");

	const activeListings = myListings?.filter((promotion: any) => promotion?.status == "active");
	const inActiveListings = myListings?.filter((promotion: any) => promotion?.status == "inactive");
	const allListings = activeTab == "active" ? activeListings : inActiveListings;

	useEffect(function() {
		window.scrollTo(0, 0);
	}, []);

	return (
		<Fade className="section" duration={500}>
			<div style={{ paddingBottom: "8rem" }}>
				<div className="page--tabs" style={{ justifyContent: "center", maxWidth: "100%" }}>
					<Tab title="Active listings" onClick={() => setActiveTab("active")} active={activeTab == "active"} />
					<Tab title="Inactive listings" onClick={() => setActiveTab("inactive")} active={activeTab == "inactive"} />
				</div>

				<div className="">
					{activeTab == "active" && activeListings?.length > 0 && (
						<div className="promote--container">
							<div className="owned-listing--grid">
								{activeListings?.map((data: ListingType, i: number) => (
									<OwnedListingCard listing={data} key={i} />
								))}
							</div>

							<button className="promote--btn absolute--btn" onClick={() => handleTabShown("add-listing")}>
								<AiOutlinePlus style={{ fontSize: "1.8rem" }} /> Add
							</button>
						</div>
					)}

					{activeTab == "inactive" && inActiveListings?.length > 0 && (
						<div className="promote--container">
							<div className="owned-listing--grid">
								{inActiveListings?.map((data: ListingType, i: number) => (
									<OwnedListingCard listing={data} key={i} />
								))}
							</div>
						</div>
					)}

					{(myListingLoading && allListings?.length < 1) && <p style={{ textAlign: "center", color: "orange" }}>Loading...</p>}

					{(!myListingLoading && allListings?.length == 0) && (
						<div className="promote--container">
							<span className="promote--icon">
								<CiBullhorn />
							</span>

							<h5 className="heading">No {activeTab} listings</h5>

							<p className="text">Want to boost your views and get more addups? List your profile and start connecting with friends!.</p>

							<button className="promote--btn" onClick={() => handleTabShown("add-listing")}>
								List your profile <BsSend />
							</button>

							<div className="form--info">
								{/* <Link target="_blank" to="https://youtu.be/TPACABQTHvM?si=Sp0zOmmp6cs6aT1S">Click here to see how to promote your product</Link> */}
								<span>Click here to see how to promote your product</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</Fade>
	);
}