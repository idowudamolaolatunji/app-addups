import moment from "moment";

export function formatNumber(amount: any, dec: number = 0): string {
	return Number(amount)
		.toFixed(dec)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function shortenNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toLocaleString("en-US", { maximumFractionDigits: 2 }).replace(/\.0+$/, "") + "M";
	} else if (num >= 1000) {
		return (num / 1000).toLocaleString("en-US", { maximumFractionDigits: 2 }).replace(/\.0+$/, "") + "k";
	} else {
		return num.toString();
	}
}

export function dateTimeFormat(givenDate: Date): string {
	const date = moment(givenDate);
	return date.format("D MMM YYYY, h:mm a");
}

export function formatDateSince(givenDate: Date): string {
	const date = moment(givenDate);
	const now = moment();
	const diff = now.diff(date, "seconds");

	if (diff < 60) {
		// less than 1 minute
		return `${diff} second${diff > 1 ? "s" : ""} ago`;
	} else if (diff < 3600) {
		// less than 1 hour
		const minutes = Math.floor(diff / 60);
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	} else if (diff < 86400) {
		// less than 1 day
		const hours = Math.floor(diff / 3600);
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else if (diff < 172800) {
		// yesterday
		return `Yesterday at ${date.format("h:mm A")}`;
	} else {
		return date.format("D MMM YYYY");
	}
}

// CAPITALIZE FIRST LETTER
export function capFirst(text: string): string {
	return text?.slice(0, 1).toUpperCase() + text?.slice(1);
}

export function truncateString(input: string, num: number = 20): string {
	if (input?.length > num) {
		return input?.substring(0, num) + "..";
	} else {
		return input;
	}
}
