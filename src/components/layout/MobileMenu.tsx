 
import { GiCrownCoin } from 'react-icons/gi'
import { HiOutlineSpeakerphone, HiOutlineUserCircle } from "react-icons/hi";
import { MdOutlineExplore } from "react-icons/md";
import MenuItem from "./MenuItem";


interface Props {
	tabShown: string;
	setTabShown?: (tabShown: string) => void;
}


export default function MobileMenu({ tabShown, setTabShown } : Props) {
	return (
		<div className="mobile--menu">
			<MenuItem title="explore" active={tabShown == "explore"} action={() => setTabShown?.("explore")} icon={<MdOutlineExplore />} />

			<MenuItem title="listings" active={tabShown == "listing"} action={() => setTabShown?.("listing")} icon={<HiOutlineSpeakerphone />} />

			<MenuItem title="points" active={tabShown == "points"} action={() => setTabShown?.("points")} icon={<GiCrownCoin />} />

			<MenuItem title="profile" active={tabShown == "profile"} action={() => setTabShown?.("profile")} icon={<HiOutlineUserCircle />} />
		</div>
	);
};
