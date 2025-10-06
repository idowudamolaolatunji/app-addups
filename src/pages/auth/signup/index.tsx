 
import React, { useEffect, useState } from "react";

import img from "../../../assets/logo/addups-bright.png";

import PasswordInput from "../../../components/forms/PasswordInput";
import PhoneNumberInput from "../../../components/forms/PhoneNumberInput";
import FormButton from "../../../components/forms/FormButton";
import CustomAlert from "../../../components/elements/CustomAlert";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import Asterisk from "../../../components/elements/Asterisk";
import { ghRegions, ngStates } from "../../../utils/data";
import { useLocalStorage } from "react-use";


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function index() {
	const navigate = useNavigate();
	const { user } = useAuthContext();
	const [_, setCountryCode] = useLocalStorage("iso2", "");

	const [response, setResponse] = useState({ status: "", message: "" });
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		gender: "",
		country: "",
		phone: "",
		phoneNumber: "",
		password: "",
		dialCode: "",
		region: "",
		countryCode: "",
		passwordConfirm: "",
	});

	const handleChangeData = function (e: React.ChangeEvent<HTMLInputElement> | any) {
		const { name, value } = e?.target;
		setFormData({ ...formData, [name]: value });
	};

	const resetResponse = function() {
        setResponse({ status: "", message: "" });
	}

	useEffect(function() {
		if(formData.password) {
			setFormData({ ...formData, passwordConfirm: formData.password })
		}
	}, [formData.password]);

	async function handleSubmit(e: any) {
		e.preventDefault();
		resetResponse();

		const { phone, password, name, email, gender, region } = formData;
		if (!phone || !password || !name || !email || !gender || !region) {
			setResponse({ status: "error", message: "Fill up both fields!" });
            return setTimeout(() => resetResponse(), 1500);
		}
        
		setLoading(true);
		
		try {
			const response = await fetch(`${BASE_API_URL}/auth/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await response.json();
			if (!data?.status || data?.status !== "success") {
				throw new Error(data?.message);
			}

			setCountryCode(formData.countryCode)
			setResponse({ status: "success", message: "Success" });
			setTimeout(() => navigate("/login"), 1000);
		} catch (err: any) {
			setResponse({ status: "error", message: err?.message });
		} finally {
			setLoading(false);
		}
	}

	useEffect(function () {
		if (user) {
			navigate("/app");
		}
	}, [user])

	return (
		<React.Fragment>
			{response?.message && <CustomAlert type={response?.status} message={response?.message} />}

			<div className="auth__section">
				<Link to="/" className="auth--image">
					<img src={img} alt="logo image" />
				</Link>

				<h1 className="form--heading">Register</h1>
				<p className="form--info">Hey Bestie! 🚀 Ready connect with more friends? 📃 Fill up your details and get started! ✨</p>

				<form className="auth--form" onSubmit={handleSubmit}>
					<div className="form--item">
						<label htmlFor="name" className="form--label">
							First name <Asterisk />
						</label>
						<input type="text" name="name" id="name" className="form--input" placeholder="Taiwo" value={formData.name} onChange={handleChangeData} />
					</div>
					<div className="form--item">
						<label htmlFor="email" className="form--label">
							Email Address <Asterisk />
						</label>
						<input type="email" name="email" id="email" placeholder="example@email.com" className="form--input" value={formData.email} onChange={handleChangeData} />
					</div>
					<div className="form--item">
						<label htmlFor="gender" className="form--label">
							Gender <Asterisk />
						</label>
						<select name="gender" id="gender" className="form--input" value={formData.gender} onChange={handleChangeData}>
							<option hidden>Select your gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
					<PhoneNumberInput setData={setFormData} data={formData} value={formData.phone} />
					<div className="form--item">
						<label htmlFor="region" className="form--label">
							{formData.country == "nigeria" ? "State" : "Region"} <Asterisk />
						</label>
						<select name="region" id="region" className="form--input" value={formData.region} onChange={handleChangeData}>
							<option hidden>Select your {formData.country == "nigeria" ? "state" : "region"}</option>
							{formData.country == "nigeria" && (
								ngStates.map((state: { name: string, value: string }) => (
									<option value={state.value} key={state.value}>{state.name}</option>
								))
							)}

							{formData.country == "ghana" && (
								ghRegions.map((region: { name: string, value: string }) => (
									<option value={region.value} key={region.value}>{region.name}</option>
								))
							)}

							{!formData.country && (
								<option disabled>Add you phone number first</option>
							)}
						</select>
					</div>
					<PasswordInput title="Password" name="password" value={formData.password} handleChange={handleChangeData} />

					<FormButton title="Submit" loading={loading} />

					<div className="form--info">
						<p>Not your first time? <Link to="/login">login</Link></p>
					</div>
				</form>
			</div>
		</React.Fragment>
	);
}