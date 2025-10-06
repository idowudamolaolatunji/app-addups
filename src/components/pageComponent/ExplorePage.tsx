 
import { useCallback, useEffect, useRef, useState } from "react";
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
import AdsenceComponent from "../layout/AdsenceComponent";


export default function ExplorePage() {
    const { y } = useWindowScroll();
	const { user } = useAuthContext();
	const { handleTabShown } = useDataContext();
	const { listings, listingLoading, region, gender, setRegion, setGender, hasMore, setPageNum
	} = useFetchedContext();

	// SCROLL STATE, TO MEMORIZE WHERE WE ARE ON THE SCREEN
	// (HAS NOTHING TO DO WITH THE INFINIT SCROLL IMP)
	const [scrollY, setScrollY] = useState(() => {
		const saved = localStorage.getItem('scrollPosition');
		return saved !== null ? parseInt(saved, 10) : 0;
	});

	// INFINIT SCROLL INPLMENTATION
	const observer = useRef(null) as any;
	const secondToLastListingRef = useCallback((node: HTMLElement | null) => {
		if(listingLoading) return;
		if(observer.current) observer.current.disconnect();
		observer.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
			if(entries[0].isIntersecting && hasMore) {
				setPageNum((prevNum: number) => prevNum + 1);
			}
		});

		if(node) observer.current.observe(node);
	}, [listingLoading, hasMore]);


	// SET THE SCROLL POSTION (HAS NOTHING TO DO WITH THE INFINIT SCROLL IMP)
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
		const handleReload = function() {
			setScrollY(0);
			window.scrollTo(0, 0);
			localStorage.setItem("scrollPosition", "0")
		};
		window.addEventListener("load", handleReload);
		return () => window.removeEventListener("load", handleReload);
	}, []);


    return (
        <Fade className="section" duration={500}>
            <div>
				<ListTopBox />

                <div className="page--container discover--container">
					<div className="page--tabs">
						<select name="region" id="region" className="page--tab" value={region} onChange={(e => {
							setRegion(e?.target?.value);
							setPageNum(1);
						})}>
							<option hidden>{user?.country == "nigeria" ? "State" : "Region"}</option>
							<option value="all-region">All {user?.country == "nigeria" ? "State" : "Region"}</option>
							{user?.country == "nigeria" && (
								ngStates.map((state: { name: string, value: string }) => (
									<option value={state.value} key={state.value}>{state.name}</option>
								))
							)}

							{user?.country == "ghana" && (
								ghRegions.map((region: { name: string, value: string }) => (
									<option value={region.value} key={region.value}>{region.name}</option>
								))
							)}
						</select>
						<select name="gender" id="gender" className="page--tab" value={gender} onChange={(e => {
							setGender(e?.target?.value);
							setPageNum(1);
						})}>
							<option hidden>Gender</option>
							<option value="all-gender">All Genders</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>

						{(y >= 180) && (
							<button className="promote--btn" onClick={() => handleTabShown("add-listing")}><HiOutlineSpeakerphone /></button>
						)}
					</div>

                    <div className="listing--grid">
                        {listings?.map((listing: ListingType, i: number) => {
							if(listings?.length - 3 === i - 1) { // this helps us achieve secToLast, rather than l.length === i + 1
								return (
									<span key={i} ref={secondToLastListingRef}>
										<ListingCard listing={listing} />
										<AdsenceComponent />
									</span>
								)
							} else {
								return <ListingCard listing={listing} key={i} />
							}
						})}
                    </div>

					{listingLoading && <p style={{ textAlign: "center", color: "orange" }}>Loading...</p>}
                </div>
            </div>
        </Fade>
    )
}