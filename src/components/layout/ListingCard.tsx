 
import React, { useState } from "react";
import { GiCrownCoin } from "react-icons/gi";
import { truncateString } from "../../utils/helper";
import ExtraSmall from "../modal/ExtraSmall";
import { createPortal } from "react-dom";
import { TfiLocationPin } from "react-icons/tfi";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useFetchedContext } from "../../context/FetchedContext";
import type { ListingType } from "../../utils/types";
import whatsapp from "../../assets/logo/whatsapp-48.png"


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function ListingCard({ data }: { data: ListingType }) {
	const { setTransactions } = useFetchedContext();
	const { user, headers, handleUser } = useAuthContext();

	const [showModal, setShowModal] = useState(false);
	const [truncateCount, setTruncateCount] = useState(100);

	const handleModal = function () {
		setShowModal(!showModal);
	};

	async function handleRewardPoint() {
		handleUser({ ...user, pointBalance: user?.pointBalance + 15 });

		const res = await fetch(`${BASE_API_URL}/points/recieve`, {
			method: 'PATCH', headers,
			body: JSON.stringify({ amount: 15 }),
		});

		const data = await res.json();

		setShowModal(false);
		handleUser(data?.data?.user)
		setTransactions(data?.data?.transactions)
	}

	return (
		<React.Fragment>
			{showModal &&
				createPortal(
					<ExtraSmall handleClose={handleModal}>
						<div className="modal--details">
							<h3>Add Contact</h3>

							<p>Save the contact as <span className="bold-extra">{data?.displayName}</span>. Click on <strong>"Add contact"</strong> to add this profile on WhatsApp and earn <span className="bold-extra flex-align-cen">+15 <GiCrownCoin /></span></p>

							<Link to={data?.link} onClick={handleRewardPoint} className="promote--btn">Add Contact</Link>
						</div>
					</ExtraSmall>, document.body
				)
			}

			<figure className="listing--card" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), 55%, rgba(0, 0, 0, .8)), url(${data?.displayImage?.url})` }}>
				<div className="card--details">
					<h4 className="title">{truncateString(data?.displayName)}</h4>
					<p className="description">
						{truncateString(data?.description, truncateCount)}{" "}
						{data?.description?.length > 100 ? <span style={{ color: "orange", fontWeight: "600", cursor: "pointer" }} onClick={() => setTruncateCount(truncateCount == 100 ? 10000 : 100)}>{truncateCount <= 100 ? "More" : "Less"}</span> : ""}
					</p>

					<div className="infos">
						{data?.lister.region && (
							<span className="info">
								<TfiLocationPin />
								<p>{data?.lister.region}, {data.lister.country}</p>
							</span>
						)}

						{data?.lister.gender && (
							<span className="info">
								<AiOutlineUser />
								<p>{data?.lister.gender}</p>
							</span>
						)}

						<span className="info">
							<img src={whatsapp} alt="addups whatsapp" style={{ width: "2rem" }} />
						</span>
					</div>

					<div className="actions">
						<button className="card--btn filled" onClick={handleModal} style={{ width: "14rem", justifyContent: "center" }}>
							Add up +15 <GiCrownCoin />
						</button>
					</div>
				</div>
			</figure>
		</React.Fragment>
	);
};
