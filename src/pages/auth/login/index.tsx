import React, { useEffect, useState } from "react";

import img from "../../../assets/logo/addups-bright.png";

import PasswordInput from "../../../components/forms/PasswordInput";
import PhoneNumberInput from "../../../components/forms/PhoneNumberInput";
import { useAuthContext } from "../../../context/AuthContext";
import CustomAlert from "../../../components/elements/CustomAlert";
import FormButton from "../../../components/forms/FormButton";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function index() {
	const navigate = useNavigate();
	const { handleChange, user } = useAuthContext();
	const [_, setCountryCode] = useLocalStorage("iso2", "");

	const [response, setResponse] = useState({ status: "", message: "" });
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		phone: "",
		phoneNumber: "",
		password: "",
		dialCode: "",
		countryCode: "",
		country: "",
	});

	const handleChangeData = function (e: React.ChangeEvent<HTMLInputElement> | any) {
		const { name, value } = e?.target;
		setFormData({ ...formData, [name]: value });
	};

    const resetResponse = function() {
        setResponse({ status: "", message: "" });
	}

	async function handleLogin(e: any) {
		e.preventDefault();
        resetResponse();

		const { phone, password } = formData;
		if (!phone || !password) {
            setResponse({ status: "error", message: "Fill up both fields!" });
			return setTimeout(() => resetResponse(), 1500);
		}
        
        setLoading(true);
		try {
			const response = await fetch(`${BASE_API_URL}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone, password }),
			});

			const data = await response.json();
            if (!data?.status || data?.status !== 'success') {
                throw new Error(data?.message);
            }

			setCountryCode(formData.countryCode)
			setResponse({ status: "success", message: "Success" });
            setTimeout(() => handleChange(data?.data?.user, data?.token), 1200);
		} catch (err: any) {
			setResponse({ status: "error", message: err?.message });
		} finally {
            setLoading(false)
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

				<h1 className="form--heading">Login</h1>
				<p className="form--info">Yo, welcome back, Bestie! 🔥 Are you ready to squad up and get more friends? 😎 Sign right back in! 👋</p>

				<form className="auth--form" onSubmit={handleLogin}>
					<PhoneNumberInput setData={setFormData} data={formData} value={formData.phone} />
					<PasswordInput title="Password" name="password" value={formData.password} handleChange={handleChangeData} />
					<div className="form--info" style={{ margin: "-0.6rem 0 -0.6rem auto", fontSize: "1.2rem" }}>
                    	{/* <Link to='/forgot'>Forgot Password</Link> */}
					</div>

                    <FormButton title="Login" loading={loading} />

					<div className="form--info">
						<p>I'm new here, <Link to="/signup">Register</Link></p>
					</div>
				</form>
			</div>
		</React.Fragment>
	);
}