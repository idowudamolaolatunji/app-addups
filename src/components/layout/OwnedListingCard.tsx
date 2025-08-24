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
import CustomAlert from "../elements/CustomAlert";
import { useFetchedContext } from "../../context/FetchedContext";
import { useDataContext } from "../../context/DataContext";


const BASE_API_URL = import.meta.env.VITE_API_URL;


export default function OwnedListingCard({ listing }: { listing: ListingType }) {
	const { handleTabShown } = useDataContext();
	const { user, headers, handleUser } = useAuthContext();
	const { setMyListings, setTransactions } = useFetchedContext()
	const durationAndPointValue = user?.country == "nigeria" ? ngDurationAndPointValue : ghDurationAndPointValue;

	const [countdown, setCountdown] = useState("loading");
	const [showModal, setShowModal] = useState(false);
	const [response, setResponse] = useState({ status: "", message: "" });
	const [loading, setLoading] = useState(false);
	const [displayDuration, setDisplayDuration] = useState("");
	const [paymentValue, setPaymentValue] = useState({ pointAmount: 0, priceAmount: 0 })


	const resetResponse = function () {
		setResponse({ status: "", message: "" });
	};

	const handleClearField = function() {
		setDisplayDuration("")
		setPaymentValue({ pointAmount: 0, priceAmount: 0 })
	}

	const handleModal = function () {
		setShowModal(!showModal);
		handleClearField();
	};

	useEffect(function() {
		const duration = displayDuration;
		if(duration) {
			const value = durationAndPointValue.filter((el: DurationDetailsType) => el.durationInHours == duration)[0];
			setPaymentValue({ pointAmount: value.points, priceAmount: value.amount })
		}
	}, [displayDuration]);

	// HELPS US COUNT THE REMAINING TIME FOR THE LISTING TO END
	useEffect(function() {
		const targetDate = moment(listing?.dateTimeToExpire);

		const intervalId = setInterval(() => {
			const now = moment();
			const diff = moment.duration(targetDate.diff(now));
			// const hours = diff.hours();
			const hours = Math.floor(diff.asHours());
			const minutes = diff.minutes();
			const seconds = diff.seconds();
			if (hours <= 0 && minutes <= 0 && seconds <= 0) {
				return setCountdown("");
			}
			// setCountdown(hours > 0 ? `${hours} hrs, ${minutes} mins, ${seconds} secs` : `${minutes} mins, ${seconds} secs`);

			let countdownText;
			if (hours > 0) {
				countdownText = `${hours} hrs, ${minutes} mins, ${seconds} secs`;
			} else if (minutes > 0) {
				countdownText = `${minutes} mins, ${seconds} secs`;
			} else {
				countdownText = `${seconds} secs`;
			}

        	setCountdown(countdownText);
			if (diff.asSeconds() <= 0) {
				clearInterval(intervalId);
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [listing?.dateTimeToExpire]);


	async function handleAddMoreTime() {
		resetResponse();
		setLoading(true);
		
		const hoursToAdd = +displayDuration;
		const pointAmount = +paymentValue.pointAmount;
        try {
			const res = await fetch(`${BASE_API_URL}/listings/add-time/${listing._id}`, {
                method: 'PATCH', headers,
                body: JSON.stringify({ pointAmount, hoursToAdd })
            });

            const data = await res.json();
            if(data.status !== 'success') {
                throw new Error(data.message);
            }

			setShowModal(false);
			handleUser(data?.data?.user);
			setMyListings(data?.data?.listings);
			setTransactions(data?.data?.transactions);
			setResponse({ status: "success", message: `${hoursToAdd} more hours added!` });            
        } catch(err: any) {
            setResponse({ status: "error", message: err.message })
        } finally {
            setLoading(false);
        }
	}
	
	return (
		<React.Fragment>
			{response?.message && 
				createPortal(
					<CustomAlert type={response?.status} message={response?.message} />, document.body
				)
			}

			{showModal &&
				createPortal(
					<ExtraSmall handleClose={handleModal} removeCloseAbility={loading}>
						<div className="modal--details">
							<h3>Add more time</h3>

							<form className="auth--form" style={{ width: "100%" }}>
								<div className="form--item">
									<label htmlFor="displayDuration" className="form--label">
										How much more time do u want to add? <Asterisk />
									</label>
									<select id="displayDuration" className="form--input" value={displayDuration} onChange={(e) => setDisplayDuration(e.target.value)}>
										<option hidden>Duration</option>
										{durationAndPointValue.map((data: DurationDetailsType, i: number) => (
											<option key={i} value={data?.durationInHours}>{`${data?.duration}, ${data?.priceInFigure} equals ${data?.amountInFigure}`})</option>
										))}
									</select>
								</div>

								<button className="form--submit" disabled={loading || !displayDuration} onClick={() => {
									if(+user?.pointBalance < +paymentValue.pointAmount) {
										handleTabShown("points");
									} else {
										handleAddMoreTime();
									}
								}}>{loading ? "Adding..." : !displayDuration ? "Add Time" : `${(+user?.pointBalance < +paymentValue.pointAmount) ? "Not Enough Points (Click to Buy)" : `Add extra ${displayDuration} hours`}`}</button>
							</form>
						</div>
					</ExtraSmall>,
					document.body
				)
			}

			<figure className={`owned-listing--card ${listing?.status}`} style={{ borderRadius: ".4rem" }}>
				<p>{truncateString(listing?.displayName)}</p>

				<img src={listing?.displayImage?.url} alt={listing?.displayName} />

				<span className="card--timing">
					{(countdown == "loading") ?
						"Loading..." 
					: 
						(countdown ? 
							`Ends in ${countdown}` 
						: 
							`Has ended since ${formatDateSince(listing?.dateTimeToExpire)}`
						)
					}
				</span>

				{/* {(!listing?.extraDisplayDurationInHours && listing?.status == "active") && ( */}
				{(listing?.status == "active") && (
					<button className="card--add" onClick={handleModal}>
						Add more time <LuClock />
					</button>	
				)}
			</figure>
		</React.Fragment>
	);
};