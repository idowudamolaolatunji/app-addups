 
import { useEffect, useState } from "react";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { useAuthContext } from "../../context/AuthContext";
import { useDataContext } from "../../context/DataContext";
import { capFirst } from "../../utils/helper";


export default function ListTopBox() {
    const { user } = useAuthContext();
	const { handleTabShown } = useDataContext();

	const [name, setName] = useState("");

	useEffect(function() {
		setName(user?.name)
	}, [user]);

	return (
		<figure className="promote--card">
			<p>Hi, <strong>{capFirst(name?.split(" ")[0])}!</strong> List your own <span style={{ color: "#dd535d", fontWeight: "500" }}>profile.</span></p>

			<button onClick={() => handleTabShown("add-listing")}>Get listed <HiOutlineSpeakerphone /></button>
		</figure>
	);
};
