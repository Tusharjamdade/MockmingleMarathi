// import { getApiResponse } from "./questionsFetch";  // Importing the function for fetching questions

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { jobRole, level, email, questions } = req.body;

//     // Simulate starting the background process with setTimeout
//     setTimeout(async () => {
//       try {
//         // Perform the background task: fetching the questions
//         const fetchedQuestions = await getApiResponse(jobRole, level);

//         if (fetchedQuestions) {
//           console.log('Fetched Questions:', fetchedQuestions);  // Log the fetched questions
//           // Here, you can do further processing like saving the result in a database or trigger other actions.
//         } else {
//           console.error('Error: No questions fetched');
//         }
//       } catch (error) {
//         console.error('Error during background processing:', error);
//       }
//     }, 0);  // Run immediately after the request is sent

//     // Respond immediately to the user
//     return res.status(200).json({ message: "Job role submitted. Background processing started." });
//   }

//   // If the method is not POST, return a 405 Method Not Allowed response
//   return res.status(405).json({ error: 'Method Not Allowed' });
// }

import { getApiResponse } from "./questionsFetch";  // Importing the function for fetching questions

export const config = {
  runtime: "nodejs", // Ensure it's a Node.js function
  maxDuration: 900, 
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { jobRole, level} = req.body;

    // Simulate starting the background process with setTimeout
    setTimeout(async () => {
      try {
        // Perform the background task: fetching the questions
        const fetchedQuestions = await getApiResponse(jobRole, level);

        if (fetchedQuestions) {
          console.log('Fetched Questions:', fetchedQuestions);  // Log the fetched questions
          // You can also store the questions or do further processing here
          
          // For example, save the questions in a database or trigger another action
          // Example: await saveQuestionsToDatabase(fetchedQuestions);
        } else {
          console.error('Error: No questions fetched');
        }
      } catch (error) {
        console.error('Error during background processing:', error);
      }
    }, 0);  // Run immediately after the request is sent

    // Respond immediately to the user
    return res.status(200).json({
      message: "Job role submitted. Background processing started.",
    });
  }

  // If the method is not POST, return a 405 Method Not Allowed response
  return res.status(405).json({ error: 'Method Not Allowed' });
}
