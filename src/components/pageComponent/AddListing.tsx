import React, { useEffect, useState } from "react";
import BackButton from "../elements/BackButton";
import PhoneNumberInput from "../forms/PhoneNumberInput";
import ImageUpload from "../forms/ImageUpload";
import Asterisk from "../elements/Asterisk";
import CustomAlert from "../elements/CustomAlert";
import { useDataContext } from "../../context/DataContext";
import { Fade } from "react-awesome-reveal";
import ExtraSmall from "../modal/ExtraSmall";
import { HiOutlineHandThumbUp } from "react-icons/hi2";
import { useAuthContext } from "../../context/AuthContext";
import { PaystackButton } from "react-paystack";
import { useFetchedContext } from "../../context/FetchedContext";
import { ghDurationAndPointValue, ngDurationAndPointValue } from "../../utils/data";
import type { DurationDetailsType } from "../../utils/types";


interface FormData {
	phone: string;
	displayName: string;
	phoneNumber: string;
	targetGender: string;
	displayDuration: string;
	description?: string;
}
  
const BASE_API_URL = import.meta.env.VITE_API_URL;
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;


export default function AddListing() {
	const { user, token, handleUser } = useAuthContext();
	const { prevTabShown, handleTabShown } = useDataContext();
	const { setTransactions, setMyListings } = useFetchedContext();
	const durationAndPointValue = user?.country == "nigeria" ? ngDurationAndPointValue : ghDurationAndPointValue

	const [formData, setFormData] = useState<FormData>({
		displayName: "",
		phone: "",
		phoneNumber: "",
		targetGender: "",
		displayDuration: "",
		description: "",
	});
	
	const [paymentValue, setPaymentValue] = useState({ pointAmount: 0, priceAmount: 0 });
	const [showModal, setShowModal] = useState(false);
	const [response, setResponse] = useState({ status: "", message: "" });
	const [formIsFilled, setFormIsFilled] = useState(false);
    const [loading, setLoading] = useState(false);
	const [displayImage, setDisplayImage] = useState({ file: null, preview: null });

	const handleClearForm = function() {
		setFormData({
			displayName: "",
			phone: "",
			phoneNumber: "",
			targetGender: "",
			displayDuration: "",
			description: "",
		});
		setDisplayImage({ file: null, preview: null });
		setPaymentValue({ pointAmount: 0, priceAmount: 0 })
	}

	const resetResponse = function() {
        setResponse({ status: "", message: "" });
	}

	const handleChangeData = function (e: React.ChangeEvent<HTMLInputElement> | any) {
		const { name, value } = e?.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleImageChange = function (event: any) {
		const file = event.target.files[0];

		if (file) {
			const preview: any = URL.createObjectURL(file);
			setDisplayImage({ file, preview });
		}
	};

	const handleImageRemove = function () {
		setDisplayImage({ file: null, preview: null });
	};

	const handleShowConfirm = function () {
		resetResponse();

		if(!formIsFilled) {
			setResponse({ status: "error", message: "Fill up both fields!" });
			return;
		}

		setShowModal(true);
	}

	useEffect(function() {
		window.scrollTo(0, 0);
	}, []);

	
	useEffect(function() {
		if(!displayImage.file || !formData.displayName || !formData.phoneNumber || !formData.displayDuration) {
			setFormIsFilled(false);
		} else {
			setFormIsFilled(true);
		}
	}, [formData]);
	
	useEffect(function() {
		const duration = formData.displayDuration;
		if(duration) {
			const value = durationAndPointValue.filter((el: DurationDetailsType) => el.durationInHours == duration)[0];
			setPaymentValue({ pointAmount: value.points, priceAmount: value.amount })
		}
	}, [formData.displayDuration])

	async function handlePaymentAndCreate(reference: string, type: string) {
		resetResponse();
		setLoading(true);

		const { displayName, phone, description, targetGender, displayDuration } = formData;
		const pointAmount = paymentValue.pointAmount;
		const link = `https://wa.me/${phone}`;

        try {
            const formData = new FormData();
			formData.append('displayName', displayName);
			formData.append("link", link);
			formData.append("reference", reference);
			formData.append("description", description || `Hi, add me on WhatsApp and Save my contact as ${displayName}`);
			formData.append("targetGender", targetGender || "all-gender");
			formData.append("duration", displayDuration);
			formData.append("pointAmount", ""+pointAmount);
			displayImage.file && formData.append("image", displayImage.file);

			const endpointUri = type == "pay" ? `${BASE_API_URL}/listings/pay/create` : `${BASE_API_URL}/listings/points/create`
			const res = await fetch(endpointUri, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();
            if(data.status !== 'success') {
                throw new Error(data.message);
            }

			handleClearForm();
			setShowModal(false);
			//////////////////////////////////////
			handleUser(data?.data?.user);
			setMyListings(data?.data?.listings);
			setTransactions(data?.data?.transactions);
			//////////////////////////////////////
			setResponse({ status: "success", message: data?.message });
			handleTabShown(prevTabShown);
            
        } catch(err: any) {
            setResponse({ status: "error", message: err.message })
        } finally {
            setLoading(false);
        }
	}

	return (
		<React.Fragment>
			{response?.message && <CustomAlert type={response?.status} message={response?.message} />}

			{showModal && (
				<ExtraSmall handleClose={() => setShowModal(false)} removeCloseAbility={loading}>
					<div className="modal--details confirm">
						<span className="promote--icon">
							<HiOutlineHandThumbUp />
						</span>

						<h4>Confirm Listing</h4>
						<p>Your profile will be listed on the explore page for <span className="bold-extra">{formData?.displayDuration} hours</span>, this will cost you <span className="bold-extra">{paymentValue.pointAmount} Points</span></p>

						<div className="actions">
							<button onClick={() => setShowModal(false)} className="card--btn outline" disabled={loading}>Cancel</button>

							{user?.pointBalance < paymentValue.pointAmount ? (
								<PaystackButton
									className={"promote--btn"}
									phone={user?.phone}
									email={user?.email}
									amount={Number(paymentValue.priceAmount) * 100}
									text={loading ? "Paying..." : "Not enought points (Click to buy)"}
									publicKey={PAYSTACK_PUBLIC_KEY}
									onSuccess={({ reference } : { reference: string }) => handlePaymentAndCreate(reference, "pay")}
									onClose={() => {}}
									disabled={loading}
								/>
							) : (
								<button onClick={() => handlePaymentAndCreate((new Date()).getTime().toString(), "points")} className="promote--btn">{loading ? "Loading..." : "Get Listed!"}</button>
							)}
						</div>
					</div>
				</ExtraSmall>
			)}

			<Fade className="section" style={{ marginBottom: "6rem" }} duration={500}>
				<div style={{ display: "flex", alignItems: "center", gap: "1.2rem", fontWeight: "500", marginBottom: "3rem" }}>
					<BackButton handleBack={() => handleTabShown(prevTabShown)} />
					<p>Back</p>
				</div>

				<form className="auth--form" style={{ marginTop: "-2rem" }}>
					<h4 className="form--title">List your profile</h4>

					<div className="form--item">
						<label className="form--label">
							Display Photo <Asterisk />
						</label>
						<ImageUpload name="displayImage" preview={displayImage.preview} handleChange={handleImageChange} handleRemove={handleImageRemove} />
					</div>

					<div className="form--item">
						<label htmlFor="displayName" className="form--label">
							Display Name <Asterisk />
						</label>
						<input type="text" name="displayName" id="displayName" className="form--input" placeholder="Enter the name to be shown" value={formData.displayName} onChange={handleChangeData} />
					</div>

					<div className="form--item">
						<PhoneNumberInput setData={setFormData} data={formData} value={formData.phone} title="WhatsApp Number" />
					</div>

					<div className="form--item">
						<label htmlFor="description" className="form--label">
							Description (optional)
						</label>
						<textarea name="description" id="description" className="form--input form--textarea" placeholder="Description" value={formData.description} onChange={handleChangeData} />
					</div>

					<div className="form--item">
						<label htmlFor="targetGender" className="form--label">
							What gender do you want this shown to? (optional)
						</label>
						<select name="targetGender" id="targetGender" className="form--input" value={formData.targetGender} onChange={handleChangeData}>
							<option hidden>
								Gender to Show to
							</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="all-gender">All Genders</option>
						</select>
					</div>

					<div className="form--item" style={{ marginBottom: "1rem" }}>
						<label htmlFor="displayDuration" className="form--label">
							How long do you want this Listing to run? <Asterisk />
						</label>
						<select name="displayDuration" id="displayDuration" className="form--input" value={formData.displayDuration} onChange={handleChangeData}>
							<option hidden>Duration</option>
							{durationAndPointValue.map((data: DurationDetailsType, i: number) => (
								<option key={i} value={data?.durationInHours}>{`${data?.duration}, ${data?.priceInFigure} equals ${data?.amountInFigure}`})</option>
							))}
						</select>
					</div>

					<button className="form--submit" type="button" onClick={handleShowConfirm} disabled={!formIsFilled || loading}>Submit Listing</button>
				</form>
			</Fade>
		</React.Fragment>
	);
}
