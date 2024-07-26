import { createContext, useContext } from "react";

const RadioContext = createContext();

export default function Radio({ children, ...props }) {
	const { value, onChange } = useContext(RadioContext);

	return (
		<label
			className={`
				grid place-content-center py-3 px-6 font-bold rounded text-center border-2 border-green-950 hover:border-green-400 hover:bg-green-950 hover:text-white transition-all cursor-pointer 
				${
					value === props.value &&
					"border-orange-700 bg-orange-950 hover:border-blue-500 hover:bg-orange-800 text-white scale-105"
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
