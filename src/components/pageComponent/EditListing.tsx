import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import BackButton from "../elements/BackButton";
import PhoneNumberInput from "../forms/PhoneNumberInput";
import ImageUpload from "../forms/ImageUpload";
import { capFirst } from "../../utils/helper"
import { useLocalStorage } from "react-use";
import Asterisk from "../elements/Asterisk";
import CustomAlert from "../elements/CustomAlert";
import { useDataContext } from "../../context/DataContext";


interface PromotionData {
	displayName: string;
	type: string;
	phone: string;
	phoneNumber: string;
	country: string;
	details: string;
	targetGender: string;
}

interface PhotoProps {
	file: any | null;
	preview: string | null
}


export default function EditListing() {
	const { prevTabShown, handleTabShown } = useDataContext();

	const [formData, setFormData] = useState<PromotionData | any>({
		displayName: "",
		type: "whatsapp",
		phone: "",
		phoneNumber: "",
		country: "",
		details: "",
		targetGender: ""
	});
	const [displayPhoto, setDisplayPhoto] = useState<PhotoProps>({ file: null, preview: null })

	// const [showModal, setShowModal] = useState(false);
	// const [response, setResponse] = useState({ status: "", message: "" });5
	const [response] = useState({ status: "", message: "" });5
	const [formIsFilled, setFormIsFilled] = useState(false);
    // const [loading, setLoading] = useState(false);

	const [value, _, remove] = useLocalStorage<PromotionData | any>("promotion_data");

	const handleGoBack = function() {
		remove();
		handleTabShown(prevTabShown);
	};

	const handleChangeData = function (e: React.ChangeEvent<HTMLInputElement> | any) {
		const { name, value } = e?.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleImageChange = function (event: any) {
		const file = event.target.files[0];

		if (file) {
			const preview: any = URL.createObjectURL(file);
			setDisplayPhoto({ file, preview });
		}
	};

	const handleImageRemove = function () {
		setDisplayPhoto({ file: null, preview: null });
	};

	const handleShowConfirm = function () {
	}

	useEffect(function() {
		window.scrollTo(0, 0);
	}, []);

	useEffect(function() {
		setFormData({ 
			...formData,
			displayName: value?.displayName,
			details: value?.details,
			phone: value?.details,
			type: value?.type,
			targetGender: value?.targetGender
		});

		setDisplayPhoto({
			file: null,
			preview: value?.displayPhoto ? `http://localhost:3030${value?.displayPhoto}` : null
		});
	}, [value]);

	useEffect(function() {
		setFormData({ ...formData, details: formData.phone })
	}, [formData.phone])

	useEffect(function() {
		if(formData.type != value?.type) {
			setFormData({ ...formData, details: "" })
		} else {
			setFormData({ ...formData, details: value?.details })
		}
	}, [formData.type, value])

	useEffect(function() {
		if(!formData.displayName || !formData.details || !formData.targetGender) {
			setFormIsFilled(false);
		} else {
			setFormIsFilled(true);
		}
	}, [formData])


	return (
		<React.Fragment>
			{response?.message && <CustomAlert type={response?.status} message={response?.message} />}

			<Fade className="section" style={{ marginBottom: "6rem" }}>
				<div style={{ display: "flex", alignItems: "center", gap: "1.2rem", fontWeight: "500" }}>
					<BackButton handleBack={handleGoBack} />
					<p>Back</p>
				</div>

				<form className="auth--form" style={{ marginTop: "-2rem" }}>
					<div className="form--item">
						<label htmlFor="" className="form--label">
							Set your promotion type
						</label>
						<select name="type" className="form--input" value={formData.type} onChange={handleChangeData}>
							<option value="whatsapp">WhatsApp</option>
							<option value="instagram">Instagram</option>
							<option value="tiktok">Tiktok</option>
						</select>
					</div>

					<div className="form--item">
						<label htmlFor="displayName" className="form--label">
							Display Name <Asterisk />
						</label>
						<input type="text" name="displayName" id="displayName" className="form--input" placeholder="Enter the name to be shown" value={formData.displayName} onChange={handleChangeData} />
					</div>

					<div className="form--item">
						{formData.type == "whatsapp" ? (
							<PhoneNumberInput setData={setFormData} data={formData} value={formData.phone} title="WhatsApp Number" />
						) : (
							<>
								<label htmlFor="details" className="form--label">
									{`${formData.type ? capFirst(formData.type) : ""} username`} <Asterisk />
								</label>
								<input type="text" name="details" className="form--input" placeholder={`Your ${formData.type ? capFirst(formData.type)  : ""} username`} value={formData.details} onChange={handleChangeData} />
							</>
						)}
					</div>

					<div className="form--item">
						<label htmlFor="targetGender" className="form--label">
							What gender do you want this shown to? <Asterisk />
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

					<div className="form--item" style={{ marginBottom: "2rem" }}>
						<label className="form--label">
							Display Photo (optional)
						</label>
						<ImageUpload name="displayPhoto" preview={displayPhoto.preview} handleChange={handleImageChange} handleRemove={handleImageRemove} />
					</div>

					<button className={`form--submit ${!formIsFilled ? "in-active" : ""}`} type="button" onClick={handleShowConfirm}>Submit Promotion</button>
				</form>
			</Fade>
		</React.Fragment>
	);
}