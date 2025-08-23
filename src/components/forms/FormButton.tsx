
interface Props {
	title: string;
	loading: boolean;
	loadingText?: string;
}

export default function FormButton({ title, loading, loadingText="Loading..." }: Props) {
	return (
		<button type="submit" className="form--submit" disabled={loading}>
			{loading ? loadingText : title}
		</button>
	);
};