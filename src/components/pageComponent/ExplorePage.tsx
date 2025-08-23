 
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import ListTopBox from "../layout/ListTopBox"
import ListingCard from "../layout/ListingCard"
import { ghRegions, ngStates } from "../../utils/data";
import { useAuthContext } from "../../context/AuthContext";
import type { ListingType } from "../../utils/types";


// const listings = [
// 	{
// 		displayImage: { url: "https://res.cloudinary.com/du8iw1efa/image/upload/v1752871520/products/product-1752871514305-1.jpg" },
// 		displayName: "Kehinde",
// 		location: "Lagos",
// 		gender: "All Gender",
// 		link: "https://wa.me/2349057643470",
// 	},
// 	{
// 		displayImage: { url: "https://res.cloudinary.com/du8iw1efa/image/upload/v1753089521/products/product-1753089512085-1.jpg" },
// 		displayName: "Martha",
// 		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt ipsa illo aut iure maiores deleniti ut expedita! Modi, excepturi eius?",
// 		location: "Lagos",
// 		link: "https://wa.me/2349057643470",
// 	},
// 	{
// 		displayImage: { url: "https://res.cloudinary.com/du8iw1efa/image/upload/v1741746468/collections/collection-1741746467353.jpg" },
// 		displayName: "James",
// 		location: "Kwara",
// 		link: "https://wa.me/2349057643470",
// 	},
// ];

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function ExplorePage() {
	const { user, headers } = useAuthContext();

	const [listings, setListings] = useState<ListingType[] | []>([]);
	const [region, setRegion] = useState("");
	const [gender, setGender] = useState("");
	const [_, setLoading] = useState(false);
	// const [hasMore, setHasMore] = useState(false);
	const [pageNum] = useState(1);

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

	useEffect(function() {
		setLoading(true);
		handleFetchListings();
	}, [pageNum, region, gender]);

	async function handleFetchListings() {
		try {
			setLoading(true);

			const query = new URLSearchParams({
				page: pageNum.toString(),
			}).toString();

			const res = await fetch(`${BASE_API_URL}/listings/all?${query}`, {
				method: "GET", headers,
			});
			const data = await res.json();
			console.log(data);
			setListings(data?.data?.listings)

		} catch(err: any) {
			console.log(err?.message as string);
		} finally {
			setLoading(false);
		}
	}

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