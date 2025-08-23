 
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import BackButton from "../elements/BackButton";
import { BiChevronRight, BiLogOut, BiSupport, BiUser } from "react-icons/bi";
import CustomAlert from "../elements/CustomAlert";
import { createPortal } from "react-dom";
import ExtraSmall from "../modal/ExtraSmall";
import PhoneNumberInput from "../forms/PhoneNumberInput";
import FormButton from "../forms/FormButton";
import { CiUser } from "react-icons/ci";
import { useDataContext } from "../../context/DataContext";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import { capFirst } from "../../utils/helper";
import Asterisk from "../elements/Asterisk";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
	const { signoutUser, user, headers, handleUser } = useAuthContext();
	const { prevTabShown, handleTabShown } = useDataContext();
	
	const [response, setResponse] = useState({ status: "", message: "" });
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		gender: "",
		phone: "",
		phoneNumber: "",
		dialCode: "",
		countryCode: "",
	});

	const handleChangeData = function (e: React.ChangeEvent<HTMLInputElement> | any) {
		const { name, value } = e?.target;
		setFormData({ ...formData, [name]: value });
	};

	const resetResponse = function () {
		setResponse({ status: "", message: "" });
	};

	const handleToggleModal = function () {
		setShowModal(!showModal);
	};

	const handleLogout = async function () {
		const result = await signoutUser();
		if (!result) setResponse({ status: "error", message: "Error" });
		else {
			setResponse({ status: "success", message: "Success" });
			handleTabShown("explore");
			localStorage.setItem("scrollPosition", "0");
		}
	};

	useEffect(function () {
		window?.scrollTo(0, 0);

		if(user) {
			setFormData({
				name: user?.name,
				email: user?.email,
				gender: user?.gender,
				phone: user?.phone,
				phoneNumber: user?.phoneNumber,
				dialCode: user?.dialCode,
				countryCode: user?.countryCode,
			});
		}
	}, [user, showModal]);


	async function handleSave(event: any) {
		event?.preventDefault();
		resetResponse();

		if(!formData.name || !formData.email || !formData.gender || !formData.phoneNumber) {
			setResponse({ status: "error", message: "Fill all required field!" });
			return;
		}

		setLoading(true);

        try {
            const res = await fetch(`${BASE_API_URL}/auth/update-profile`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if(data.status !== 'success') {
                throw new Error(data.message);
            }

			setShowModal(false);
			handleUser(data?.data?.user);
			setResponse({ status: "success", message: data?.message });
            
        } catch(err: any) {
            setResponse({ status: "error", message: err.message })
        } finally {
            setLoading(false)
        }
    }

	return (
		<React.Fragment>
			{response?.message && createPortal(<CustomAlert type={response?.status} message={response?.message} />, document.body)}

			{showModal &&
				createPortal(
					<ExtraSmall handleClose={handleToggleModal} removeCloseAbility={loading}>
						<div className="modal--details">
							<h3>Edit Profile</h3>

							<form style={{ width: "100%" }} className="auth--form" onSubmit={handleSave}>
								<div className="form--item">
									<label htmlFor="name" className="form--label">First name <Asterisk /></label>
									<input type="text" name="name" id="name" className="form--input" placeholder="Alex" value={capFirst(formData.name)} onChange={handleChangeData} />
								</div>
								<div className="form--item">
									<label htmlFor="email" className="form--label">Email Address <Asterisk /></label>
									<input type="email" name="email" id="email" placeholder="example@email.com" className="form--input" value={formData.email?.toLowerCase()} onChange={handleChangeData} />
								</div>
								<div className="form--item">
									<label htmlFor="gender" className="form--label">Gender <Asterisk /></label>
									<select name="gender" id="gender" className="form--input" value={formData.gender} onChange={handleChangeData}>
										<option hidden>Select your gender</option>
										<option value="male">Male</option>
										<option value="female">Female</option>
									</select>
								</div>
								<PhoneNumberInput setData={setFormData} data={formData} value={formData.phone} />
								<FormButton title="Save" loading={loading} loadingText="Saving..." />
							</form>
						</div>
					</ExtraSmall>,
					document.body,
				)
			}

			<Fade className="section" duration={500}>
				<div>
					<div style={{ display: "flex", alignItems: "center", gap: "1.2rem", fontWeight: "500" }}>
						<BackButton handleBack={() => handleTabShown(prevTabShown)} />
						<p>Back</p>
					</div>

					<div className="profile--container page--container">
						<h3 className="heading">Manage your profile</h3>

						<div className="profile--detail">
							<span className="promote--icon">
								<CiUser />
							</span>
							<p>{capFirst(user?.name)}</p>
						</div>

						<div className="profile--elements">
							<div className="profile--figure" onClick={handleToggleModal}>
								<div className="element--main">
									<span>
										<BiUser />
									</span>

									<div className="element--details">
										<h4 className="title">My Profile</h4>
										<p className="text">Update your profile</p>
									</div>
								</div>

								<BiChevronRight />
							</div>

							<Link className="profile--figure" to={import.meta.env.VITE_TAWKTO_CHAT_LINK}>
								<div className="element--main">
									<span><BiSupport /></span>

									<div className="element--details">
										<h4 className="title">Support</h4>
										<p className="text">Chat support when you need</p>
									</div>
								</div>

								<BiChevronRight />
							</Link>
						</div>

						<button className="page--tab active delete--btn" onClick={handleLogout}>
							Logout <BiLogOut />
						</button>
					</div>
				</div>
			</Fade>
		</React.Fragment>
	);
};
