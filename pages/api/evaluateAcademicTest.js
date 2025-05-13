import connectDb from "@/middleware/dbConnect";
import AcademicTest from "@/models/AcademicTest";
import AcademicTestResponse from "@/models/AcademicTestResponse";


export const config = {
  runtime: 'nodejs',
  maxDuration: 300,
};

async function evaluateWithClaude(testData, userAnswers) {
  console.log(`Evaluating test responses for ${testData.subject} (${testData.stream})...`);
  try {
    // Prepare data for Claude evaluation
    const prompt = `
      You're evaluating a student's academic test responses.
      
      Subject: ${testData.subject}
      Stream: ${testData.stream}
      Department: ${testData.department}
      Test Format: ${testData.testFormat}
      
      IMPORTANT EVALUATION INSTRUCTIONS:
      - For MCQ questions, the student's answer must EXACTLY match the correct answer text to be considered correct
      - Each MCQ question has exactly 4 options with exactly 1 correct answer
      - Score questions as either correct (100%) or incorrect (0%) - no partial credit for MCQs
      - For non-MCQ questions, you may give partial credit based on how well the answer matches key points
      
      Below are the test questions and the student's answers.
      Please evaluate each answer according to the instructions above.
      
      ${testData.questions.map((q, index) => `
        Question ${index + 1} (${q.difficulty}): ${q.questionText}
        ${testData.testFormat === 'MCQ' ? `Options: ${q.options.join(' | ')}` : ''}
        Correct answer: ${q.correctAnswer}
        Student's answer: ${userAnswers[index] || 'No answer provided'}
      `).join('\n\n')}
      
      For each question, determine if the answer is correct or incorrect as follows:
      - For MCQ: The answer is correct ONLY if it EXACTLY matches the correct answer text
      - For other formats: Evaluate if the answer contains the key points from the correct answer
      
      Score rules:
      - MCQ: 100 points for correct, 0 points for incorrect
      - Other formats: 0-100 based on accuracy and completeness
      
      Provide brief, encouraging feedback for each answer.
      
      Then, calculate an overall score (0-100) and assign a star rating using these rules:
      - 3 stars: 85-100 points
      - 2 stars: 70-84 points
      - 1 star: 50-69 points
      - 0 stars: Below 50 points
      
      Return your evaluation as a JSON object with this structure:
      {
        "answers": [
          {
            "questionIndex": 0,
            "isCorrect": true/false,
            "score": 100,
            "feedback": "Excellent! Your answer is correct."
          },
          ...
        ],
        "overallScore": 90,
        "stars": 3,
        "feedback": "Detailed and encouraging overall feedback on test performance"
      }
    `;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 4000,
        temperature: 0.5,
        messages: [{
          role: "user",
          content: prompt
        }]
      })
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.content && result.content[0] && result.content[0].text) {
        try {
          // Extract JSON from response
          const textResponse = result.content[0].text;
          const jsonStart = textResponse.indexOf('{');
          const jsonEnd = textResponse.lastIndexOf('}') + 1;
          const jsonString = textResponse.substring(jsonStart, jsonEnd);
          
          return JSON.parse(jsonString);
        } catch (parseError) {
          console.error('Error parsing Claude response as JSON:', parseError);
          throw new Error('Failed to parse evaluation data');
        }
      }
    } else {
      console.error('Claude API error:', await response.text());
      throw new Error('Failed to evaluate test');
    }
  } catch (error) {
    console.error("Error evaluating with Claude:", error);
    throw error;
  }
}

// Generate basic evaluation if AI fails
function generateBasicEvaluation(testData, userAnswers) {
  const answers = testData.questions.map((q, index) => {
    const userAnswer = userAnswers[index] || '';
    
    // Evaluation variables
    let isCorrect = false;
    let isPartial = false;
    let score = 0;
    let feedback = '';
    
    if (testData.testFormat === 'MCQ') {
      // For MCQ, we need to compare the selected option with the correct answer
      // Normalize both for comparison (trim whitespace, make lowercase)
      const normalizedUserAnswer = userAnswer.trim().toLowerCase();
      const normalizedCorrectAnswer = q.correctAnswer.trim().toLowerCase();
      
      // Get all available options normalized for comparison
      const normalizedOptions = q.options.map(opt => opt.trim().toLowerCase());
      
      // First check if user selected the exact correct answer
      if (normalizedUserAnswer === normalizedCorrectAnswer) {
        isCorrect = true;
        score = 100;
        feedback = "Correct answer! Well done.";
      } 
      // Check if the user selected a valid option (but not the correct one)
      else if (normalizedOptions.includes(normalizedUserAnswer)) {
        // User selected a wrong option
        score = 0;
        feedback = `Incorrect. The correct answer is: ${q.correctAnswer}`;
      }
      // Check if user answer matches part of correct answer (fuzzy match)
      else if (normalizedCorrectAnswer.includes(normalizedUserAnswer) && normalizedUserAnswer.length > 3) {
        isPartial = true;
        score = 30; // Reduced partial score for fuzzy matches
        feedback = "Partially correct. Your answer contains some elements of the correct answer.";
      } 
      // Completely wrong or invalid answer
      else {
        score = 0;
        feedback = `Incorrect. The correct answer is: ${q.correctAnswer}`;
      }
    } else if (testData.testFormat === 'Written') {
      // For written answers, use more sophisticated matching
      const correctKeywords = q.correctAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      let matchedKeywords = 0;
      
      // Count matched keywords
      correctKeywords.forEach(keyword => {
        if (userAnswer.toLowerCase().includes(keyword)) {
          matchedKeywords++;
        }
      });
      
      const matchRatio = correctKeywords.length > 0 ? matchedKeywords / correctKeywords.length : 0;
      score = Math.round(matchRatio * 100);
      
      if (score >= 80) {
        isCorrect = true;
        feedback = "Excellent answer! You've covered all the key points.";
      } else if (score >= 50) {
        isPartial = true;
        feedback = "Good attempt. You've covered some important points, but missed others.";
      } else if (score >= 30) {
        isPartial = true;
        feedback = "Partially correct, but your answer is missing several key elements.";
      } else {
        feedback = "Your answer doesn't contain enough key elements from the expected response.";
      }
    } else if (testData.testFormat === 'Speaking') {
      // For speaking, be more lenient with matching
      const correctWords = q.correctAnswer.toLowerCase().split(/\s+/);
      const userWords = userAnswer.toLowerCase().split(/\s+/);
      
      // Count words that appear in both answers
      let matchedWords = 0;
      correctWords.forEach(word => {
        if (word.length > 2 && userWords.includes(word)) {
          matchedWords++;
        }
      });
      
      const matchRatio = correctWords.length > 0 ? matchedWords / correctWords.length : 0;
      score = Math.round(matchRatio * 100);
      
      if (score >= 70) {
        isCorrect = true;
        feedback = "Great speaking response! Your answer matches what we were looking for.";
      } else if (score >= 40) {
        isPartial = true;
        feedback = "Good attempt. Your spoken response contains some of the key elements we were looking for.";
      } else {
        feedback = "Your spoken response didn't contain enough of the key elements we were looking for.";
      }
    }
    
    return {
      questionIndex: index,
      isCorrect: isCorrect,
      isPartial: isPartial,
      score: score,
      feedback: feedback
    };
  });
  
  // Calculate overall score
  const overallScore = answers.reduce((sum, ans) => sum + ans.score, 0) / answers.length;
  
  // Determine stars (0-3)
  let stars;
  if (overallScore >= 85) stars = 3;
  else if (overallScore >= 70) stars = 2;
  else if (overallScore >= 50) stars = 1;
  else stars = 0;
  
  // Generate appropriate feedback based on score
  let feedbackMessage;
  if (stars === 3) {
    feedbackMessage = `Excellent work! You scored ${Math.round(overallScore)}% on this test.`;
  } else if (stars === 2) {
    feedbackMessage = `Good job! You scored ${Math.round(overallScore)}% on this test. Keep practicing to improve further.`;
  } else if (stars === 1) {
    feedbackMessage = `You scored ${Math.round(overallScore)}% on this test. With more practice, you can improve your understanding of this subject.`;
  } else {
    feedbackMessage = `You scored ${Math.round(overallScore)}% on this test. Don't worry - review the material and try again to improve your score.`;
  }
  
  return {
    answers,
    overallScore,
    stars,
    feedback: feedbackMessage
  };
}

async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract parameters from request body
    const { testId, answers, timeSpent } = req.body;
    
    console.log('Received test submission:', { testId, timeSpent, answersCount: answers?.length });
    console.log('First answer format:', answers[0]);
    
    if (!testId || !answers) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Validate answers format - ensure they have questionIndex and userAnswer
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an array' });
    }

    // Get the test data
    const testData = await AcademicTest.findById(testId);
    if (!testData) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Evaluate the test using Claude AI
    let evaluation;
    try {
      evaluation = await evaluateWithClaude(testData, answers);
    } catch (aiError) {
      console.error("Error with AI evaluation, using basic evaluation:", aiError);
      evaluation = generateBasicEvaluation(testData, answers);
    }

    // Create a new test response record
    // Ensure stars value is within valid range (0-3) to prevent validation errors
    const starsValue = Math.min(Math.max(parseInt(evaluation.stars) || 0, 0), 3);
    console.log(`Original stars value: ${evaluation.stars}, Validated stars value: ${starsValue}`);
    
    const testResponse = new AcademicTestResponse({
      userId: testData.userId,
      testId: testData._id,
      answers: evaluation.answers.map(ans => {
        // Get the answer for this question index
        let userAnswer = '';
        
        // Handle both formats - array of strings or array of objects with userAnswer property
        if (Array.isArray(answers)) {
          if (typeof answers[ans.questionIndex] === 'string') {
            userAnswer = answers[ans.questionIndex];
          } else if (answers[ans.questionIndex] && typeof answers[ans.questionIndex] === 'object') {
            userAnswer = answers[ans.questionIndex].userAnswer;
          }
        }
        
        // Ensure userAnswer is never empty to satisfy the required constraint
        if (!userAnswer || userAnswer.trim() === '') {
          userAnswer = 'No answer provided';
        }
        
        return {
          questionIndex: ans.questionIndex,
          userAnswer: userAnswer,
          isCorrect: ans.isCorrect === true,
          score: ans.score,
          feedback: ans.feedback
        };
      }),
      overallScore: evaluation.overallScore,
      stars: starsValue, // Use the validated stars value
      feedback: evaluation.feedback,
      timeSpent,
      completedAt: new Date()
    });

    // Save to database
    await testResponse.save();
    
    // Update the test record to mark it as completed
    testData.isCompleted = true;
    testData.completedAt = new Date();
    await testData.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Academic test evaluated successfully',
      evaluation: {
        answers: evaluation.answers,
        overallScore: evaluation.overallScore,
        stars: evaluation.stars,
        feedback: evaluation.feedback
      }
    });
  } catch (error) {
    console.error('Error evaluating academic test:', error);
    res.status(500).json({ error: 'Failed to evaluate academic test', details: error.message });
  }
}

// No authentication required - directly connect to database
export default connectDb(handler);
