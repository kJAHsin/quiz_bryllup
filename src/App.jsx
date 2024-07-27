import { useEffect, useState } from "react";
import Radio, { RadioGroup } from "./components/Radio";
import { db } from "./lib/database";
import { createAccount, login } from "./lib/userAuth";
import { ID } from "appwrite";

function App() {
	// state
	const [isUser, setIsUser] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [questionArr, setQuestionArr] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [questionText, setQuestionText] = useState("");
	const [answerArray, setAnswerArray] = useState([]);
	const [correctAnswer, setCorrectAnswer] = useState("");
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [hasCorrectAnswer, setHasCorrectAnswer] = useState(undefined);
	const [correctCount, setCorrectCount] = useState(0);
	const [questionsRemaining, setQuestionsRemaining] = useState(false);
	const [isPending, setIsPending] = useState(true);

	async function getQuestions() {
		const res = await db.quiz.list();
		setQuestionArr(res.documents);
	}

	function handleSubmit() {
		if (selectedAnswer == null) return;
		setIsPending(true);
		if (selectedAnswer !== correctAnswer) {
			setHasCorrectAnswer(false);
		} else {
			setHasCorrectAnswer(true);
			setCorrectCount((prev) => prev + 1);
		}
		setTimeout(() => {
			if (currentQuestion < questionArr.length - 1) {
				setCurrentQuestion((prev) => prev + 1);
			}
			setHasCorrectAnswer(undefined);
			if (currentQuestion >= questionArr.length - 1) {
				setQuestionsRemaining(false);
			}
			setIsPending(false);
		}, 1200);
		setSelectedAnswer(null);
	}

	const submitBtnText = () => {
		switch (hasCorrectAnswer) {
			case undefined:
				return "Submit Answer";
			case true:
				return "Correct!";
			case false:
				return "Sorry! Wrong!";
			default:
				return "Submit Answer";
		}
	};

	function handleEmailUpdate(e) {
		setEmail(e.target.value);
	}
	function handlePasswordUpdate(e) {
		setPassword(e.target.value);
	}

	function handleUserSubmit(e) {
		e.preventDefault();

		if (
			password == null ||
			password === "" ||
			email == null ||
			email === ""
		)
			return;

		setIsUser(true);
		createAccount({ email, password });
	}

	const switchSummaryText = () => {
		return correctCount === questionArr.length
			? "Perfect!"
			: correctCount > questionArr.length - 5
			? "Good work!"
			: correctCount > questionArr.length - 10
			? "Pretty Good :)"
			: correctCount > questionArr.length / 3
			? "Not too bad!"
			: "Room to learn more!";
	};

	useEffect(() => {
		getQuestions();
		if (questionArr.length - questionArr[currentQuestion] > 1)
			setQuestionsRemaining(true);
		setIsPending(false);
	}, []);

	useEffect(() => {
		if (questionArr.length > 0) {
			setQuestionsRemaining(true);
			setQuestionText(questionArr[currentQuestion]["question-text"]);
			setAnswerArray([...questionArr[currentQuestion].answer]);
			setCorrectAnswer(questionArr[currentQuestion]["correct-answer"]);
		} else {
			setQuestionsRemaining(false);
		}
	}, [questionArr, currentQuestion]);

	return (
		<>
			<div
				className={
					"mt-4 md:mt-[5vw] mb-auto py-8 px-6 bg-fuchsia-50 border-2 border-red-950 rounded-lg max-w-96 overflow-clip relative shadow-2xl"
				}
			>
				<div
					className={`absolute inset-0 bg-white grid place-content-center text-center ${
						questionsRemaining && "hidden"
					}`}
					id="summary"
				>
					<h2>Congratulations!</h2>
					<p className="text-balance">You have completed the quiz!</p>
					<p className="text-balance">
						{switchSummaryText()} You got {correctCount} questions
						correct!
					</p>
				</div>
				<form
					onSubmit={(e) => {
						handleUserSubmit(e);
					}}
					id="signup"
					className={`absolute inset-0 bg-white flex flex-col gap-1 pt-4 pb-8 px-6 ${
						isUser && "hidden"
					}`}
				>
					<h2 className="text-3xl text-center font-bold mb-3 pb-3 relative after:absolute after:content-[''] after:top-auto after:right-5 after:-bottom-1 after:left-5 after:h-1 after:bg-fuchsia-600 after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-500 after:ease-out text-balance">
						Create a password to play!
					</h2>
					<label htmlFor="email">Enter your email:</label>
					<input
						type="email"
						name="email"
						id="email"
						value={email}
						onChange={handleEmailUpdate}
						className="outline-none border-2 border-slate-400 hover:border-slate-800 focus-visible:outline-indigo-700 outline-offset-2 rounded w-full transition-colors mb-3 p-2"
						placeholder="Email"
						required
						autoComplete="none"
					/>
					<label htmlFor="password">Enter a password:</label>
					<input
						type="password"
						name="password"
						id="password"
						value={password}
						onChange={handlePasswordUpdate}
						className="outline-none border-2 border-slate-400 hover:border-slate-800 focus-visible:outline-indigo-700 outline-offset-2 rounded w-full transition-colors mb-2 p-2"
						placeholder="Password"
						required
						autoFocus
					/>
					<input
						className="col-span-full mt-2 py-2 shadow-md border-2 border-slate-400 hover:border-slate-900 hover:bg-pink-600 hover:text-white focus-within:border-indigo-700 active:border-pink-600 active:-translate-y-1 active:scale-[0.97] rounded text-xl cursor-pointer transition-all duration-300"
						type="submit"
						value="Create user!"
					/>
				</form>

				<h2 className="text-red-800 text-2xl font-black flex gap-3 justify-between">
					Love Quiz:
					<span className="flex text-lg items-end">
						Question #{currentQuestion + 1} of {questionArr.length}
					</span>
				</h2>
				<span className="text-center block">
					You have {correctCount} answers correct so far.
				</span>
				<p className="mt-3 mb-6">{questionText}</p>
				<div className={"grid sm:grid-cols-2 gap-3 mt-3"}>
					<RadioGroup
						value={selectedAnswer}
						onChange={(e) => setSelectedAnswer(e.target.value)}
					>
						{answerArray.map((ans) => (
							<Radio
								disabled={isPending}
								key={ID.unique()}
								value={ans}
							>
								{ans}
							</Radio>
						))}
					</RadioGroup>
					<button
						onClick={handleSubmit}
						disabled={isPending}
						className="col-span-full py-3 px-6 font-bold rounded text-center border-2 border-green-950 hover:border-green-400 hover:bg-green-950 hover:text-white active:border-orange-700 active:bg-orange-950 active:scale-95 active:-translate-y-1 transition-all cursor-pointer"
					>
						{submitBtnText()}
					</button>
				</div>
			</div>
		</>
	);
}

export default App;
