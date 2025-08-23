import React, { useEffect, useState } from "react";
import moment from "moment";
import { LuClock } from "react-icons/lu";
import ExtraSmall from "../modal/ExtraSmall";
import { createPortal } from "react-dom";
import { formatDateSince, truncateString } from "../../utils/helper";
import Asterisk from "../elements/Asterisk";
import { useAuthContext } from "../../context/AuthContext";
import { ghDurationAndPointValue, ngDurationAndPointValue } from "../../utils/data";
import type { DurationDetailsType, ListingType } from "../../utils/types";

// const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function OwnedListingCard({ data }: { data: ListingType }) {
	const { user } = useAuthContext();
	const durationAndPointValue = user?.country == "nigeria" ? ngDurationAndPointValue : ghDurationAndPointValue;

	const [countdown, setCountdown] = useState("loading");
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({ displayDuration: "" });
	// const [response, setResponse] = useState({ status: "", message: "" });
	// const [loading, setLoading] = useState(false);


	// const resetResponse = function () {
	// 	setResponse({ status: "", message: "" });
	// };
	
	const handleChangeData = function (e: React.ChangeEvent<HTMLInputElement> | any) {
		const { name, value } = e?.target;
		setFormData({ ...formData, [name]: value });
	};



	const handleModal = function () {
		setShowModal(!showModal);
	};

	useEffect(() => {
		const targetDate = moment(data?.dateTimeToExpire);

		const intervalId = setInterval(() => {
			const now = moment();
			const diff = moment.duration(targetDate.diff(now));
			const hours = diff.hours();
			const minutes = diff.minutes();
			const seconds = diff.seconds();
			if (hours <= 0 && minutes <= 0 && seconds <= 0) {
				return setCountdown("");
			}
			setCountdown(`${hours} hrs, ${minutes} mins, ${seconds} secs`);
			if (diff.asSeconds() <= 0) {
				clearInterval(intervalId);
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [data?.dateTimeToExpire]);

	
	return (
		<React.Fragment>
			{showModal &&
				createPortal(
					<ExtraSmall handleClose={handleModal}>
						<div className="modal--details">
							<h3>Add more time</h3>

							<form className="auth--form" style={{ width: "100%" }}>
								<div className="form--item">
									<label htmlFor="displayDuration" className="form--label">
										How much more time do u want to add? <Asterisk />
									</label>
									<select name="displayDuration" id="displayDuration" className="form--input" value={formData.displayDuration} onChange={handleChangeData}>
										<option hidden>Duration</option>
										{durationAndPointValue.map((data: DurationDetailsType, i: number) => (
											<option key={i} value={data?.durationInHours}>{`${data?.duration}, ${data?.priceInFigure} equals ${data?.amountInFigure}`})</option>
										))}
									</select>
								</div>

								<button className={`form--submit`} type="button" onClick={() => {}}>Add time</button>
							</form>
						</div>
					</ExtraSmall>,
					document.body
				)
			}

			<figure className={`owned-listing--card ${data?.status}`} style={{ borderRadius: ".4rem" }}>
				<p>{truncateString(data?.displayName)}</p>

				<img src={data?.displayImage?.url} alt={data?.displayName} />

				<span className="card--timing">
					{(countdown == "loading") ?
						"Loading..." 
					: 
						(countdown ? 
							`Ends in ${countdown}` 
						: 
							`Has ended since ${formatDateSince(data?.dateTimeToExpire)}`
						)
					}
				</span>

				{data?.status == "active" && (
					<button className="card--add" onClick={handleModal}>
						Add more time <LuClock />
					</button>	
				)}
			</figure>
		</React.Fragment>
	);
};