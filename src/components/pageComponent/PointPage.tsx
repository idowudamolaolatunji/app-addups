 
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { Fade } from "react-awesome-reveal";
import { GiCrownCoin } from "react-icons/gi";
import { dateTimeFormat, formatNumber } from "../../utils/helper";
import { useFetchedContext } from "../../context/FetchedContext";
import DataTable from "react-data-table-component";
import { createPortal } from "react-dom";
import ExtraSmall from "../../components/modal/ExtraSmall";
import CurrencyInput from "react-currency-input-field";
import CustomAlert from "../../components/elements/CustomAlert";
import { PaystackButton } from "react-paystack";
import { pricePerOneCedes, pricePerOneNaira } from "../../utils/data";

const customStyles: any = {
	table: {
		style: {
			overflowX: "auto",
			fontFamily: "inherit",
			color: "inherit",
		},
	},
	head: {
		style: {
			fontSize: "1.48rem",
			fontWeight: "500",
			height: "4.5rem",
		},
	},
	rows: {
		style: {
			minHeight: "7rem",
			cursor: "pointer",
			fontSize: "1.32rem",
			fontWeight: 500,
			color: "#444444",
		},
	},
	headCells: {
		style: {
			paddingRight: "0.5rem",
			backgroundColor: "#343434",
			color: "#fff",
			height: "4.5rem",
		},
	},
	cells: {
		style: {
			textAlign: "center",
		},
	},
};

const columns: any = [
	{
		name: "Transaction ID",
		selector: (row: { reference: string, transactionId?: string }) => <span className="number">{row?.transactionId || row?.reference}</span>,
	},
	{
		name: "Amount",
		selector: (row: { amount: number, type: string }) => (
			<span className={`status status--${row?.type}`}>
				<p style={{ backgroundColor: "transparent" }}>
					<span className="number">{row?.type == "deposited" ? "+" : "-"} {formatNumber(row?.amount)}</span> points
				</p>
			</span>
		),
	},
	{
		name: "Date",
		selector: (row: { paidAt: any }) => dateTimeFormat(row?.paidAt),
		width: "16.5rem"
	},
];

const BASE_API_URL = import.meta.env.VITE_API_URL;
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export default function PointPage() {
	const { user, headers, handleUser } = useAuthContext();
	const { transactions, setTransactions } = useFetchedContext();

	const [showModal, setShowModal] = useState(false);
	const [pointsAmount, setPointsAmount] = useState<any | null>(null);
	const [response, setResponse] = useState({ status: "", message: "" });
	const [loading, setLoading] = useState(false);

	const pricePerOnePoint = user?.country == "nigeria" ? pricePerOneNaira : pricePerOneCedes;

	const resetResponse = function() {
        setResponse({ status: "", message: "" });
	}

	const handleToggleModal = function () {
		setShowModal(!showModal);
		setPointsAmount(null);
	};

	const handleClosePayment = function() {
		resetResponse();
		handleToggleModal();
		setResponse({ status: "error", message: "Transaction not completed!!" });
	}

	useEffect(function() {
		window?.scrollTo(0, 0)
	}, [])
	
	async function handleProceedPayment (reference: string) {
		resetResponse();
		setLoading(true);

        try {
            const res = await fetch(`${BASE_API_URL}/points/buy`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ reference }),
            });

            const data = await res.json();
            if(data.status !== 'success') {
                throw new Error(data.message);
            }

			handleUser(data?.data?.user)
			handleToggleModal();
			setTransactions(data?.data?.transactions)
			setResponse({ status: "success", message: data?.message });
            
        } catch(err: any) {
            setResponse({ status: "error", message: err.message })
        } finally {
            setLoading(false)
        }
    }

	return (
		<React.Fragment>
			{response?.message &&
				createPortal(
					<CustomAlert type={response?.status} message={response?.message} />,
					document.body
				)
			}
		
			{showModal &&
				createPortal(
					<ExtraSmall handleClose={handleToggleModal} removeCloseAbility={loading}>
						<div className="modal--details">
							<h3>Buy Addups Points</h3>

							<div style={{ width: "100%" }}>
								<CurrencyInput
									name="price"
									className="form--input"
									placeholder="Enter Points"
									suffix=" points"
									decimalsLimit={0}
									value={pointsAmount}
									onValueChange={(value: any) => setPointsAmount(value)}
								/>
								<p style={{ marginTop: "0.5rem" }}>You are paying <span style={{ color: pointsAmount > 99 ? "green" : "red", fontWeight: "500" }}>{user?.country == "nigeria" ? "₦" : "GH₵"}{formatNumber(pricePerOnePoint * pointsAmount || 0, 2)}</span> for the Addups points</p>
							</div>

							<PaystackButton
								className={`promote--btn`}
								currency={user?.country == "ghana" ? "GHS" : "NGN"}
								phone={user?.phone}
								email={user?.email}
								amount={Number(pricePerOnePoint * pointsAmount) * 100}
								text={loading ? "Paying..." : "Buy Points"}
								publicKey={PAYSTACK_PUBLIC_KEY}
								onSuccess={({ reference } : { reference: string; }) => handleProceedPayment(reference)}
								onClose={handleClosePayment}
								disabled={!pointsAmount || pointsAmount < 100 || loading}
							/>

						</div>
					</ExtraSmall>, document.body
				)
			}

			<Fade className="section" duration={500}>
				<div>
					<div className="wallet--card">
						<p className="heading">
							<GiCrownCoin /> AddUps points
						</p>

						<div className="wallet--details">
							<p className="title">Total points</p>
							<p className="value"><span className="number">{formatNumber(user?.pointBalance)}</span> Points</p>
						</div>

						<button className="wallet--btn" onClick={handleToggleModal}>Buy Points</button>
					</div>

					<div className="transaction--container page--container">
						<p className="heading">Recent Transactions</p>

						<DataTable columns={columns} data={transactions} customStyles={customStyles} pagination pointerOnHover={false} noDataComponent={<p style={{ marginTop: "1rem", fontSize: "1.4rem", color: "#555" }}>No transaction history</p>} />
					</div>
				</div>
			</Fade>

		</React.Fragment>
	);
};
