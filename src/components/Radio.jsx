import { createContext, useContext } from "react";

const RadioContext = createContext();

export default function Radio({ children, ...props }) {
	const { value, onChange } = useContext(RadioContext);

	return (
		<label
			className={`
				grid place-content-center py-3 px-6 font-bold rounded text-center border-2 border-weddingDarkred hover:border-weddingGreen hover:bg-weddingPrimary hover:text-white transition-all cursor-pointer 
				${
					value === props.value &&
					"border-weddingOrange bg-weddingDarkred hover:border-weddingGreen hover:weddingPrimary text-white scale-105"
				} ${
				value === correctAnswer &&
				showCorrect &&
				"outline-2 outline-weddingGreen bg-weddingGreen text-white"
			}`}
		>
			<input
				type="radio"
				className="hidden"
				checked={value === props.value}
				onChange={onChange}
				{...props}
			/>
			{children}
		</label>
	);
}

export function RadioGroup({ value, onChange, children }) {
	return (
		<RadioContext.Provider value={{ value, onChange }}>
			{children}
		</RadioContext.Provider>
	);
}
