import type { DurationDetailsType } from "./types";

export const ngStates = [
	{ name: "Abia", value: "abia" },
	{ name: "Adamawa", value: "adamawa" },
	{ name: "Akwa Ibom", value: "akwa-ibom" },
	{ name: "Anambra", value: "anambra" },
	{ name: "Bauchi", value: "bauchi" },
	{ name: "Bayelsa", value: "bayelsa" },
	{ name: "Benue", value: "benue" },
	{ name: "Borno", value: "borno" },
	{ name: "Cross River", value: "cross-river" },
	{ name: "Delta", value: "delta" },
	{ name: "Ebonyi", value: "ebonyi" },
	{ name: "Edo", value: "edo" },
	{ name: "Ekiti", value: "ekiti" },
	{ name: "Enugu", value: "enugu" },
	{ name: "Gombe", value: "gombe" },
	{ name: "Imo", value: "imo" },
	{ name: "Jigawa", value: "jigawa" },
	{ name: "Kaduna", value: "kaduna" },
	{ name: "Kano", value: "kano" },
	{ name: "Katsina", value: "katsina" },
	{ name: "Kebbi", value: "kebbi" },
	{ name: "Kogi", value: "kogi" },
	{ name: "Kwara", value: "kwara" },
	{ name: "Lagos", value: "lagos" },
	{ name: "Nasarawa", value: "nasarawa" },
	{ name: "Niger", value: "niger" },
	{ name: "Ogun", value: "ogun" },
	{ name: "Ondo", value: "ondo" },
	{ name: "Osun", value: "osun" },
	{ name: "Oyo", value: "oyo" },
	{ name: "Plateau", value: "plateau" },
	{ name: "Rivers", value: "rivers" },
	{ name: "Sokoto", value: "sokoto" },
	{ name: "Taraba", value: "taraba" },
	{ name: "Yobe", value: "yobe" },
	{ name: "Zamfara", value: "zamfara" },
];

export const ghRegions = [
  { name: "Ahafo", value: "ahafo" },
  { name: "Ashanti", value: "ashanti" },
  { name: "Bono", value: "bono" },
  { name: "Bono East", value: "bono-east" },
  { name: "Central", value: "central" },
  { name: "Eastern", value: "eastern" },
  { name: "Greater Accra", value: "greater-accra" },
  { name: "North East", value: "north-east" },
  { name: "Northern", value: "northern" },
  { name: "Oti", value: "oti" },
  { name: "Savannah", value: "savannah" },
  { name: "Upper East", value: "upper-east" },
  { name: "Upper West", value: "upper-west" },
  { name: "Volta", value: "volta" },
  { name: "Western", value: "western" },
  { name: "Western North", value: "western-north" }
];

export const pricePerOneCedes = 0.0072;
export const pricePerOneNaira = 1;

export const ngDurationAndPointValue: DurationDetailsType[] = [
	{ duration: "12 Hours", durationInHours: "12", amountInFigure: "₦250", amount: 250, points: 250, priceInFigure: "250 points" },
	{ duration: "24 Hours", durationInHours: "24", amountInFigure: "₦500", amount: 500, points: 500, priceInFigure: "500 points" },
	{ duration: "48 Hours", durationInHours: "48", amountInFigure: "₦1,000", amount: 1000, points: 1000, priceInFigure: "1,000 points" },
	{ duration: "1 Week", durationInHours: "168", amountInFigure: "₦3,500", amount: 3500, points: 3500, priceInFigure: "3,500 points" },
];

export const ghDurationAndPointValue: DurationDetailsType[] = [
	{ duration: "12 Hours", durationInHours: "12", amountInFigure: "GH₵ 1.8", amount: 1.8, points: 250, priceInFigure: "250 points" },
	{ duration: "24 Hours", durationInHours: "24", amountInFigure: "GH₵ 3.6", amount: 3.6, points: 500, priceInFigure: "500 points" },
	{ duration: "48 Hours", durationInHours: "48", amountInFigure: "GH₵ 7.2", amount: 7.2, points: 1000, priceInFigure: "1,000 points" },
	{ duration: "1 Week", durationInHours: "168", amountInFigure: "GH₵ 25.2", amount: 25.2, points: 3500, priceInFigure: "3,500 points" },
];
