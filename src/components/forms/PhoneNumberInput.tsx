 
import { useLocalStorage } from "react-use";
import { useAuthContext } from "../../context/AuthContext";
import Asterisk from "../elements/Asterisk";
import PhoneInput from "react-phone-input-2";


interface Props {
	setData: (data: any) => void;
	data: any;
	value: string;
	title?: string;
}

type Options = {
	dialCode: string;
	countryCode: string;
	name: string;
};

function PhoneNumberInput({ setData, data, value, title="Phone Number" }: Props) {
	const { user } = useAuthContext();
	const [countryCode] = useLocalStorage("iso2");

	const handleChangePhoneData = function (val: string, opts: Options) {
		const { dialCode, countryCode, name } = opts;
		const phone = val?.startsWith(dialCode + "0") ? val?.replace(dialCode + "0", dialCode) : val;
		const phoneNumber = phone?.replace(dialCode, "");

		setData({ ...data, phone, phoneNumber, dialCode, countryCode, country: name.toLowerCase() });
	};

	return (
		<div className="form--item">
			<label htmlFor="name" className="form--label">
				{title} <Asterisk />
			</label>

			<PhoneInput
				country={user?.countryCode ? user?.countryCode : countryCode ? countryCode : "gh"}
				onlyCountries={user?.countryCode ? [user?.countryCode] : ["ng", "gh"]}
				value={value}
				inputProps={{ name: "phone", id: "phone" }}
				inputClass="phone-input"
				countryCodeEditable={false}
				onChange={(num: string, countryOpts: Options) => handleChangePhoneData(num, countryOpts)}
				buttonStyle={{ backgroundColor: "transparent", border: "none", paddingLeft: ".4rem", height: "4rem", margin: ".2rem 0" }}
				dropdownStyle={{ top: "100%", marginTop: 0, borderRadius: ".4rem", padding: ".2rem" }}
			/>
		</div>
	);
}

export default PhoneNumberInput;
