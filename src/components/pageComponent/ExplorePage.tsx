 
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import ListTopBox from "../layout/ListTopBox"
import ListingCard from "../layout/ListingCard"
import { ghRegions, ngStates } from "../../utils/data";
import { useAuthContext } from "../../context/AuthContext";
import type { ListingType } from "../../utils/types";
import { useDataContext } from "../../context/DataContext";
import { useFetchedContext } from "../../context/FetchedContext";
import { useWindowScroll } from "react-use";
import { HiOutlineSpeakerphone } from "react-icons/hi";


export default function ExplorePage() {
    const { y } = useWindowScroll();
	const { user } = useAuthContext();
	const { listings } = useFetchedContext();
	const { region, gender, setRegion, setGender, handleTabShown } = useDataContext();

	// SCROLL STATE, TO MEMORIZE WHERE WE ARE ON THE SCREEN
	const [scrollY, setScrollY] = useState(() => {
		const saved = localStorage.getItem('scrollPosition');
		return saved !== null ? parseInt(saved, 10) : 0;
	});

	// SET THE SCROLL POSTION 
	useEffect(function() {
		const handleScroll = function() {
			setScrollY(window.scrollY);
			localStorage.setItem('scrollPosition', window.scrollY as any);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// REMEMBER THE POSTION IF REVISITED
	useEffect(function() {
		window.scrollTo(0, scrollY);
	}, []);

	// IF APP IS RELOADED, REMOVE THE POSTION
	useEffect(function () {
		const handleBeforeUnload = function() {
			setScrollY(0);
			window.scrollTo(0, 0);
			localStorage.setItem("scrollPosition", "0")
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, []);


    return (
        <Fade className="section" duration={500}>
            <div>
				<ListTopBox />

                <div className="page--container discover--container">
					<div className="page--tabs">
						<select name="region" id="region" className="page--tab" value={region} onChange={(e => setRegion(e?.target?.value))}>
							<option hidden>{user?.country == "nigeria" ? "State" : "Region"}</option>
							<option value="all-region">All {user?.country == "nigeria" ? "State" : "Region"}</option>
							{user.country == "nigeria" && (
								ngStates.map((state: { name: string, value: string }) => (
									<option value={state.value} key={state.value}>{state.name}</option>
								))
							)}

							{user.country == "ghana" && (
								ghRegions.map((region: { name: string, value: string }) => (
									<option value={region.value} key={region.value}>{region.name}</option>
								))
							)}
						</select>
						<select name="gender" id="gender" className="page--tab" value={gender} onChange={(e => setGender(e?.target?.value))}>
							<option hidden>Gender</option>
							<option value="all-gender">All Genders</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
						{/* <select name="platform" id="platform" className="page--tab">
							<option hidden>Platform</option>
							<option value="all-platform">All Platform</option>
						</select> */}

						{(y >= 180) && (
							<button className="promote--btn" onClick={() => handleTabShown("add-listing")}><HiOutlineSpeakerphone /></button>
						)}
					</div>

                    <div className="listing--grid">
                        {listings?.map((data: ListingType, i: number) => (
                            <ListingCard data={data} key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </Fade>
    )
}