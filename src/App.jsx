import { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { FiChevronDown, FiChevronUp, FiHome, FiBook, FiPieChart, FiClock, FiCalendar, FiSettings, FiUser, FiEdit, FiMail, FiSave, FiCheck } from "react-icons/fi";
import emailjs from 'emailjs-com';
import { format, differenceInDays, differenceInMonths, addMonths, parseISO } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";


const SUBJECTS = {
  "Advanced Accounting": [
    "Introduction to Accounting Standards",
    "Framework for Preparation and Presentation of Financial Statements",
    "Applicability of Accounting Standards",
    "Presentation & Disclosures Based Accounting Standards",
    "AS 1 Disclosure of Accounting Policies",
    "AS 3 Cash Flow Statement",
    "AS 17 Segment Reporting",
    "AS 18 Related Party Disclosures",
    "AS 20 Earnings Per Share",
    "AS 24 Discontinuing Operations",
    "AS 25 Interim Financial Reporting",
    "AS 2 Valuation of Inventory",
    "AS 10 Property, Plant and Equipment",
    "AS 13 Accounting for Investments",
    "AS 16 Borrowing Costs",
    "AS 19 Leases",
    "AS 26 Intangible Assets",
    "AS 28 Impairment of Assets",
    "AS 15 Employee Benefits",
    "AS 29 Provisions, Contingent Liabilities and Contingent Assets",
    "AS 4 Contingencies and Events after Balance Sheet Date",
    "AS 5 Net Profit/Loss and Prior Period Items",
    "AS 11 Foreign Exchange Rates",
    "AS 22 Taxes on Income",
    "AS 7 Construction Contracts",
    "AS 9 Revenue Recognition",
    "AS 12 Government Grants",
    "AS 14 Amalgamations",
    "AS 21 Consolidated Financial Statements",
    "AS 23 Associates in Consolidated Financial Statements",
    "AS 27 Joint Ventures",
    "Financial Statements of Companies",
    "Buyback of Securities",
    "Amalgamation of Companies",
    "Internal Reconstruction",
    "Accounting for Branches"
  ],
  "Corporate and Other Law": [
    "Preliminary",
    "Incorporation of Company",
    "Prospectus and Allotment",
    "Share Capital and Debentures",
    "Acceptance of Deposits",
    "Registration of Charges",
    "Management & Administration",
    "Declaration and Dividend",
    "Accounts of Companies",
    "Audit and Auditors",
    "Companies Outside India",
    "LLP Act 2008",
    "General Clauses Act",
    "Interpretation of Statutes",
    "FEMA 1999"
  ],
  "Taxation": [
    "Basic Concepts",
    "Residence and Scope",
    "Salaries",
    "House Property",
    "Profits and Gains of Business",
    "Capital Gains",
    "Other Sources",
    "Income of Other Persons",
    "Aggregation and Set-Off",
    "Deductions",
    "Advance Tax and TDS",
    "Return Filing and Assessment",
    "Income Tax Computation",
    "GST Introduction",
    "Supply under GST",
    "Charge of GST",
    "Place of Supply",
    "Exemptions",
    "Time of Supply",
    "Value of Supply",
    "Input Tax Credit",
    "Registration",
    "Tax Invoice",
    "Accounts and Records",
    "E-Way Bill",
    "Payment of Tax",
    "TDS and TCS in GST",
    "Returns"
  ],
  "Cost and Management Accounting": [
    "Introduction to Cost and Management Accounting",
    "Material Cost",
    "Employee Cost",
    "Overheads",
    "Activity Based Costing",
    "Cost Sheet",
    "Cost Accounting Systems",
    "Unit & Batch Costing",
    "Job Costing",
    "Process & Operation Costing",
    "Joint Products and By Products",
    "Service Costing",
    "Standard Costing",
    "Marginal Costing",
    "Budgets and Budgetary Control"
  ],
  "Auditing and Ethics": [
    "Nature, Objective and Scope of Audit",
    "Audit Strategy and Planning",
    "Risk Assessment and Internal Control",
    "Audit Evidence",
    "Audit of Items of Financial Statements",
    "Audit Documentation",
    "Completion and Review",
    "Audit Report",
    "Audit of Different Entities",
    "Audit of Banks",
    "Ethics and Terms of Audit Engagements"
  ],
  "FM and SM": [
    "Scope and Objectives of Financial Management",
    "Types of Financing",
    "Ratio Analysis",
    "Cost of Capital",
    "Capital Structure",
    "Leverages",
    "Investment Decisions",
    "Dividend Decision",
    "Working Capital Management",
    "Cash Management",
    "Inventory Management",
    "Receivables Management",
    "Payables Management",
    "Financing Working Capital",
    "Strategic Management Intro",
    "External Environment Analysis",
    "Internal Environment Analysis",
    "Strategic Choices",
    "Strategy Implementation and Evaluation"
  ]
};

const SUBJECT_COLORS = {
  "Advanced Accounting": "bg-indigo-500",
  "Corporate and Other Law": "bg-green-500",
  "Taxation": "bg-yellow-500",
  "Cost and Management Accounting": "bg-purple-500",
  "Auditing and Ethics": "bg-red-500",
  "FM and SM": "bg-blue-500"
};

// Avatar options
const AVATAR_OPTIONS = [
  { id: 'avatar1', src: '👨‍🎓', label: 'Student' },
  { id: 'avatar2', src: '👩‍🎓', label: 'Student 2' },
  { id: 'avatar3', src: '👨‍💼', label: 'Professional' },
  { id: 'avatar4', src: '👩‍💼', label: 'Professional 2' },
  { id: 'avatar5', src: '🧑‍💻', label: 'Coder' },
  { id: 'avatar6', src: '👨‍🏫', label: 'Teacher' },
  { id: 'avatar7', src: '👩‍🏫', label: 'Teacher 2' },
  { id: 'avatar8', src: '🧙‍♂️', label: 'Wizard' },
];

export default function StudyTrackerApp() {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem("ca_tracker");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [activeView, setActiveView] = useState("home");
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);
  
  // User profile state
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("ca_user_profile");
      return stored ? JSON.parse(stored) : { 
        name: "CA Student", 
        avatar: "avatar1",
        goal: "Pass CA exams with distinction",
        email: ""
      };
    } catch {
      return { 
        name: "CA Student", 
        avatar: "avatar1",
        goal: "Pass CA exams with distinction",
        email: ""
      };
    }
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Email state
  const [emailStatus, setEmailStatus] = useState({ sending: false, message: "", error: false });
  const [backupEmail, setBackupEmail] = useState("");
  
  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  
  // Animation states
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [lastCompletedChapter, setLastCompletedChapter] = useState(null);
  const [animateNavigation, setAnimateNavigation] = useState(false);
  
  // Scheduler state
  const [scheduledTasks, setScheduledTasks] = useState(() => {
    try {
      const stored = localStorage.getItem("ca_scheduler");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [newTask, setNewTask] = useState({ title: "", date: "", time: "", duration: 60 });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ca_tracker", JSON.stringify(data));
  }, [data]);
  
  useEffect(() => {
    localStorage.setItem("ca_scheduler", JSON.stringify(scheduledTasks));
  }, [scheduledTasks]);
  
  useEffect(() => {
    localStorage.setItem("ca_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);
  
  // Window size effect for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Set initial size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);
  
  // Stopwatch functions
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);
  
  const startStopwatch = () => {
    setIsRunning(true);
  };
  
  const stopStopwatch = () => {
    setIsRunning(false);
  };
  
  const resetStopwatch = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };
  
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Scheduler functions
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  const addTask = () => {
    if (newTask.title && newTask.date && newTask.time) {
      setScheduledTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
      setNewTask({ title: "", date: "", time: "", duration: 60 });
    }
  };
  
  const removeTask = (id) => {
    setScheduledTasks(prev => prev.filter(task => task.id !== id));
  };
  
  // Reset functions
  const resetProgress = () => {
    setData({});
    setShowConfirmDialog(null);
  };
  
  const resetSchedules = () => {
    setScheduledTasks([]);
    setShowConfirmDialog(null);
  };
  
  const handleResetConfirm = (type) => {
    setShowConfirmDialog(type);
  };
  
  const cancelReset = () => {
    setShowConfirmDialog(null);
  };
  
  // Profile functions
  const updateProfile = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const toggleEditProfile = () => {
    setIsEditingProfile(prev => !prev);
  };
  
  const getAvatarSrc = (avatarId) => {
    const avatar = AVATAR_OPTIONS.find(a => a.id === avatarId);
    return avatar ? avatar.src : AVATAR_OPTIONS[0].src;
  };
  
  // Email functions
  const sendProgressByEmail = (email) => {
    if (!email) {
      setEmailStatus({
        sending: false,
        message: "Please provide an email address",
        error: true
      });
      return;
    }
    
    setEmailStatus({
      sending: true,
      message: "Sending email...",
      error: false
    });
    
    // Prepare data for email
    const progressData = {
      overallProgress: calculateOverallProgress(),
      subjectProgress: prepareSubjectData(),
      userProfile: userProfile,
      scheduledTasks: scheduledTasks
    };
    
    // Format data for email
    const formattedData = JSON.stringify(progressData, null, 2);
    
    // Prepare email parameters
    const templateParams = {
      to_email: email,
      user_name: userProfile.name,
      progress_data: formattedData,
      subject_summary: subjectData.map(subject => 
        `${subject.name}: ${subject.percent}% complete (${subject.value}/${subject.total})`
      ).join('\n')
    };
    
    // Send email using EmailJS
    // Note: You need to replace these IDs with your actual EmailJS service, template, and user IDs
    emailjs.send(
      'service_id', // Replace with your EmailJS service ID
      'template_id', // Replace with your EmailJS template ID
      templateParams,
      'user_id' // Replace with your EmailJS user ID
    )
    .then(() => {
      setEmailStatus({
        sending: false,
        message: "Progress data sent to your email!",
        error: false
      });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setEmailStatus({
          sending: false,
          message: "",
          error: false
        });
      }, 5000);
    })
    .catch(error => {
      console.error('Email error:', error);
      setEmailStatus({
        sending: false,
        message: "Failed to send email. Please try again later.",
        error: true
      });
    });
  };
  
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const emailToUse = backupEmail || userProfile.email;
    sendProgressByEmail(emailToUse);
  };
  
  const exportProgressData = () => {
    // Create a data object with all progress information
    const exportData = {
      timestamp: new Date().toISOString(),
      userProfile: userProfile,
      progress: data,
      scheduledTasks: scheduledTasks,
      overallProgress: calculateOverallProgress(),
      subjectProgress: prepareSubjectData()
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger click
    const a = document.createElement('a');
    a.href = url;
    a.download = `ca-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleChapter = (subject, chapter) => {
    const updated = { ...data };
    if (!updated[subject]) updated[subject] = {};
    
    // Check if we're completing a chapter (not unchecking)
    const isCompleting = !updated[subject][chapter];
    updated[subject][chapter] = !updated[subject][chapter];
    setData(updated);
    
    // If completing a chapter, show celebration effects
    if (isCompleting) {
      setLastCompletedChapter({ subject, chapter });
      setShowConfetti(true);
      
      // Show a toast or notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out';
      toast.textContent = `🎉 Completed: ${chapter}`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 500);
      }, 3000);
    }
  };

  const toggleSubject = (subject) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    let totalChapters = 0;
    let completedChapters = 0;
    
    Object.entries(SUBJECTS).forEach(([subject, chapters]) => {
      totalChapters += chapters.length;
      completedChapters += chapters.filter(c => data[subject]?.[c]).length;
    });
    
    return {
      percent: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
      completed: completedChapters,
      total: totalChapters
    };
  };

  // Prepare data for pie charts
  const prepareSubjectData = () => {
    return Object.entries(SUBJECTS).map(([subject, chapters]) => {
      const completed = chapters.filter(c => data[subject]?.[c]).length;
      const percent = chapters.length > 0 ? Math.round((completed / chapters.length) * 100) : 0;
      
      return {
        name: subject,
        value: completed,
        total: chapters.length,
        percent,
        color: SUBJECT_COLORS[subject].replace('bg-', '')
      };
    });
  };

  const overallProgress = calculateOverallProgress();
  const subjectData = prepareSubjectData();

  // Custom colors for pie chart
  const COLORS = ['indigo-500', 'green-500', 'yellow-500', 'purple-500', 'red-500', 'blue-500'].map(color => {
    if (color === 'indigo-500') return '#6366f1';
    if (color === 'green-500') return '#22c55e';
    if (color === 'yellow-500') return '#eab308';
    if (color === 'purple-500') return '#a855f7';
    if (color === 'red-500') return '#ef4444';
    if (color === 'blue-500') return '#3b82f6';
    return '#000000';
  });

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-900">
      {/* Navigation Sidebar */}
      <motion.div 
        className="w-16 md:w-64 bg-indigo-700 text-white flex flex-col"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.div 
          className="p-4 font-bold text-xl hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          CA Tracker
        </motion.div>
        <div className="flex-1 flex flex-col gap-2 p-2">
          <motion.button 
            onClick={() => setActiveView("home")} 
            className={`flex items-center gap-2 p-2 rounded-lg ${activeView === "home" ? "bg-indigo-800" : "hover:bg-indigo-600"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FiHome className="text-xl" />
            <span className="hidden md:inline">Home</span>
          </motion.button>
          <motion.button 
            onClick={() => setActiveView("subjects")} 
            className={`flex items-center gap-2 p-2 rounded-lg ${activeView === "subjects" ? "bg-indigo-800" : "hover:bg-indigo-600"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FiBook className="text-xl" />
            <span className="hidden md:inline">Subjects</span>
          </motion.button>
          <motion.button 
            onClick={() => setActiveView("dashboard")} 
            className={`flex items-center gap-2 p-2 rounded-lg ${activeView === "dashboard" ? "bg-indigo-800" : "hover:bg-indigo-600"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FiPieChart className="text-xl" />
            <span className="hidden md:inline">Dashboard</span>
          </motion.button>
          <motion.button 
            onClick={() => setActiveView("scheduler")} 
            className={`flex items-center gap-2 p-2 rounded-lg ${activeView === "scheduler" ? "bg-indigo-800" : "hover:bg-indigo-600"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FiCalendar className="text-xl" />
            <span className="hidden md:inline">Scheduler</span>
          </motion.button>
          <motion.button 
            onClick={() => setActiveView("settings")} 
            className={`flex items-center gap-2 p-2 rounded-lg ${activeView === "settings" ? "bg-indigo-800" : "hover:bg-indigo-600"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FiSettings className="text-xl" />
            <span className="hidden md:inline">Settings</span>
          </motion.button>
        </div>
        <motion.div 
          className="p-4 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="hidden md:inline">🌞</span>
          <Switch checked={theme === "dark"} onCheckedChange={(val) => setTheme(val ? "dark" : "light")} />
          <span className="hidden md:inline">🌙</span>
        </motion.div>
      </motion.div>

      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      
      {/* Main Content */}
      <motion.div 
        className="flex-1 overflow-auto p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-3xl font-bold text-indigo-700 mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          📘 CA Study Tracker
        </motion.h1>

        {activeView === "home" && (
          <div className="space-y-8">
            {/* Countdown Section */}
            <motion.div 
              className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <motion.h2 
                className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Exam Countdown
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-lg font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Today's Date</h3>
                  <motion.p 
                    className="text-3xl font-bold text-indigo-600 dark:text-indigo-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {format(new Date(), 'MMMM d, yyyy')}
                  </motion.p>
                  <motion.p 
                    className="text-zinc-600 dark:text-zinc-400 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Current time: {format(new Date(), 'h:mm a')}
                  </motion.p>
                </motion.div>
                
                <motion.div 
                  className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-lg font-semibold mb-2 text-red-700 dark:text-red-300">Exam Date</h3>
                  <motion.p 
                    className="text-3xl font-bold text-red-600 dark:text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    May 2026
                  </motion.p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Months Left:</p>
                      <motion.p 
                        className="text-xl font-bold text-red-600 dark:text-red-400"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
                      >
                        {differenceInMonths(new Date(2026, 4, 1), new Date())}
                      </motion.p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Deadline:</p>
                      <p className="text-xl font-bold text-red-600 dark:text-red-400">April 30, 2026</p>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Days until deadline:</p>
                    <motion.p 
                      className="text-xl font-bold text-red-600 dark:text-red-400"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
                    >
                      {differenceInDays(new Date(2026, 3, 30), new Date())}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Stopwatch Section */}
            <motion.div 
              className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <motion.h2 
                className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Study Stopwatch
              </motion.h2>
              <div className="flex flex-col items-center">
                <motion.div 
                  className="text-6xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-6"
                  animate={{ scale: isRunning ? [1, 1.03, 1] : 1 }}
                  transition={{ repeat: isRunning ? Infinity : 0, duration: 2 }}
                >
                  {formatTime(elapsedTime)}
                </motion.div>
                <div className="flex gap-4">
                  {!isRunning ? (
                    <motion.button 
                      onClick={startStopwatch}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring" }}
                    >
                      Start
                    </motion.button>
                  ) : (
                    <motion.button 
                      onClick={stopStopwatch}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring" }}
                    >
                      Stop
                    </motion.button>
                  )}
                  <motion.button 
                    onClick={resetStopwatch}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring" }}
                  >
                    Reset
                  </motion.button>
                </div>
                <motion.p 
                  className="mt-4 text-zinc-600 dark:text-zinc-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Track your study sessions to improve productivity and focus.
                </motion.p>
              </div>
            </motion.div>
          </div>
        )}

        {activeView === "subjects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(SUBJECTS).map(([subject, chapters]) => {
              const done = chapters.filter((c) => data[subject]?.[c]).length;
              const percent = Math.round((done / chapters.length) * 100);
              const isExpanded = expandedSubjects[subject];
              
              return (
                <motion.div 
                  key={subject} 
                  className="shadow-lg rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  layout
                >
                  <motion.div 
                    className={`p-4 text-white ${SUBJECT_COLORS[subject]} cursor-pointer`}
                    onClick={() => toggleSubject(subject)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </motion.div>
                        <h2 className="font-bold">{subject}</h2>
                      </div>
                      <motion.span 
                        className="bg-white text-black text-xs font-semibold px-2 py-1 rounded"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {done}/{chapters.length}
                      </motion.span>
                    </div>
                    <div className="w-full h-2 bg-white/30 rounded mt-2">
                      <motion.div 
                        className="h-2 bg-white rounded" 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        className="bg-white dark:bg-zinc-800 p-3 max-h-64 overflow-y-auto"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-1">
                          {chapters.map((chapter, index) => (
                            <motion.label 
                              key={chapter} 
                              className="flex items-center space-x-2 text-zinc-900 dark:text-white"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              whileHover={{ scale: 1.01, x: 3 }}
                            >
                              <input
                                type="checkbox"
                                className="accent-indigo-500"
                                checked={data[subject]?.[chapter] || false}
                                onChange={() => toggleChapter(subject, chapter)}
                              />
                              <span className="text-sm">{chapter}</span>
                              {data[subject]?.[chapter] && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-green-500 ml-auto"
                                >
                                  <FiCheck />
                                </motion.span>
                              )}
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeView === "dashboard" && (
          <div className="space-y-8">
            {/* Overall Progress */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Overall Progress</h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: overallProgress.completed }, { value: overallProgress.total - overallProgress.completed }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        <Cell fill="#6366f1" />
                        <Cell fill="#e5e7eb" />
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} chapters`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-4xl font-bold text-indigo-600">{overallProgress.percent}%</div>
                  <div className="text-zinc-600 dark:text-zinc-300">
                    {overallProgress.completed} of {overallProgress.total} chapters completed
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Progress */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Subject Progress</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${Math.round(percent)}%`}
                      >
                        {subjectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value}/${props.payload.total} (${props.payload.percent}%)`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {subjectData.map((subject, index) => (
                    <div key={subject.name} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-zinc-900 dark:text-white">{subject.name}</span>
                        <span className="text-zinc-600 dark:text-zinc-300">{subject.value}/{subject.total} ({subject.percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded">
                        <div 
                          className="h-2 rounded" 
                          style={{ 
                            width: `${subject.percent}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeView === "scheduler" && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Study Scheduler</h2>
              
              {/* Add New Task Form */}
              <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-indigo-700 dark:text-indigo-300">Schedule New Study Session</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Task Title</label>
                    <input 
                      type="text" 
                      name="title"
                      value={newTask.title}
                      onChange={handleTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                      placeholder="Study Session"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date</label>
                    <input 
                      type="date" 
                      name="date"
                      value={newTask.date}
                      onChange={handleTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Time</label>
                    <input 
                      type="time" 
                      name="time"
                      value={newTask.time}
                      onChange={handleTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Duration (minutes)</label>
                    <input 
                      type="number" 
                      name="duration"
                      value={newTask.duration}
                      onChange={handleTaskChange}
                      min="15"
                      step="15"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </div>
                <button 
                  onClick={addTask}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add to Schedule
                </button>
              </div>
              
              {/* Scheduled Tasks List */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">Your Schedule</h3>
                {scheduledTasks.length === 0 ? (
                  <p className="text-zinc-600 dark:text-zinc-400 italic">No study sessions scheduled yet.</p>
                ) : (
                  <div className="space-y-3">
                    {scheduledTasks
                      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
                      .map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-700 rounded-lg shadow">
                          <div>
                            <h4 className="font-medium text-zinc-900 dark:text-white">{task.title}</h4>
                            <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-300">
                              <FiCalendar className="mr-1" />
                              <span>{format(new Date(task.date), 'MMM d, yyyy')}</span>
                              <FiClock className="ml-3 mr-1" />
                              <span>{task.time} ({task.duration} min)</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeTask(task.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeView === "settings" && (
          <div className="space-y-8">
            {/* User Profile Section */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">User Profile</h2>
                <button 
                  onClick={toggleEditProfile}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <FiEdit className="text-lg" />
                  <span>{isEditingProfile ? "Save" : "Edit"}</span>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Display/Selection */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-6xl mb-2">
                    {getAvatarSrc(userProfile.avatar)}
                  </div>
                  {isEditingProfile && (
                    <div className="mt-2 grid grid-cols-4 gap-2 max-w-xs">
                      {AVATAR_OPTIONS.map(avatar => (
                        <button
                          key={avatar.id}
                          onClick={() => updateProfile('avatar', avatar.id)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${userProfile.avatar === avatar.id ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-gray-100 dark:bg-zinc-700'}`}
                          title={avatar.label}
                        >
                          {avatar.src}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* User Details */}
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={userProfile.name}
                          onChange={(e) => updateProfile('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-xl font-semibold text-zinc-900 dark:text-white">{userProfile.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Study Goal</label>
                      {isEditingProfile ? (
                        <textarea
                          value={userProfile.goal}
                          onChange={(e) => updateProfile('goal', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-zinc-700 dark:text-zinc-300">{userProfile.goal}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => updateProfile('email', e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-zinc-700 dark:text-zinc-300">
                          {userProfile.email ? userProfile.email : "No email set"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Data Backup & Export Section */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Backup & Export</h2>
              
              <div className="space-y-6">
                {/* Email Backup */}
                <div className="p-4 border border-indigo-200 dark:border-indigo-900 rounded-lg bg-indigo-50 dark:bg-indigo-900/10">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                    <FiMail className="text-xl" />
                    Email Progress Data
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                    Send your current progress data to your email for backup.
                  </p>
                  
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={backupEmail}
                        onChange={(e) => setBackupEmail(e.target.value)}
                        placeholder={userProfile.email || "your@email.com"}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white"
                      />
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Leave blank to use the email from your profile.
                      </p>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={emailStatus.sending}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {emailStatus.sending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiMail className="text-lg" />
                          Send Progress Data
                        </>
                      )}
                    </button>
                    
                    {emailStatus.message && (
                      <p className={`mt-2 ${emailStatus.error ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {emailStatus.message}
                      </p>
                    )}
                  </form>
                </div>
                
                {/* JSON Export */}
                <div className="p-4 border border-indigo-200 dark:border-indigo-900 rounded-lg bg-indigo-50 dark:bg-indigo-900/10">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                    <FiSave className="text-xl" />
                    Export as JSON File
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                    Download your progress data as a JSON file for local backup.
                  </p>
                  
                  <button
                    onClick={exportProgressData}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
                  >
                    <FiSave className="text-lg" />
                    Download Backup File
                  </button>
                </div>
              </div>
            </div>
            
            {/* Reset Options Section */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Reset Options</h2>
              
              <div className="space-y-6">
                <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/10">
                  <h3 className="text-lg font-semibold mb-2 text-red-700 dark:text-red-400">Reset Progress</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    This will reset all your study progress across all subjects. This action cannot be undone.
                  </p>
                  <button 
                    onClick={() => handleResetConfirm('progress')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reset All Progress
                  </button>
                </div>
                
                <div className="p-4 border border-orange-200 dark:border-orange-900 rounded-lg bg-orange-50 dark:bg-orange-900/10">
                  <h3 className="text-lg font-semibold mb-2 text-orange-700 dark:text-orange-400">Reset Schedules</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    This will delete all your scheduled study sessions. This action cannot be undone.
                  </p>
                  <button 
                    onClick={() => handleResetConfirm('schedules')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Reset All Schedules
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
                Confirm Reset
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                {showConfirmDialog === 'progress' 
                  ? 'Are you sure you want to reset all your study progress? This action cannot be undone.'
                  : 'Are you sure you want to delete all your scheduled study sessions? This action cannot be undone.'}
              </p>
              <div className="flex justify-end gap-4">
                <button 
                  onClick={cancelReset}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={showConfirmDialog === 'progress' ? resetProgress : resetSchedules}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}