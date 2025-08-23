import React from "react";

interface Props {
	title: string;
	icon?: React.ReactElement<SVGElement>;
	value?: number;
	onClick: () => void;
	active: boolean;
}

export default function Tab({ title, icon, value, onClick, active }: Props) {
	return (
		<button className={`page--tab ${active ? "active" : ""}`} onClick={onClick}>
			{icon && <span>{icon}</span>}
			{title} {value && <span className="value">({value})</span>}
		</button>
	);
};