 
import React, { useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import Asterisk from "../elements/Asterisk";


interface InputProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
    value: string;
    title: string;
    name: string;
}

function PasswordInput({ handleChange, value, title, name } : InputProps ) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="form--item">
			<label className="form--label" htmlFor={name}>
				{title} <Asterisk />
			</label>
			<div className="form--input-box">
				<input type={showPassword ? "text" : "password"} name={name} id={name} className="form--input" autoComplete="off" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" value={value} onChange={(e) => handleChange(e)} />
				<div className="form--input-icon" onClick={() => setShowPassword(!showPassword)}>
					{showPassword ? <ImEye /> : <ImEyeBlocked />}
				</div>
			</div>
		</div>
	);
}

export default PasswordInput;
