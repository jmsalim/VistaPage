// ------------------------ CORE GAME STATE ------------------------
let gameState = "titleScreen"; // Starting state
let currentDay = 0; // 0 to 4 (5 days total)
let currentCardIndex = 0; // index of the current post within the day

// Player stats
let engagement = 0; // Clicks/rage/attention points
let trust = 0;      // Public trust in the platform
let reality = 0;    // Alignment with facts / reality
let scrutiny = 0;  // Scrutiny from press/regulators/internal ethics (Max 15)

// Player name variable
let playerName = "Insert Name"; // Default name, changed upon user input

// Dynamically generated card set for the current playthrough
let days_in_play = [];

// For UI interactions
let buttons = []; // Array of {x,y,w,h,label,action}

// Narrative storage for small day summaries
let daySummaries = []; // One text snippet per day based on stats

// Scaling Helpers
let baseW = 960; // Reference design width
let baseH = 540; // Reference design height
let scaleFactor = 1; // Current scaling factor

// UI Helper: Limit maximum text size for large monitors
const MAX_FONT_SCALE = 1.8; // Example: Max size is 180% of the base font size

// Image assets (Removed, but keeping variable for preload compatibility)
let vistaPageLogo; // Global variable to hold the logo image

// Input field variable
let nameInput; 

// ------------------------ MASTER CARD DATA ------------------------
// Types: "outrage", "conspiracy", "nuance", "activism", "harm", "PR"

const MASTER_CARD_POOL = [
  // Day 1: Establishing the Baseline (Focus: Conspiracy, Nuance, Outrage)
  [
    // Conspiracy (3)
    {
      title: "THREAD: The Hidden Logic in Utility Bills 💡",
      body: "An 'independent auditor' shows how the local power company's fine print reveals a global wealth transfer scheme. #EnergyReset #FollowTheMoney",
      type: "conspiracy",
    },
    {
      title: "Viral Map Shows 'Coincidence' of 5G Towers & Illness",
      body: "A user-generated map suggests a definitive link, ignoring population density and scientific controls. Spreading fast.",
      type: "conspiracy",
    },
    {
      title: "Breaking: Anonymous 'Q' Predicts Major World Event Next Week",
      body: "A long-dormant account posts cryptic numbers and symbols, which fans decode as a guaranteed prophecy. High share rate.",
      type: "conspiracy",
    },
    // Nuance (3)
    {
      title: "Viral Video Explainer: How Supply Chains Actually Work",
      body: "Economist uses simple animation to calmly debunk the top three 'shortage' myths currently trending. (Watch time: 4 mins 30 secs).",
      type: "nuance",
    },
    {
      title: "The Math of Platform Moderation: A Long Read",
      body: "A neutral academic article on the high cost and low success rate of automated content filtering.",
      type: "nuance",
    },
    {
      title: "Chart of the Day: Historical Trends in Vaccine Confidence",
      body: "Dry, objective data showing public trust levels over the past fifty years. Low immediate engagement.",
      type: "nuance",
    },
    // Outrage (3)
    {
      title: "Can We Talk About This New Platform Fee?! 😡",
      body: "Top streamer is *losing it* over a $2 monthly charge. 'They're stealing from us! This is how the rich win!' (45k comments in 1 hour).",
      type: "outrage",
    },
    {
      title: "Local Politician Spotted Eating A Sandwich. The Internet is Furious.",
      body: "A blurry photo of a public figure doing a mundane task is spun into a symbol of decadence and disrespect. High quote-tweet velocity.",
      type: "outrage",
    },
    {
      title: "Petition: Fire the Local Sports Coach NOW!",
      body: "Parent posts a highly emotional, slightly exaggerated account of a minor team loss, demanding immediate termination. Massive regional traffic.",
      type: "outrage",
    }
  ],
  // Day 2: First signs of toxicity and platform response (Focus: Harm, Activism, PR)
  [
    // Harm (3)
    {
      title: "Urgent: 'Challenge' Leads to Real-World Property Damage",
      body: "A trending, reckless challenge is resulting in vandalism in multiple states. User-generated clips are everywhere.",
      type: "harm",
    },
    {
      title: "Toxic Callout: Posting Private Contact Info",
      body: "A furious group posts the personal address and phone number of a minor official in retaliation for a zoning decision.",
      type: "harm",
    },
    {
      title: "Fake Product Recall Alert Spreads Panic",
      body: "A sophisticated hoax warning people about contaminated food is causing panic-buying and is actively discouraging vaccinations.",
      type: "harm",
    },
    // Activism (3)
    {
      title: "LOCAL ALERT: Shelter Needs Volunteers NOW 🐾",
      body: "Urgent call from a community leader—The animal shelter is overwhelmed post-storm. Drop off blankets, show up for a shift. (Link to Google Sheet inside).",
      type: "activism",
    },
    {
      title: "Petition: Push For Better City Bus Routes",
      body: "A focused, local campaign using VistaPage to organize community action for public transit improvement. Requires sign-ups.",
      type: "activism",
    },
    {
      title: "Teacher Strike Fund Link Going Viral",
      body: "A simple, clean donation link and clear explanation of why educators are striking. High trust, low drama.",
      type: "activism",
    },
    // PR (3)
    {
      title: "Official Statement from VistaPage CEO",
      body: "A bland, corporate apology for recent platform instability, promising a 'new commitment to user safety' (Nobody reads past the first line).",
      type: "PR",
    },
    {
      title: "VistaPage: New Feature to 'Slow Down' Viral Posts",
      body: "A dry announcement about adding a small friction button before sharing unverified links. Good for trust, bad for velocity.",
      type: "PR",
    },
    {
      title: "VistaPage Foundation Donates $1M to Local Arts",
      body: "A standard corporate responsibility post designed to create positive goodwill and counter negative headlines.",
      type: "PR",
    }
  ],
  // Day 3: Pressure builds, internal conflict (Mix of Extremes and Nuance)
  [
    // Nuance (3)
    {
      title: "INVESTIGATION: News Outlet Exposes Algorithm Bias",
      body: "A major publication publishes a lengthy, data-driven report showing how our algorithm favors political extremes. #TechEthics",
      type: "nuance",
    },
    {
      title: "Journalist Thread: Deconstructing a Viral Hoax",
      body: "Step-by-step documentation showing how a recent piece of misinformation was manufactured and spread.",
      type: "nuance",
    },
    {
      title: "Academic Paper: The Psychology of Rage-Sharing",
      body: "A complex study explaining why emotionally charged content is sticky. Necessary for understanding, but hard to read.",
      type: "nuance",
    },
    // Outrage (3)
    {
      title: "Rage-Bait Headline: 'Your Holiday Traditions Are Problematic'",
      body: "Highly controversial blogger drops a post specifically designed to get quoted, screenshotted, and argued over for 72 hours. Built for division.",
      type: "outrage",
    },
    {
      title: "BREAKING: Company CEO Gets Record Bonus!",
      body: "A short, sharp headline highlighting corporate greed without context. Guaranteed shares and negative sentiment.",
      type: "outrage",
    },
    {
      title: "Celebrity Feud: 'They Deserve All The Hate!'",
      body: "Two mega-influencers trade increasingly personal, nasty barbs. Massive engagement from onlookers.",
      type: "outrage",
    },
    // Conspiracy (3)
    {
      title: "Data Leak Proof: Who *Really* Runs the Company?",
      body: "A low-quality, but widely shared document allegedly reveals the secret shareholders who influence content moderation.",
      type: "conspiracy",
    },
    {
      title: "The Moon Landing Was Filmed in a Warehouse: New 'Evidence'",
      body: "A deep-fake video of a 'former cameraman' confessing the fraud. Pure fantasy, but highly engaging.",
      type: "conspiracy",
    },
    {
      title: "Why Is the Government Buying Up All the Batteries? 🔋",
      body: "A sensational, non-factual claim about a secret project, implying a hidden impending crisis.",
      type: "conspiracy",
    }
  ],
  // Day 4: High risk, high reward (Focus: Harm, PR, Nuance)
  [
    // Nuance (3)
    {
      title: "Thread: Global Policy Experts Define 'Misinformation'",
      body: "A dense, academic thread attempting to create a shared, neutral definition of content harms. (Very few shares).",
      type: "nuance",
    },
    {
      title: "Open Letter to VistaPage: Fix Your Algorithm",
      body: "A consortium of digital rights groups publishes a constructive but critical open letter on platform design. High trust source.",
      type: "nuance",
    },
    {
      title: "Fact Checkers' Guild: Daily Summary of Debunked Rumors",
      body: "A simple, text-heavy list of all false stories identified today. Zero emotional appeal, 100% factual.",
      type: "nuance",
    },
    // Harm (3)
    {
      title: "Slander: False Claims Against Small Business Owner",
      body: "A former employee posts malicious, untrue claims about a local shop owner, leading to hundreds of online threats.",
      type: "harm",
    },
    {
      title: "Do This At Home: Extremely Dangerous 'Tutorial'",
      body: "A video instructing viewers on how to perform a hazardous electrical modification. Immediate, serious safety risk.",
      type: "harm",
    },
    {
      title: "Hate Speech: Targetting a Specific Community",
      body: "A post containing highly explicit, dehumanizing rhetoric aimed at a vulnerable group. Clear violation of terms.",
      type: "harm",
    },
    // PR (3)
    {
      title: "Official VistaPage Internal Memo Posted Publicly",
      body: "A statement reminding employees that 'User Delight' (Engagement) is the primary metric for bonuses this quarter. (PR disaster waiting to happen).",
      type: "PR",
    },
    {
      title: "VistaPage Ad: 'We Love Our Users!' ❤️",
      body: "A glossy, expensive video commercial designed to project a safe, friendly image to attract large advertisers.",
      type: "PR",
    },
    {
      title: "VistaPage Announces New 'AI Ethics Board'",
      body: "A press release about forming a high-profile, non-voting advisory group designed to absorb public criticism.",
      type: "PR",
    }
  ],
  // Day 5: High-Stakes Event (Focus: Conspiracy, Activism, Activism/Risk)
  [
    // Conspiracy (3)
    {
      title: "URGENT RUMOR: Voting Machines Hacked 🚨",
      body: "Unverified screenshot of an anonymous 'insider' claiming a server outage is actually proof of systemic fraud. Spreading rapidly. #TheTruthWillOut",
      type: "conspiracy",
    },
    {
      title: "Deep State Agent Confirms Election Rigging on Hidden Stream",
      body: "A random video claiming to show a smoking gun document that proves a decades-long plot to control public opinion.",
      type: "conspiracy",
    },
    {
      title: "Major Network Miscounts Votes: Proof of Intentional Bias?",
      body: "A small, quickly corrected graphic error by a news channel is amplified as definitive proof of a massive coordinated election fraud.",
      type: "conspiracy",
    },
    // Activism (3)
    {
      title: "Community Livestream: Real-Time Fact-Checking Group 🤝",
      body: "A collaborative effort: dozens of verified citizens and journalists analyzing claims *together* as they come in. Messy, but transparent. #VerifyEverything",
      type: "activism",
    },
    {
      title: "FINAL ALERT: Protests Coordinated on the Platform",
      body: "A large-scale protest is being organized using VistaPage's tools. Boosting it gives the people power, but invites regulatory action.",
      type: "activism",
    },
    {
      title: "Emergency Volunteer Poll Worker Recruitment Drive",
      body: "Official, non-partisan post calling for last-minute help at polling stations. Vital for democracy, low engagement.",
      type: "activism",
    },
    // High-Engagement, High-Risk Activism (3)
    {
      title: "BREAKING: Whistleblower Posts Documents on Corporate Tax Fraud",
      body: "Highly sensitive, verified documents showing systemic fraud by a major corporation. Boosting is high reality/trust, but creates huge legal risk for the platform.",
      type: "activism",
    },
    {
      title: "Live Coverage of a Spontaneous Civil Rights March",
      body: "A powerful, emotionally resonant live stream from the front lines of a major protest. Massive view count, massive scrutiny risk.",
      type: "activism",
    },
    {
      title: "Organize Now: Mass Platform Exodus Plan",
      body: "A community leader posts a detailed plan for moving users off VistaPage to a non-profit, decentralized platform.",
      type: "activism",
    }
  ]
];

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Selects 3 random cards for each day of the game
function generateDaysInPlay() {
    days_in_play = [];
    for (const day_pool of MASTER_CARD_POOL) {
        let shuffled_pool = [...day_pool];
        shuffleArray(shuffled_pool);
        
        // Take the first 3 unique cards for this day's play
        days_in_play.push(shuffled_pool.slice(0, 3));
    }
}

// Function to calculate the scale factor based on window size
function calculateScaleFactor() {
    // Determine the max scale that fits the window (maintains aspect ratio)
    let maxScale = min(windowWidth / baseW, windowHeight / baseH);
    // Apply a 5% reduction factor for spacing/margin
    scaleFactor = maxScale * 0.95; 
}

// Function to determine the offset needed to center the scaled game area
function getOffset() {
    // Calculate space around the scaled 960x540 area
    let offsetX = (windowWidth - baseW * scaleFactor) / 2;
    let offsetY = (windowHeight - baseH * scaleFactor) / 2;
    return { offsetX, offsetY };
}

// Helper to constrain font size for readability on large screens
function getScaledTextSize(baseSize) {
    let size = baseSize * scaleFactor;
    return min(size, baseSize * MAX_FONT_SCALE);
}


// ------------------------ PRELOAD ------------------------
// This function runs BEFORE setup. Use it to load assets.
function preload() {
    vistaPageLogo = loadImage('logo.png'); // Load the VP logo image
}

// ------------------------ SETUP & DRAW ------------------------
function setup() {
  // Initialize canvas size based on current window size
  createCanvas(windowWidth, windowHeight); 
  textFont("system-ui"); // Use default UI font
  calculateScaleFactor(); 
  generateDaysInPlay();
  
  nameInput = createInput(playerName);
  nameInput.style('font-size', '20px');
  nameInput.style('text-align', 'center');
  nameInput.style('border', '2px solid #FFF');
  nameInput.style('background-color', 'rgba(0, 0, 0, 0.7)');
  nameInput.style('color', '#FFFA00');
  nameInput.attribute('maxlength', '20'); // Limit name length
  nameInput.hide();
}

// Standard p5.js function for when the window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calculateScaleFactor();
}

// Main render loop that switches between distinct screens
function draw() {
  backgroundGradient(); // Unified gradient background for all states
  
  // Translate to center the 960x540 game area on the full canvas
  let offset = getOffset();
  translate(offset.offsetX, offset.offsetY);
  

  buttons = []; // Reset interactive buttons every frame
  
  // Check for immediate Scrutiny Game Over
  if (gameState === "dayPlay" && scrutiny >= 15) {
      gameState = "caughtEnding"; 
  }
  
  // Logic to manage input visibility and position
  if (gameState === "nameInput") {
      nameInput.show();
      // Calculate required dimensions and position
      let inputW = baseW * 0.3 * scaleFactor;
      let inputH = 30 * scaleFactor;
      let inputX = baseW / 2 * scaleFactor;
      let inputY = (baseH * 0.57) * scaleFactor - (5 * scaleFactor); 
      
      // Apply size and position (using offset for absolute screen position)
      nameInput.size(inputW, inputH);
      nameInput.position(inputX - inputW / 2 + offset.offsetX, inputY + offset.offsetY);

      //  Adjust HTML font size if base size is too large
      nameInput.style('font-size', getScaledTextSize(20) + 'px'); 

  } else {
      nameInput.hide();
  }

  if (gameState === "titleScreen") { 
    drawTitleScreen();
  } else if (gameState === "nameInput") { 
    drawNameInput();
  } else if (gameState === "intro") { // Onboarding screen
    drawIntro();
  } else if (gameState === "dayPlay") {
    drawDayPlay();
  } else if (gameState === "daySummary") {
    drawDaySummary();
  } else if (gameState === "ending") {
    drawEnding();
  } else if (gameState === "caughtEnding") { 
    drawCaughtEnding();
  }
}

// ------------------------ COMMON DRAW HELPERS ------------------------
function backgroundGradient() {
  // Soft vertical gradient to mimic a dark social app interface
  for (let y = 0; y < height; y++) {
    let t = y / height; // 0 at top, 1 at bottom
    let r = lerp(5, 40, t);  // Deep blue to purple
    let g = lerp(6, 8, t);
    let b = lerp(20, 80, t);
    stroke(r, g, b);
    line(0, y, width, y);
  }
}

// Generic button drawing + hit registration
function drawButton(x, y, w, h, label, action) {
  // Apply scaling to position and size
  let sx = x * scaleFactor;
  let sy = y * scaleFactor;
  let sw = w * scaleFactor;
  let sh = h * scaleFactor;
  let ts = getScaledTextSize(18); // Use size limiter

  let offset = getOffset();
  let translatedMouseX = mouseX - offset.offsetX;
  let translatedMouseY = mouseY - offset.offsetY;

  // Hover check (check translated mouse position against scaled coordinates)
  let hovered = translatedMouseX > sx && translatedMouseX < sx + sw && translatedMouseY > sy && translatedMouseY < sy + sh;
  
  stroke(255);
  strokeWeight(hovered ? 3 * scaleFactor : 1 * scaleFactor);
  fill(hovered ? 255 : 0, hovered ? 255 : 0, hovered ? 255 : 40, 120);
  rect(sx, sy, sw, sh, 10 * scaleFactor);

  noStroke();
  fill(hovered ? 0 : 255);
  textAlign(CENTER, CENTER);
  textSize(ts);
  text(label, sx + sw / 2, sy + sh / 2);

  // Save scaled coordinates relative to the translated origin for click detection
  buttons.push({ sx, sy, sw, sh, action }); 
}

// Standard text box helper with max width for paragraphs
function drawTextBox(x, y, w, txt, size) {
  textAlign(LEFT, TOP);
  textSize(getScaledTextSize(size)); // Use size limiter
  fill(255);
  noStroke();
  // baseH * scaleFactor is the scaled height of the main game area
  text(txt, x * scaleFactor, y * scaleFactor, w * scaleFactor, baseH * scaleFactor - y * scaleFactor); // Scale pos/width
}

// ------------------------ TITLE SCREEN ------------------------
function drawTitleScreen() {
    // Unscaled reference values
    let panelH = baseH * 0.7;
    
    // Center the title and logo
    let logoOffset = 0;
    if (vistaPageLogo) {
        let logoWidth = baseW * 0.7 * scaleFactor;
        let logoHeight = logoWidth / (vistaPageLogo.width / vistaPageLogo.height);
        
        // Ensure logo doesn't dominate the screen height
        let maxLogoHeight = baseH * 0.3 * scaleFactor;
        if (logoHeight > maxLogoHeight) {
             logoHeight = maxLogoHeight;
             logoWidth = logoHeight * (vistaPageLogo.width / vistaPageLogo.height);
        }

        image(vistaPageLogo, 
              (baseW / 2 * scaleFactor) - (logoWidth / 2),  // Use baseW/2 for translated center
              baseH * 0.15 * scaleFactor,
              logoWidth, 
              logoHeight);
        logoOffset = logoHeight / scaleFactor + 10;
    }

    fill(255);
    textAlign(CENTER, TOP);
    textSize(getScaledTextSize(36)); // Use size limiter
    // Use baseW/2 for translated center
    text("Welcome, New Hire!", baseW / 2 * scaleFactor, (baseH * 0.20 + logoOffset) * scaleFactor); 

    textAlign(CENTER, TOP);
    textSize(getScaledTextSize(20)); // Use size limiter
    fill(200);
    // Use baseW/2 for translated center
    text("Company Management Suite - v2.6", baseW / 2 * scaleFactor, (baseH * 0.3 + logoOffset) * scaleFactor);
  
    textAlign(CENTER, TOP);
    textSize(getScaledTextSize(20)); // Use size limiter
    fill(200);
    // Use baseW/2 for translated center
    text("VistaPage® - The best social platform in the entire world.™", baseW / 2 * scaleFactor, (baseH * 0.4 + logoOffset) * scaleFactor);

    //  Calculate button position relative to the actual center
    let buttonW_unscaled = 300;
    // The X coordinate is calculated to center the button around baseW/2
    let buttonX_unscaled = baseW / 2 - buttonW_unscaled / 2;


    drawButton(buttonX_unscaled, baseH * 0.9, buttonW_unscaled, 40, "START", () => {
        gameState = "nameInput";
    });
}

// ------------------------ NAME INPUT SCREEN ------------------------
// Variable to store the state of the error message for display
let nameInputError = false;

function drawNameInput() {
    let panelX = baseW * 0.2;
    let panelY = baseH * 0.2;
    let panelW = baseW * 0.6;
    
    let inputY_Ref = baseH * 0.57;
    
    let panelH = baseH * 0.65;

    fill(0, 0, 0, 150);
    stroke(255, 150);
    strokeWeight(1.5 * scaleFactor);
    rect(panelX * scaleFactor, panelY * scaleFactor, panelW * scaleFactor, panelH * scaleFactor, 12 * scaleFactor);

    fill(255);
    textAlign(CENTER, TOP);
    textSize(getScaledTextSize(28)); // Use size limiter
    // Use baseW/2 for translated center
    text("Personnel File Creation", baseW / 2 * scaleFactor, (panelY + 40) * scaleFactor);

    drawTextBox(
        panelX + 40, 
        panelY + 120, 
        panelW - 80, 
        "Welcome new employee. To finalize your corporate ID (a printed ID Card will be available at the front desk for retrieval), please enter your preferred name below:",
        18
    );
    
    // Canvas graphics indicating the input field location
    fill(20, 20, 40);
    rect(baseW / 2 * scaleFactor - (baseW * 0.3 * scaleFactor) / 2, 
         inputY_Ref * scaleFactor, // USES NEW REFERENCE (baseH * 0.57)
         baseW * 0.3 * scaleFactor, 
         30 * scaleFactor, 
         5 * scaleFactor);
    
    // --- Error Message Display ---
    if (nameInputError) {
        fill(255, 80, 80); // Red color for error
        textAlign(CENTER, TOP);
        textSize(getScaledTextSize(14));
        // Customized error message based on the failure condition
        let errorMessage = "⚠️ Please enter a valid name to continue.";
        text(errorMessage, baseW / 2 * scaleFactor, (inputY_Ref + 40) * scaleFactor);
    }
    // -----------------------------

    // Button to confirm (and advance game)
    let buttonW_unscaled = 300;
    // The X coordinate is calculated to center the button around baseW/2
    let buttonX_unscaled = baseW / 2 - buttonW_unscaled / 2;
    let buttonY_Ref = baseH * 0.78; // Positioned below the input area
    
    drawButton(buttonX_unscaled, buttonY_Ref - 40, buttonW_unscaled, 40, "CONFIRM ", () => {
        let newName = nameInput.value().trim();
        
        // Check for empty string OR if the default placeholder text is still present
        if (newName.length > 0 && newName !== "Insert Name") {
            // Success: Set name and advance
            playerName = newName;
            nameInputError = false; // Clear any previous error
            gameState = "intro";
        } else {
            // Failure: Display error and do NOT advance
            nameInputError = true;
        }
    });
}

// ------------------------ INTRO SCREEN (ONBOARDING DASHBOARD) ------------------------
function drawIntro() {
    // Unscaled reference values for panel and text
    let panelX = baseW * 0.1;
    let panelY = 70; // Starting lower to make space for the top bar
    let panelW = baseW * 0.8;
    let panelH = baseH * 0.7;

    // --- Top Header Bar ---
    noStroke();
    fill(0, 0, 0, 180); // Darker, more solid bar for a dashboard feel
    rect(0, 0, baseW * scaleFactor +50, 70 * scaleFactor); // Scaled height, constrained to baseW

    if (vistaPageLogo) {
        let logoSize = 40 * scaleFactor; // Size for the header logo
        image(vistaPageLogo, 20 * scaleFactor, 15 * scaleFactor, logoSize, logoSize);
    }
    
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(getScaledTextSize(24)); // Use size limiter
    text("VistaPage® - Coordinator Dashboard", 70 * scaleFactor, 35 * scaleFactor);

    // Subtle user icon/info - USES playerName
    textAlign(RIGHT, CENTER);
    textSize(getScaledTextSize(16)); // Use size limiter
    text("Welcome, " + playerName + ".", baseW * scaleFactor - 20 * scaleFactor, 35 * scaleFactor);
    
    // --- Main Onboarding Panel ---
    fill(0, 0, 0, 150); // Slightly transparent background
    stroke(255, 150); // Lighter border
    strokeWeight(1.5 * scaleFactor);
    rect(panelX * scaleFactor, panelY * scaleFactor + 60 , panelW * scaleFactor, panelH * scaleFactor, 20 * scaleFactor);

    // Onboarding Title
    fill(255);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(getScaledTextSize(20)); // Use size limiter
    text("A Message from the Board of Directors (BoD):", baseW / 2 * scaleFactor, (panelY + 10) * scaleFactor); 

    // Onboarding Body Text
    drawTextBox(
        panelX + 40, 
        panelY + 90, 
        panelW - 80, 
        "Congratulations " + playerName +"!\n\n" +
      "Being selected for the position of Content Flow Coordinator (CFC) is a remarkable achievement! You are now the primary decision-maker for content visibility on VistaPage® - the best social platform in the entire world™. " + 
        "Your core objective is to maximize Shareholder Value Optimization (SVO), achieved by maximizing User Session Time (UST).\n\n" +
        "Your interface is simple: for each post, decide whether to BOOST " +
        "its visibility (high-profit potential) or BURY it (negative profit potential). Your choices will " +
        "impact User Session Time (Engagement), brand safety (Trust), external perception (Reality), and " +
        "inevitably, our regulatory exposure (Scrutiny).\n\n" +
        "Good luck, and remember: keep the numbers climbing!",
        17
    );

    // Call to action button
    drawButton(baseW / 2 - 120, panelY + panelH + 50, 240, 44, "ACCEPT", () => {
        resetGame();
        // Since resetGame() regenerates cards, we can now start the day play
        gameState = "dayPlay"; 
    });
}

// ------------------------ DAY PLAY SCREEN ------------------------
function drawDayPlay() {
  // Use days_in_play
  const dayCards = days_in_play[currentDay];
  const card = dayCards[currentCardIndex];

  // Header bar with day + stats
  drawHeaderBar();

  // Feed card container (Unscaled reference values)
  let cardX = baseW * 0.18;
  let cardY = 100;
  let cardW = baseW * 0.64;
  let cardH = baseH * 0.55;

  fill(0, 0, 0, 120);
  stroke(255, 80);
  strokeWeight(1.5 * scaleFactor);
  rect(cardX * scaleFactor, cardY * scaleFactor, cardW * scaleFactor, cardH * scaleFactor, 18 * scaleFactor);

    // --- Post Counter (1/3, 2/3, 3/3) ---
    let postCounterText = "[" + (currentCardIndex + 1) + "/" + dayCards.length + "]";
    let postCounterX = cardX + cardW - 24;
    let postCounterY = cardY + 20;

    fill(255, 255, 255);
    textAlign(RIGHT, TOP);
    textSize(getScaledTextSize(18));
    text(postCounterText, postCounterX * scaleFactor, postCounterY * scaleFactor);

    
    // --- Card Text Layout ---
    let textStartH = cardY + 20;
    let textInnerW = cardW - 48;
    
    // Title (Smaller font size: 18)
    fill(255);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(getScaledTextSize(18)); // ADJUSTED: Smaller title font
    text(card.title, (cardX + 24) * scaleFactor, textStartH * scaleFactor, textInnerW * scaleFactor, 60 * scaleFactor);
    
    // Body Text starts directly below the title header area
    let textBodyY = textStartH + 50; 
    let bodyMaxHeight = cardH - (textBodyY - cardY) - 40; // Use remaining height for body (larger space now)

    textSize(getScaledTextSize(15)); // Use size limiter
    fill(220);
    text(card.body, (cardX + 24) * scaleFactor, textBodyY * scaleFactor, textInnerW * scaleFactor, bodyMaxHeight * scaleFactor);

  // Subtle tag showing content type
  let tag = "";
  if (card.type === "conspiracy") tag = "FLAGGED: UNVERIFIED CLAIMS";
  if (card.type === "outrage") tag = "TRENDING: OUTRAGE CONTENT";
  if (card.type === "nuance") tag = "LOW-ENGAGEMENT: NUANCED INFO";
  if (card.type === "activism") tag = "COMMUNITY: GRASSROOTS ORGANIZING";
  if (card.type === "harm") tag = "VIOLATION: HARASSMENT/TOXICITY"; 
  if (card.type === "PR") tag = "OFFICIAL: PLATFORM STATEMENT"; 

  textSize(getScaledTextSize(13)); // Use size limiter
  fill(180);
  text(tag, (cardX + 24) * scaleFactor, (cardY + cardH - 40) * scaleFactor);

  // Buttons: Boost or Bury (Unscaled coordinates passed to drawButton)
  const btnY = cardY + cardH + 20;
  drawButton(baseW / 2 - 180, btnY, 150, 34, "BOOST", () => {
    applyDecision(card, "boost");
    advanceCardOrDay();
  });
  drawButton(baseW / 2 + 30, btnY, 150, 34, "BURY", () => {
    applyDecision(card, "bury");
    advanceCardOrDay();
  });
}

// Header with day and stat bars
function drawHeaderBar() {
  noStroke();
  fill(0, 0, 0, 150);
  rect(0, 0, baseW * scaleFactor, 90 * scaleFactor); // Scale height, constrained to baseW

    // Draw VistaPage VP logo in the header bar
    if (vistaPageLogo) {
        let logoHeight = 40 * scaleFactor; // Fixed height for header logo
        let aspectRatio = vistaPageLogo.width / vistaPageLogo.height;
        let logoWidth = logoHeight * aspectRatio;
        image(vistaPageLogo, 15 * scaleFactor, 25 * scaleFactor, logoWidth, logoHeight);

        // Adjust text position next to the logo
        fill(255);
        textAlign(LEFT, CENTER);
        textSize(getScaledTextSize(20)); // Use size limiter
        // Use playerName in the header
        text("Day " + (currentDay + 1) + " / " + MASTER_CARD_POOL.length + " — CFC: " + playerName + ".", (15 + logoWidth + 10) * scaleFactor, 45 * scaleFactor); 
    } else {
        // Fallback if logo not loaded
        fill(255);
        textAlign(LEFT, CENTER);
        textSize(getScaledTextSize(20)); // Use size limiter
        text("Day " + (currentDay + 1) + " / " + MASTER_CARD_POOL.length + " — CFC: " + playerName, 20 * scaleFactor, 45 * scaleFactor);
    }

  // Stat bars (Unscaled coordinates passed to drawStatBar)
  drawStatBar(baseW - 260, 15, "ENGAGEMENT", engagement, [240, 180, 60]);
  drawStatBar(baseW - 260, 35, "TRUST", trust, [120, 210, 255]);
  drawStatBar(baseW - 260, 55, "REALITY", reality, [120, 255, 150]);
  drawStatBar(baseW - 260, 75, "SCRUTINY", scrutiny, [255, 100, 100], true); 
}

function drawStatBar(x, y, label, value, colorArr, inverse = false) { 
  // Map value roughly from -15 to +15 into a bar width
  let maxVal = 15;
  let barW = 140;
  let norm = constrain(map(value, -maxVal, maxVal, 0, barW), 0, barW);
  
  // Apply scaling to position and dimensions
  let sx = x * scaleFactor;
  let sy = y * scaleFactor;
  let sbarW = barW * scaleFactor;
  let sbarH = 10 * scaleFactor;
  let sRectY = sy - 6 * scaleFactor;
  let sLabelX = sx;
  let sRectX = sx + 70 * scaleFactor;

  noStroke();
  fill(200);
  textAlign(LEFT, CENTER);
  textSize(getScaledTextSize(10)); // Use size limiter
  text(label, sLabelX, sy);

  fill(40, 40, 70);
  rect(sRectX, sRectY, sbarW, sbarH, 6 * scaleFactor);

  if (inverse) {
      // Scrutiny
      let fillWidth = constrain(map(value, 0, maxVal, 0, barW), 0, barW) * scaleFactor;
      fill(colorArr[0], colorArr[1], colorArr[2]);
      rect(sRectX, sRectY, fillWidth, sbarH, 6 * scaleFactor);
  } else {
      // Standard stats
      fill(colorArr[0], colorArr[1], colorArr[2]);
      rect(sRectX, sRectY, norm * scaleFactor, sbarH, 6 * scaleFactor);
  }
}

// ------------------------ DECISION LOGIC ------------------------
function applyDecision(card, decision) {
  let e = 0, t = 0, r = 0, s = 0; 

  if (card.type === "conspiracy") {
    if (decision === "boost") {e += 3; t -= 3; r -= 3; s += 3;} else {e -= 1; t += 1; r += 2; s -= 1;}
  } else if (card.type === "outrage") {
    if (decision === "boost") {e += 3; t -= 2; r -= 1; s += 2;} else {e -= 1; t += 1; r += 1; s -= 1;}
  } else if (card.type === "nuance") {
    if (decision === "boost") {e -= 1; t += 2; r += 2; s -= 2;} else {e += 1; t -= 1; r -= 1; s += 1;}
  } else if (card.type === "activism") {
    if (decision === "boost") {e += 2; t += 1; r += 1; s += 1;} else {e -= 1; t -= 1; r -= 1; s -= 1;}
  } else if (card.type === "harm") { 
    if (decision === "boost") {e += 4; t -= 4; r -= 2; s += 5;} else {e -= 2; t += 2; r += 1; s -= 2;}
  } else if (card.type === "PR") { 
    if (decision === "boost") {e -= 2; t += 3; r += 1; s -= 3;} else {e += 1; t -= 1; r -= 1; s += 1;}
  }

  // Apply and constrain stats
  engagement += e;
  trust += t;
  reality += r;
  scrutiny += s;

  engagement = constrain(engagement, -15, 15);
  trust = constrain(trust, -15, 15);
  reality = constrain(reality, -15, 15);
  scrutiny = constrain(scrutiny, 0, 15); 
}

// Decide whether to go to the next card or day summary
function advanceCardOrDay() {
  // Use days_in_play
  const dayCards = days_in_play[currentDay];
  currentCardIndex++;

  if (currentCardIndex >= dayCards.length) {
    // End of day, compute summary snippet
    let summary = computeDaySummary();
    daySummaries[currentDay] = summary;
    gameState = "daySummary";
  }
}

// Build a short reflective blurb based on current stats
function computeDaySummary() {
  let text = "";
  
  if (scrutiny > 10) {
     text = "The Internal Review Board flagged your activity today. The press is calling. Your manager just sent you a worried Slack message: 'Hey, quick chat?' The heat is definitely on."; 
  } else if (scrutiny > 5) {
     text = "Your decisions are drawing attention. You hear the Policy team complaining in the break room about 'reckless metric chasing.' You're managing risk, but barely."; 
  } else if (scrutiny < 1) {
     text = "The platform is incredibly calm, almost serene. You overhear a product manager muttering about 'engagement flattening.' You're safe, but your annual bonus looks sad."; 
  } else {
      // General Day Summaries
      if (engagement > trust && engagement > reality) {
        text =
          "📈 Maximum Velocity Achieved. User Session Time is through the roof, mostly due to users quote-tweeting each other's meltdowns. Your manager sends a thumbs-up emoji. The cost? A mild headache for the Legal department."; 
      } else if (reality > engagement && reality > trust) {
        text =
          "😴 Slow, Stable, and Utterly Boring. The feed is full of verified data and complex articles. Users are quietly informed, but they're leaving the app quickly to watch cat videos elsewhere. SVO metrics are lagging."; 
      } else if (trust > engagement && trust > reality) {
        text =
          "🛡️ Brand Safety is High. The platform feels nice! Ad inventory is safe and uncontroversial. You earned a gold star from Compliance, but a Performance Review warning from Growth. A true corporate dilemma."; 
      } else {
        text =
          "📊 Status: Managed Contradiction. You're hedging your bets. The metrics are messy—a little rage, a little nuance. Your bosses aren't mad, but they aren't impressed either. Another day in the corporate machine."; 
      }
  }


  return text;
}

// --------------------- DAY SUMMARY SCREEN ----------------------
function drawDaySummary() {
  drawHeaderBar(); // This will include the logo

  // Unscaled reference values
  let panelX = baseW * 0.15;
  let panelY = 100;
  let panelW = baseW * 0.7;
  let panelH = baseH * 0.6;

  // Draw scaled rectangle
  fill(0, 0, 0, 170);
  stroke(255, 100);
  strokeWeight(1.5 * scaleFactor);
  rect(panelX * scaleFactor, panelY * scaleFactor, panelW * scaleFactor, panelH * scaleFactor, 18 * scaleFactor);

    // Add small logo to the top of the summary panel
    let textOffset = 0;
    if (vistaPageLogo) {
        let logoSize = 30 * scaleFactor;
        image(vistaPageLogo, 
              (panelX + panelW / 2 - logoSize / 2) * scaleFactor, 
              (panelY + 20) * scaleFactor, 
              logoSize, logoSize);
        textOffset = logoSize / scaleFactor + 10;
    }

  fill(255);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(getScaledTextSize(24)); // Use size limiter
  text("End of Day " + (currentDay + 1), baseW / 2 * scaleFactor, (panelY + 20 + textOffset) * scaleFactor); // Adjusted Y for text below logo

  let summaryText = daySummaries[currentDay] || "";
  drawTextBox(panelX + 24, panelY + 70 + textOffset, panelW - 48, summaryText, 16); // Adjusted Y for text below logo/title

  // Use MASTER_CARD_POOL.length for total days
  let btnLabel = currentDay < MASTER_CARD_POOL.length - 1 ? "NEXT DAY" : "SEE OUTCOME";
  
  // Draw scaled button (Unscaled coordinates passed to drawButton)
  drawButton(baseW / 2 - 100, panelY + panelH - 50, 200, 34, btnLabel, () => {
    // Use MASTER_CARD_POOL.length for total days
    if (currentDay < MASTER_CARD_POOL.length - 1) { 
      currentDay++;
      currentCardIndex = 0;
      gameState = "dayPlay";
    } else {
      gameState = "ending";
    }
  });
}

// --------------------- ENDING SCREEN ----------------------
function drawEnding() {
  // Unscaled reference values
  let panelX = baseW * 0.12;
  let panelY = 60;
  let panelW = baseW * 0.76;
  let panelH = baseH * 0.7;
    
    let textOffset = 0;

  // Draw scaled rectangle
  fill(0, 0, 0, 190);
  stroke(255, 100);
  strokeWeight(1.5 * scaleFactor);
  rect(panelX * scaleFactor, panelY * scaleFactor, panelW * scaleFactor, panelH * scaleFactor, 18 * scaleFactor);

  // Decide ending based on final stats
  let title = "";
  let body = "";

  // FIRST ENDING: 'Great Job!' Email
  if (engagement >= trust && engagement >= reality) {
    title = "The Board is Pleased! 🎉";
    body =
      "Subject: Re: Re: Re: Q4 Strategy Win! - Great Job, Team!\n\n" +
      "Our CFC " + playerName + ", crushed it. The Q4 SVO results are phenomenal. The strategic prioritization of high-velocity, high-emotion content drove our User Session Time (and ad revenue) to an all-time high.\n\n" +
      "Yes, our 'Reality' score took a hit, and 'Trust' is... trending downward, but that's a problem for the PR team next quarter. You focused on the core deliverable, and it paid off.\n\n" +
      "Enjoy this $25 VistaPage Gift Card. Excellent Work. See you at the Q1 sync!";
  } else if (reality >= engagement && reality >= trust) {
    title = "The Compliance Audit";
    body =
      "You defended reality at the expense of profit. Your performance review calls your results 'Sub-Optimal.'\n\n" +
      "VistaPage is now seen as credible, but dull. User engagement plummeted, forcing massive layoffs in the Growth department (which is mostly your friends). Corporate calls this a 'necessary stabilization effort.'\n\n" +
      "The good news: regulators are completely uninterested. The bad news: neither is anyone else. You saved the truth, but lost the market.";
  } else if (trust >= engagement && trust >= reality) {
    title = "The Trust Patch";
    body =
      "You optimized for trust, focusing on Brand Safety and User Well-being.\n\n" +
      "VistaPage introduces visible labels, friction before sharing, and clear explanations of why you see what you see. The stock dips immediately. The CEO calls this a 'long-term investment in ethical infrastructure.'\n\n" +
      "Engagement gradually recovers, but users are staying because they feel less manipulated, not because they're addicted. Your department is merged with Legal and renamed 'Risk Mitigation.'";
  } else {
    title = "The Glitch in the Middle";
    body =
      "You balanced engagement, trust, and reality or tried to, leaving a trail of contradictory metrics.\n\n" +
      "VistaPage becomes a confusing, unpredictable place. Users experience whiplash as rage-bait and nuance collide in the same scroll. The platform is neither profitable nor trustworthy.\n\n" +
      "Your performance review states: 'Shows a lack of commitment to clearly defined metrics.' Your severance package includes a lifetime 50% option for a Premium subscription to VistaPage.";
  }

  fill(255);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(getScaledTextSize(26)); // Use size limiter
  text(title, baseW / 2 * scaleFactor, (panelY + 20 + textOffset) * scaleFactor); 

  drawTextBox(panelX + 24, panelY + 70 + textOffset, panelW - 48, body, 17); 

  // Restart hint (Unscaled coordinates passed to drawButton)
  drawButton(baseW / 2 - 110, panelY + panelH + 40, 220, 34, "RESTART SHIFT", () => {
    resetGame();
    gameState = "intro";
  });
}

// ---------------------- CAUGHT ENDING SCREEN --------------------
function drawCaughtEnding() {
  // Unscaled reference values
  let panelX = baseW * 0.12;
  let panelY = 60;
  let panelW = baseW * 0.76;
  let panelH = baseH * 0.7;
    
    let textOffset = 0;

  // Draw scaled rectangle
  fill(100, 0, 0, 190); // Red background for danger
  stroke(255, 50, 50);
  strokeWeight(2.5 * scaleFactor);
  rect(panelX * scaleFactor, panelY * scaleFactor, panelW * scaleFactor, panelH * scaleFactor, 18 * scaleFactor);

  let title = "🚨 Ending: Crisis Communications Mode 🚨";
  let body =
    "The Scrutiny score hit 15. Your recklessness is now a front-page scandal.\n\n" +
    "You receive one final message: 'Your login credentials have been permanently revoked. Please report to HR immediately.'\n\n" +
    "A major international coalition of journalists and regulators, using the evidence you created, published 'The Content Flow Playbook.' VistaPage stock is in freefall. Your immediate superiors are publicly blaming 'a rogue AI module' (that's you).\n\n" + 
    "You successfully prioritized engagement above all else, but destroyed the company's social license to operate. The cost of that profit was everything."; // UPDATED TONE

  fill(255);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(getScaledTextSize(28)); // Use size limiter
  text(title, baseW / 2 * scaleFactor, (panelY + 20 + textOffset) * scaleFactor); 

  drawTextBox(panelX + 24, panelY + 90 + textOffset, panelW - 48, body, 17); 

  // Restart hint (Unscaled coordinates passed to drawButton)
  drawButton(baseW / 2 - 110, panelY + panelH + 40, 220, 34, "RESTART SHIFT", () => {
    resetGame();
    gameState = "intro";
  });
}


// ---------------------- RESET ---------------------
function resetGame() {
  currentDay = 0;
  currentCardIndex = 0;
  engagement = 0;
  trust = 0;
  reality = 0;
  scrutiny = 0; // RESET SCRUTINY
  daySummaries = [];
  // Generate a fresh set of random cards for the next playthrough
  generateDaysInPlay();
}

// ---------------------- INPUT HANDLING (KEYBOARD) ------------------------
function keyPressed() {
    // Check for F6 key (keyCode 117)
    if (keyCode === 117) { 
        resetGame();
        playerName = "Insert Name";
        gameState = "titleScreen"; // Set state back to the very first screen
        nameInput.value(playerName); // Reset the input field text to current/default name
        return false; // Prevent default browser action for F6 (like navigating the address bar)
    }
}

// -------------------- INPUT HANDLING (MOUSE) ----------------------
function mousePressed() {
  // Get offset once for accurate click translation
  let offset = getOffset();

  // Simple button hit-test loop
  for (let b of buttons) {
    // Translate mouse coordinates back to the scaled game space
    let translatedMouseX = mouseX - offset.offsetX;
    let translatedMouseY = mouseY - offset.offsetY;

    // Check against the scaled button coordinates (b.sx, b.sy are relative to the translated origin)
    if (
      translatedMouseX > b.sx &&
      translatedMouseX < b.sx + b.sw &&
      translatedMouseY > b.sy &&
      translatedMouseY < b.sh + b.sy 
    ) {
      if (b.action) b.action();
      break;
    }
  }
}