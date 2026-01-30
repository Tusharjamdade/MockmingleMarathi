// /**
//  * API endpoint for generating academic questions using OpenAI's GPT-4 model
//  * Questions are generated in Marathi based on the provided academic parameters
//  */



// export const config = {
//   runtime: 'nodejs',
//   maxDuration: 300,
// };

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   const { level, subject, role, board } = req.body;

//   if ((!level) && (!role || !subject || !board)) {
//     return res.status(400).json({ error: 'Role, Subject, board and level are required.' });
//   }

//   try {
//     const questions = await generateQuestionsWithOpenAI(level, role, board, subject);

//     if (questions) {
//       return res.status(200).json({
//         message: 'Questions generated successfully.',
//         questions,
//       });
//     } else {
//       return res.status(500).json({ error: 'Failed to generate questions.' });
//     }
//   } catch (error) {
//     console.error('Error during processing:', error);
//     return res.status(500).json({ 
//       error: 'Error during question generation.',
//       details: error.message 
//     });
//   }
// }

// async function generateQuestionsWithOpenAI(level, role, board, subject) {
//   const openaiUrl = 'https://api.openai.com/v1/chat/completions';
  
//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//   };

//   const systemPrompt = `You are an experienced primary school teacher. Generate 10 simple, beginner-friendly questions in Marathi. `;
  
//   const userPrompt = `Generate 10 well-structured, syllabus-aligned academic questions in Marathi based on the following details:

// Subject: ${subject}

// Standard (Grade): ${role}

// Difficulty Level: ${level} (Easy / Medium / Hard)

// Education Board: ${board}

// 🔹 Requirements:
// All questions must be written in Marathi language only.

// Each question must contain at least 2 full sentences to ensure clarity and depth. Avoid short or incomplete prompts.
// Make sure sentences use proper grammer.

// Use Marathi numerals to number the questions (e.g., १, २, ३, ...).

// All questions must be strictly aligned with the official syllabus of the specified standard and board.

// Ensure that the difficulty level is appropriate:

// Easy: Basic concept explanation

// Medium: Applied understanding or reasoning

// Hard: Analytical, comparative, or evaluative thinking

// Frame descriptive or application-based questions only (e.g., “समजावून सांगा”, “तुलनात्मक विवेचन करा”, “स्पष्ट करा”, “लघुनिबंध लिहा”, etc.).

// Do not include answers, hints, or extra formatting—just a clean list of numbered questions.
// `;

//   const requestBody = {
//     model: 'gpt-4',
//     messages: [
//       { role: 'system', content: systemPrompt },
//       { role: 'user', content: userPrompt }
//     ],
//     temperature: 0.7,
//     max_tokens: 1000
//   };

//   try {
//     const response = await fetch(openaiUrl, {
//       method: 'POST',
//       headers: headers,
//       body: JSON.stringify(requestBody)
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('OpenAI API Error:', errorData);
//       throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
//     }

//     const data = await response.json();
//     return data.choices[0]?.message?.content || '';
//   } catch (error) {
//     console.error('Error calling OpenAI API:', error);
//     throw error;
//   }
// }


/**
 * API endpoint for generating academic questions using OpenAI's GPT-4 model
 * Questions are generated in Marathi based on the provided academic parameters
 */

export const config = {
  runtime: 'nodejs',
  maxDuration: 60, // Set to 60s (Vercel hobby limit) or higher if Pro
};

export default async function handler(req, res) {
  // 1. Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Environment Variable Check
  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY environment variable');
    return res.status(500).json({ error: 'Server configuration error: API Key missing.' });
  }

  const { level, subject, role, board } = req.body;

  // 3. Input Validation
  // Ensure all fields are present. 
  if (!level || !role || !subject || !board) {
    return res.status(400).json({ error: 'All fields are required: Role (Standard), Subject, Board, and Level.' });
  }

  try {
    const questions = await generateQuestionsWithOpenAI(level, role, board, subject);

    if (questions) {
      return res.status(200).json({
        message: 'Questions generated successfully.',
        questions,
      });
    } else {
      throw new Error('No content received from OpenAI.');
    }
  } catch (error) {
    console.error('Final Error Handler:', error.message);
    return res.status(500).json({ 
      error: 'Error during question generation.',
      details: error.message 
    });
  }
}

async function generateQuestionsWithOpenAI(level, role, board, subject) {
  const openaiUrl = 'https://api.openai.com/v1/chat/completions';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  };

  const systemPrompt = `You are an experienced school teacher in Maharashtra. Generate 10 academic questions in Marathi.`;
  
const userPrompt = `
खाली दिलेले प्रश्न फक्त संदर्भासाठी आहेत.
हे प्रश्न उत्तरामध्ये पुन्हा देऊ नयेत, भाषांतर करू नये किंवा थेट बदलून वापरू नयेत.

हे प्रश्न फक्त अभ्यासक्रमाचा स्तर, विषय आणि अवघडपणा समजून घेण्यासाठी दिले आहेत.

----------------------------------------
संदर्भ प्रश्न (फक्त समजण्यासाठी):

१. इलेक्ट्रॉनिक्स या विषयाचा मुख्य अभ्यास कशाशी संबंधित आहे?
२. विद्युत प्रवाहाचे एकक कोणते आहे?
३. इन्सुलेटिंग बोर्डवर सपाट चालक वापरण्याची संकल्पना सर्वप्रथम कोणी मांडली?
४. AC आणि DC प्रवाहामधील फरक स्पष्ट करा.
५. सिंगल लेयर PCB ची रचना स्पष्ट करा.
६. सिंगल लेयर PCB च्या मर्यादा कोणत्या आहेत?
७. बदलत्या प्रतिरोधकांना कोणत्या नावाने ओळखले जाते?
८. विद्युत क्षेत्रामध्ये ऊर्जा साठवणारा घटक कोणता आहे?
९. इंडक्टरला दुसऱ्या कोणत्या नावाने ओळखले जाते?
१०. डायोडमधून विद्युत प्रवाह कसा वाहतो ते स्पष्ट करा.

११. समांतर परिपथामध्ये व्होल्टेजचे स्वरूप कसे असते?
१२. SMT या संक्षेपाचा अर्थ स्पष्ट करा.
१३. THT घटक PCB वर कसे बसवले जातात?
१४. PCB असेंब्ली ऑपरेटरचे मुख्य कार्य कोणते आहे?
१५. PCB असेंब्ली ऑपरेटरच्या कामामध्ये कोणती जबाबदारी समाविष्ट नसते?
१६. सिरीज सर्किटमध्ये कोणता घटक संपूर्ण परिपथात समान राहतो?
१७. इलेक्ट्रॉनिक्स व विद्युत अभियांत्रिकी यामधील फरक स्पष्ट करा.
१८. मायक्रोव्हाया प्रामुख्याने कुठे वापरले जातात?
१९. स्थिर प्रतिरोधकांची वैशिष्ट्ये स्पष्ट करा.
२०. इलेक्ट्रॉनिक सिग्नल वाढविण्यासाठी किंवा स्विच करण्यासाठी कोणते उपकरण वापरले जाते?

२१. PCB वरील सोल्डर मास्कचे मुख्य कार्य स्पष्ट करा.
२२. टॉम्बस्टोनिंग हा दोष कशाशी संबंधित आहे?
२३. BGA सोल्डर जॉइंटची तपासणी कशाच्या सहाय्याने केली जाते?
२४. PCB वरील सोल्डर काढण्यासाठी कोणते साधन वापरले जाते?
२५. फ्लक्सचा उपयोग का केला जातो?
२६. THT घटकांसाठी कोणती सोल्डरिंग प्रक्रिया वापरली जाते?
२७. AOI चा उपयोग कोणते दोष शोधण्यासाठी होतो?
२८. सोल्डर ब्रिज झाल्यास काय परिणाम होतो?
२९. ESD रिस्ट स्ट्रॅपचा उपयोग स्पष्ट करा.
३०. वैयक्तिक सुरक्षा साधनांमध्ये (PPE) कोणकोणत्या गोष्टींचा समावेश होतो?

३१. CPU म्हणजे काय ते स्पष्ट करा.
३२. ROM चा उपयोग काय आहे?
३३. आउटपुट डिव्हाइस म्हणजे काय?
३४. MS Excel चा उपयोग कोणत्या कामासाठी केला जातो?
३५. Ctrl + X या शॉर्टकटचा उपयोग स्पष्ट करा.
३६. ऑपरेटिंग सिस्टिम म्हणजे काय?
३७. फोल्डरचा उपयोग कशासाठी केला जातो?
३८. वेब ब्राउझर म्हणजे काय?
३९. संगणकातील व्हायरस म्हणजे काय?
४०. हार्ड कॉपी म्हणजे काय?

४१. संघकार्य (Teamwork) म्हणजे काय?
४२. व्यावसायिक वर्तनामध्ये कोणत्या गुणांचा समावेश होतो?
४३. वेळेचे व्यवस्थापन का महत्त्वाचे आहे?
४४. देहबोलीचा संवादामध्ये कसा उपयोग होतो?
४५. सकारात्मक दृष्टिकोनाचे फायदे स्पष्ट करा.
४६. फीडबॅक का आवश्यक असतो?
४७. कार्यस्थळावरील शिस्त का आवश्यक आहे?
४८. ऐकण्याची सवय संवाद कौशल्य कशी सुधारते?
४९. नैतिक मूल्ये म्हणजे काय?
५०. KiCad सॉफ्टवेअरचा उपयोग स्पष्ट करा.

----------------------------------------

वरील प्रश्नांचा वापर फक्त संदर्भासाठी करा.

आता खालील माहितीच्या आधारे नवीन प्रश्न तयार करा:

विषय: ${subject}
इयत्ता / वर्ग: ${role}
अवघडपणाची पातळी: ${level}
शिक्षण मंडळ: ${board}

कठोर अटी:
1. उत्तरामध्ये फक्त नवीन प्रश्न द्यावेत.
2. वरील संदर्भ प्रश्न पुन्हा वापरू नयेत.
3. सर्व प्रश्न मराठी भाषेत असावेत.
4. प्रश्न समान अवघडपणाचे व अभ्यासक्रमाशी संबंधित असावेत.
5. प्रश्न वर्णनात्मक किंवा उपयोगाधारित असावेत.
   (उदा. स्पष्ट करा, कारणे द्या, महत्त्व सांगा, कार्य समजावून सांगा).
6. प्रत्येक प्रश्न किमान दोन पूर्ण वाक्यांचा असावा.
7. मराठी क्रमांक वापरावेत (१, २, ३…).
8. कोणतीही उत्तरे, संकेत, MCQ किंवा एक ओळीचे प्रश्न देऊ नयेत.

फक्त १० नवीन प्रश्न तयार करा.
`;


  const requestBody = {
    model: 'gpt-4', // Ensure you have access to gpt-4, otherwise use 'gpt-3.5-turbo'
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1500
  };

  try {
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    // Handle OpenAI specific errors (401, 429, 500 from their side)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Prevent crash if body is empty
      console.error('OpenAI API Error Status:', response.status);
      console.error('OpenAI API Error Body:', errorData);
      throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';

  } catch (error) {
    console.error('Fetch/Network Error:', error);
    throw error;
  }
}