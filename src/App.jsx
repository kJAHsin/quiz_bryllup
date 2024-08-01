import { useEffect, useState } from "react";
import Radio, { RadioGroup } from "./components/Radio";
import { db } from "./lib/database";
import { createAccount } from "./lib/userAuth";
import { ID } from "appwrite";
import { updateScoreForUser } from "./lib/updateScore";
import { result as listDocs } from "./lib/listDocs";

function App() {
	// state
	const [isUser, setIsUser] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("apassword123");
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
				return "Bekreft Svar";
			case true:
				return "Riktig!";
			case false:
				return "Woops! Feil!";
			default:
				return "Bekreft Svar";
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

		const userID = ID.unique();

		if (email == null || email === "") return;

		setIsUser(true);
		createAccount({ email, password, userID });
	}

	listDocs().then((res) => console.log(res));

	const switchSummaryText = () => {
		return correctCount === questionArr.length
			? "Perfekt!"
			: correctCount > questionArr.length - 5
			? "Bra jobba!"
			: correctCount > questionArr.length - 10
			? "Ganske bra :)"
			: correctCount > questionArr.length / 3
			? "Ikkje verst!"
			: "Det var nå litt lite!";
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

	useEffect(() => {
		if (questionsRemaining < 1 && email && correctCount) {
			updateScoreForUser({ userID: email, score: correctCount });
		}
	}, [questionsRemaining]);

	return (
		<>
			<div
				className={
					"mt-4 md:mt-[5vw] mb-auto py-8 px-6 bg-fuchsia-50 border-2 border-weddingPrimary rounded-lg max-w-96 overflow-clip relative shadow-2xl"
				}
			>
				<div
					className={`absolute inset-0 bg-white text-center ${
						questionsRemaining && "hidden"
					}`}
					id="summary"
				>
					<div className="mt-6 mb-auto">
						<h2>Gratulerer!</h2>
						<p className="text-balance">Du har fullført Quizen!</p>
						<p className="text-balance mb-auto">
							{switchSummaryText()} <br />
							Du fikk {correctCount} spørsmål riktig!
						</p>
					</div>
				</div>
				<form
					onSubmit={(e) => {
						handleUserSubmit(e);
					}}
					id="signup"
					className={`absolute inset-0 bg-white flex flex-col px-6 pt-10 pb-20 ${
						isUser && "hidden"
					}`}
				>
					<h2 className="text-3xl text-center font-bold mt-8 mb-20 pb-3 relative after:absolute after:content-[''] after:top-auto after:right-5 after:-bottom-1 after:left-5 after:h-1 after:bg-weddingPrimary after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-500 after:ease-out text-balance cursor-default">
						Hvor mye kan du om Eivind og Helene?
					</h2>
					<label htmlFor="email">Din email:</label>
					<input
						type="email"
						name="email"
						id="email"
						value={email}
						onChange={handleEmailUpdate}
						className="outline-none border-2 border-weddingPrimary hover:border-weddingOrange focus-visible:outline-weddingGreen outline-offset-2 rounded w-full transition-colors mb-3 p-2"
						placeholder="Email"
						required
						autoComplete="none"
					/>
					<input
						className="mt-auto col-span-full py-4 shadow-md border-2 bg-pink-100 border-slate-400 hover:border-weddingDarkred hover:bg-weddingPrimary hover:text-white focus-within:border-weddingGreen active:border-weddingOrange active:-translate-y-1 active:scale-[0.97] rounded text-xl cursor-pointer transition-all duration-300"
						type="submit"
						value="La oss begynne!"
					/>
				</form>

				<h1 className="text-weddingDarkred text-2xl font-black grid gap-3 justify-between">
					Bryllups Quiz:
					<span className="flex text-base items-end">
						Spørsmål #{currentQuestion + 1} av {questionArr.length}
					</span>
				</h1>
				<p className="mt-3 mb-6 text-lg">{questionText}</p>
				<div
					className={`grid gap-3 mt-3 ${
						isPending && "pointer-events-none opacity-35"
					}`}
				>
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
						className="col-span-full py-3 px-6 font-bold rounded text-center border-2 bg-weddingGreen border-weddingDarkred hover:border-green-400 hover:bg-green-950 hover:text-white active:border-weddingOrange active:bg-weddingPrimary active:scale-95 active:-translate-y-1 transition-all cursor-pointer"
					>
						{submitBtnText()}
					</button>
					<span className="text-center block">
						Du har svart riktig på {correctCount} spørsmål.
					</span>
				</div>
			</div>
		</>
	);
}

export default App;
