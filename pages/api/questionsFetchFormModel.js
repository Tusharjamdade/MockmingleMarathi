// // api/response.js


// export const getApiResponse = async (jobrole,level) => {
//     const url = "http://139.59.42.156:11434/api/generate";
//     const headers = {
//       "Content-Type": "application/json"
//     };
//     const data = {
//       model: "gemma:2b",
//       prompt: `give mi 15 question to ${jobrole} this job role ${level} level`,
//       stream: false
//     };
  
//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: headers,
//         body: JSON.stringify(data),
//       });
  
//       if (response.ok) {
//         const responseData = await response.json();
//         return responseData.response; // Return the response from the API
//       } else {
//         console.error("Error fetching response from the API.");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error in the fetch operation:", error);
//       return null;
//     }
//   };
  

// export const getApiResponse = async (jobrole, level) => {
//   const url = `${process.env.NEXT_PUBLIC_HOST}/api/proxy`; // Replace with your Vercel proxy URL
//   const headers = {
//     "Content-Type": "application/json",
//   };

//   const data = {
//     model: "gemma:2b",
//     prompt: `give mi 15 question to ${jobrole} this job role for ${level} level`,
//     stream: false,
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       const responseData = await response.json();
//       return responseData.response; // Return the response from the API
//     } else {
//       console.error("Error fetching response from the API.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error in the fetch operation:", error);
//     return null;
//   }
// };


 // Importing the function for fetching questions

 export const config = {
  runtime: "nodejs", // Ensure it's a Node.js function
  maxDuration: 300,
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { jobRole, level } = req.body;

    try {
      // Call the getApiResponse function directly within the handler
      const fetchedQuestions = await getApiResponse(jobRole, level);

      if (fetchedQuestions) {
        console.log('Fetched Questions:', fetchedQuestions);  // Log the fetched questions
        
        // You can also store the questions or perform further processing if necessary
        // Example: await saveQuestionsToDatabase(fetchedQuestions);

        return res.status(200).json({
          message: "Job role submitted. Questions fetched successfully.",
          questions: fetchedQuestions,
        });
      } else {
        return res.status(500).json({
          error: "Error: No questions fetched from the API.",
        });
      }
    } catch (error) {
      console.error('Error during processing:', error);
      return res.status(500).json({
        error: "Error during background processing.",
      });
    }
  }

  // If the method is not POST, return a 405 Method Not Allowed response
  return res.status(405).json({ error: 'Method Not Allowed' });
}

// The API function to fetch questions
export const getApiResponse = async (jobRole, level) => {
  const url = "http://139.59.42.156:11434/api/generate";
  const headers = {
    "Content-Type": "application/json",
  };
  const data = {
    model: "llama3:latest",
    prompt: `Give me 10 questions for the ${jobRole} job role at ${level} level`, // Fixed template string
//     prompt: `:You are an AI assistant generating a structured job assessment questionnaire for the role of  ${jobRole}  in the Cross-Divisional & Support Roles department at Dynamic Crane Engineers Pvt. Ltd.
// **Assessment Structure:**
//  **Section 1: Technical Knowledge (4 Questions)**
// - Assess knowledge of crane safety systems, aerial work platforms, preventive maintenance, troubleshooting, and Dynamic’s electronic safety solutions.
// - **Example Topics:**
//  - Safe Load Indicators
//   - Outrigger Status Indicators
//  - Wind Speed Monitoring
//   - Equipment Maintenance
//   - Safety Compliance
//  **Section 2: Scenario-Based Questions (3 Questions)**
// - Include real-world problem-solving scenarios that a Sales Engineer would encounter.
// - **Example Topics:**
//   - Handling urgent client requests
//   - Managing customer complaints
//   - Ensuring product compatibility and compliance
//   - Providing technical solutions during sales negotiations
//  **Section 3: Company-Specific Knowledge (3 Questions)**
// - Assess the candidate’s familiarity with Dynamic Crane Engineers’ products, services, and past projects.
// - **Example Topics:**
//   - 'Cloud Connected Cranes' project
//   - Key safety products
//   - Authorized dealership partnerships
//   - Major company milestones
// `, // Fixed template string
//     prompt: `You are an AI assistant generating a structured job assessment questionnaire for the role of ${jobRole} in the Cross-Divisional & Support Roles department at Dynamic Crane Engineers Pvt. Ltd.
// **Assessment Structure:**
//  Dynamic Crane Engineers Pvt. Ltd. is a leading provider of crane safety systems, aerial work platform rentals, crane spares, and training services. The company specializes in man and material safety solutions, digital and electronic safety products, and rental services for material handling equipment.

// Assessment Objective:
// The goal of this assessment is to evaluate employees based on their specific job roles within the company. The questions will focus on their technical knowledge, problem-solving skills scenario based, safety regulations real life scenario based, industry best practices, and job-specific competencies.

// Job Roles & Their Assessment Focus Areas
// 1. Accounts & Finance
// Financial reporting and analysis
// Budgeting and cost control
// Taxation and compliance (GST, income tax, etc.)
// Payroll processing and salary management
// Vendor payments and receivables management
// 2. Human Resources (HR)
// Recruitment and onboarding process
// Employee performance management
// Payroll and benefits administration
// Labor laws and compliance
// Workplace safety and employee welfare
// 3. Sales & Marketing
// Sales strategies for crane safety products and rental services
// Customer relationship management (CRM)
// B2B sales and client handling
// Digital marketing for industrial equipment
// Market research and competitor analysis
// 4. Service & Maintenance Engineers
// Troubleshooting crane safety systems
// Preventive and corrective maintenance of cranes and AWPs
// Calibration of electronic safety devices
// Understanding lift plans and load charts
// Compliance with safety regulations in crane operations
// 5. Equipment Rental & Operations
// Fleet management of aerial work platforms and cranes
// Rental agreements and client coordination
// Safe handling and operation of rental equipment
// Maintenance scheduling and inspections
// Compliance with industrial safety standards
// 6. Design & Development (Engineering Team)
// Product development of safety devices for cranes
// Sensor technology in material handling equipment
// Software and hardware integration for crane safety
// Cloud-based monitoring systems for lifting equipment
// Customization of safety products for clients
// 7. Procurement & Inventory Management
// Supplier management and negotiations
// Inventory control and stock management
// Sourcing spare parts and components
// Cost optimization in procurement
// Quality checks and supplier evaluations
// prompt: `You are an AI assistant generating a structured job assessment questionnaire which includes 2 mcq questions, 2 descriptive questions, 2 questions related to company, 2 questions for decision making and 2 technical questions for the role of ${jobRole} in the Cross-Divisional & Support Roles department at Dynamic Crane Engineers Pvt. Ltd.
// **Assessment Structure:**
// `, // Fixed template string

// The goal of this assessment is to evaluate employees based on their specific job roles within the company. The questions will focus on their 2 mcq technical knowledge,2 problem-solving skills scenario based, 2 safety regulations real life scenario based, 2 industry best practices, 1 company related and 1 job-specific competencies. avoid generic questions.


//   prompt: `You are an AI assistant generating a structured job assessment questionnaire  for the role of ${jobRole} in the Cross-Divisional & Support Roles department at Dynamic Crane Engineers Pvt. Ltd.
// **Assessment Structure:**
//  Dynamic Crane Engineers Pvt. Ltd. is a leading provider of crane safety systems, aerial work platform rentals, crane spares, and training services. The company specializes in man and material safety solutions, digital and electronic safety products, and rental services for material handling equipment.
// Here’s a compelling long-form story based on your company profile:  

// ### *The Journey of Dynamic Crane Engineers Pvt. Ltd.: A Legacy of Innovation & Safety*  
// Two engineers, a small 350 sq. ft. office, and a vision—this is how *Dynamic Crane Engineers Pvt. Ltd.* began its remarkable journey nearly two decades ago. What started as a modest endeavor in material weighing and lifting has grown into a powerhouse of *crane safety systems, aerial work platform rentals, crane spares, and industry-leading training programs. Today, Dynamic stands as a **pioneer in safety and efficiency solutions* for heavy lifting, ensuring that machines and workers operate in the safest possible environments.  
 
// ### *Our Vision & Mission: Leading the Future of Lifting Safety*  
// 🔹 *Vision:* To be among the *Top 3 Indian companies* in *man & material handling equipment and digital safety solutions* for the global infrastructure industry.  
// 🔹 *Mission (EPS Division):* Deliver cutting-edge *electronic and digital safety solutions worldwide* for material handling equipment.  
// 🔹 *Mission (ER Division):* Provide comprehensive *rental and repair services* across Western India with a *diverse fleet* and *state-of-the-art workshops*.  

// ### *Divisions & Offerings: Innovating Safety at Every Step*  

// #### *Electronic Products & Services (EPS) Division*  
// Dynamic is at the forefront of *crane safety innovation, offering a wide range of **high-tech monitoring and control systems*, including:  

// 🛠 *Crane Safety Systems:*  
// Safe Load Indicators  
// Anchor Winch Monitors  
// Wind Speed Indicators  
// Winch Camera Systems  
// DRM Systems  
// Level Indicators  
// Load Indicators  
// Outrigger Status Indicators  
// Anti-Collision Devices  
// Rated Capacity Indicators  

// 🛠 *Equipment Safety Solutions:*  
// T-Log (Engine Temperature Monitoring)  
// T-Tag (Loose Lug Nut Detection)  
// Wire Rope Testing System (NDT)  

// 🛠 *Comprehensive Service Offerings:*  
// Annual Maintenance Contracts (AMCs)  
// Equipment Servicing & Repairs  
// Training Programs (Crane Safety Awareness)  
// Wire Rope NDT Testing  

// #### *Equipment Rental (ER) Division*  
// With *one of India’s largest rental fleets*, Dynamic provides:  

// 🚀 *Equipment on Rent:*  
// Aerial Work Platforms (AWPs)  
// Man & Material Hoists  

// 🔧 *Value-Added Services:*  
// AMCs for rental equipment  
// Operation & Maintenance (O&M) Contracts  
// Equipment Servicing & Refurbishing  
// Safety Training for Operators  

// ### *Trusted by Industry Leaders*  

// With a strong reputation and an extensive clientele, Dynamic has worked with *multinational corporations and local contractors* alike, ensuring their lifting operations run *safely, efficiently, and without compromise*.  
// ### *A Future Powered by Innovation & Safety*  
// With its deep-rooted expertise in *crane safety systems, digital monitoring, and rental solutions, Dynamic Crane Engineers Pvt. Ltd. continues to **set new benchmarks in safety, technology, and reliability. The journey that began with just two engineers has now grown into a **movement for safer lifting operations across India and beyond*.  
// For industry-leading *crane safety solutions, AWP rentals, and lifting technology innovations, **Dynamic is the trusted partner you need*.  
// This version makes the company’s story *engaging, inspiring, and easy to connect with*. Let me know if you’d like any tweaks! 🚀

// Assessment Objective:
// The goal of this assessment is to evaluate employees based on their specific job roles within the company. The questions will focus on their 2 mcq about technical knowledge, 2 problem-solving skills scenario based, 2 safety regulations real life scenario based, 2 industry best practices, 1 company related and 1 job-specific competencies, assessment questions should not be generic more than 50%.



// Job Roles & Their Assessment Focus Areas
// 1. Accounts & Finance
// Financial reporting and analysis
// Budgeting and cost control
// Taxation and compliance (GST, income tax, etc.)
// Payroll processing and salary management
// Vendor payments and receivables management
// 2. Human Resources (HR)
// Recruitment and onboarding process
// Employee performance management
// Payroll and benefits administration
// Labor laws and compliance
// Workplace safety and employee welfare
// 3. Sales & Marketing
// Sales strategies for crane safety products and rental services
// Customer relationship management (CRM)
// B2B sales and client handling
// Digital marketing for industrial equipment
// Market research and competitor analysis
// 4. Service & Maintenance Engineers
// Troubleshooting crane safety systems
// Preventive and corrective maintenance of cranes and AWPs
// Calibration of electronic safety devices
// Understanding lift plans and load charts
// Compliance with safety regulations in crane operations
// 5. Equipment Rental & Operations
// Fleet management of aerial work platforms and cranes
// Rental agreements and client coordination
// Safe handling and operation of rental equipment
// Maintenance scheduling and inspections
// Compliance with industrial safety standards
// 6. Design & Development (Engineering Team)
// Product development of safety devices for cranes
// Sensor technology in material handling equipment
// Software and hardware integration for crane safety
// Cloud-based monitoring systems for lifting equipment
// Customization of safety products for clients
// 7. Procurement & Inventory Management
// Supplier management and negotiations
// Inventory control and stock management
// Sourcing spare parts and components
// Cost optimization in procurement
// Quality checks and supplier evaluations

// `, // Fixed template string
    stream: false,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData.response; // Return the response from the API
    } else {
      console.error("Error fetching response from the API.");
      return null;
    }
  } catch (error) {
    console.error("Error in the fetch operation:", error);
    return null;
  }
};
