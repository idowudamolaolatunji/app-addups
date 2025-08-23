import React from "react";

interface Props {
	active: boolean | any;
	icon: React.ReactElement<SVGElement | Element>;
	title: string;
	action: () => void;
}

export default function MenuItem({ active, icon, title, action }: Props) {
	return (
		<button className={`menu--item ${active ? "menu--active" : ""}`} onClick={action}>
			{icon}
			<p>{title}</p>
		</button>
	);
}
