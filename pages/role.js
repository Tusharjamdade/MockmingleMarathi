
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import { getApiResponse } from './api/questionsFetchFormModel';
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

export default function Role() {
  const router = useRouter();
  const [jobRole, setJobRole] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromStorage) {
        setUser(userFromStorage);
        setEmail(userFromStorage.email || '');  // Initialize email here directly
      }
    }
  }, []);

  

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form from submitting normally
    localStorage.removeItem("apiResponseStatus");
    
    // Declare formattedQuestions here once
    let formattedQuestions = [];
    
    router.push("/instruction");
  
    // Replace this with a fetch request to your new API
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/questionsFetchFormModel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobRole,
          level,
        }),
      });
  
      // Check if the response is OK (status 200)
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Something went wrong. Please try again.");
      }
  
      // Parse the response
      const responseData = await res.json();
  
      console.log('Fetched Questions:', responseData.questions);  // Debug: Log fetched questions
  
      const fetchedQuestions = responseData.questions;
  
      if (fetchedQuestions) {
        // Check if the fetchedQuestions is a string
        if (typeof fetchedQuestions === 'string') {
          // Use regex to match the questions in the string
          const questionsRegex = /\d+\.\s.*?(?=\n|$)/g;
          const matchedQuestions = fetchedQuestions.match(questionsRegex);
  
          console.log('Matched Questions:', matchedQuestions); // Debug: Log matched questions
  
          if (matchedQuestions) {
            // Start with the "Introduce yourself" question as the first element
            const firstName = user?.fullName?.split(' ')[0];
            formattedQuestions = [{
              questionText: ` hello ${firstName} Can you tell me about yourself, including your educational background and previous work experience?`,
              answer: null,
            }];
  
            // Add the fetched questions to the array
            const additionalQuestions = matchedQuestions.map(questionText => ({
              questionText: questionText.trim(),
              answer: null,
            }));
  
            // Prepend the fetched questions after the "Introduce yourself"
            formattedQuestions.push(...additionalQuestions);
  
            // Set the questions in the state with the "Introduce yourself" as the first question
            setQuestions(formattedQuestions);
          } else {
            console.error("No valid questions found in the fetched data.");
          }
        } else {
          console.error('Fetched questions are not in expected string format:', fetchedQuestions);
        }
      } else {
        console.error("No questions received from API.");
      }
  
      console.log("Questions to be sent:", formattedQuestions);
  
      if (formattedQuestions && formattedQuestions.length > 0) {
        const data = { jobRole, email, level, questions: formattedQuestions };
  
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/jobRoleAndQuestionsSave`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
  
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.error || "Something went wrong. Please try again.");
          }
  
          const response = await res.json();
          // console.log(response.data._id); // Log the successful response
  
          // Store the response _id in localStorage
          if (response.data._id) {
            // Remove the existing items if they exist
            localStorage.removeItem("_id");
            localStorage.removeItem("_idForReport");
  
            // Add the new items
            localStorage.setItem("_id", response.data._id);
            localStorage.setItem("_idForReport", response.data._id);
          }
  
          // Store response status in localStorage to enable button on Instruction page
          localStorage.setItem("apiResponseStatus", "success");
  
        } catch (error) {
          console.error('Error:', error);
          // Store response failure status in localStorage
          localStorage.setItem("apiResponseStatus", "error");
        }
      } else {
        console.error("No questions received. Please try again.");
      }
    } catch (error) {
      console.error('Error during question fetch:', error);
      localStorage.setItem("apiResponseStatus", "error");
    }
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg.gif')" }}>
       <Link href={'/'}><div className='absolute top-10 left-3 text-4xl text-white'><IoIosArrowBack /></div></Link>
      <div className="bg-transparent w-11/12 max-w-md p-8 text-center">
        <img src="/logoo.png" alt="Shakti AI Logo" className="w-20 mx-auto mb-4" />
        
        <h2 className="text-3xl text-white font-light mb-[1rem]">Select</h2>
        <h3 className="text-2xl text-[#e600ff] mb-4">Job Role</h3>

        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="jobRole" 
            value={jobRole} 
            onChange={(e) => setJobRole(e.target.value)} 
            placeholder="Enter Job Role" 
            required
            className="w-full p-3 mb-5 bg-opacity-20 bg-white text-white border-none rounded-md text-lg text-center" 
          />
          <input 
            type="email" 
            name="email" 
            value={email} 
            readOnly 
            className="hidden w-full p-3 mb-5 bg-opacity-20 bg-white text-white border-none rounded-md text-lg text-center" 
          />

          <h2 className=" text-3xl font-light mt-8"></h2>
          <h3 className=" text-2xl text-[#e600ff] mb-4">Select Level</h3>
          <div className=" flex flex-col text-white text-left pl-16 text-lg mb-6" >
            <label>
              <input 
                type="radio" 
                name="level" 
                value="Beginner" 
                className="mr-2" 
                checked={level === "Beginner"} 
                onChange={() => setLevel("Beginner")} 
              /> Beginner
            </label>
            <label>
              <input 
                type="radio" 
                name="level" 
                value="Intermediate" 
                className="mr-2" 
                checked={level === "Intermediate"} 
                onChange={() => setLevel("Intermediate")} 
              /> Intermediate
            </label>
            <label>
              <input 
                type="radio" 
                name="level" 
                value="Advanced" 
                className="mr-2" 
                checked={level === "Advanced"} 
                onChange={() => setLevel("Advanced")} 
              /> Advanced
            </label>
            <label>
              <input 
                type="radio" 
                name="level" 
                value="Expert" 
                className="mr-2" 
                checked={level === "Expert"} 
                onChange={() => setLevel("Expert")} 
              /> Expert
            </label>
          </div>

          <button type="submit" className="bg-[#2a72ff] text-white py-2 px-8 font-semibold rounded-full w-full mt-4 hover:bg-[#1a5adb] flex justify-center items-center">
            Next <span className="ml-4 text-2xl">»</span>
          </button>
        </form>
      </div>
    </div>
  );
}
