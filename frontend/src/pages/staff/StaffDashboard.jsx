import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  FiAlertTriangle,
  FiAward,
  FiBook,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFileText,
  FiFilter,
  FiInfo,
  FiPaperclip,
  FiSearch,
  FiSend,
  FiTrendingDown,
  FiTrendingUp,
  FiUpload,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import "./StaffDashboard.css";

const SUBJECTS = [
  { key: "anatomy", label: "Anatomy", short: "Anatomy" },
  { key: "physiology", label: "Physiology", short: "Physiology" },
  { key: "biochemistry", label: "Biochemistry", short: "Biochem" },
  { key: "pathology", label: "Pathology", short: "Pathology" },
  { key: "pharmacology", label: "Pharmacology", short: "Pharma" },
  { key: "microbiology", label: "Microbiology", short: "Micro" },
  { key: "generalMedicine", label: "General Medicine", short: "Gen Med" },
  { key: "generalSurgery", label: "General Surgery", short: "Gen Surg" },
  { key: "obg", label: "OBG", short: "OBG" },
];

const EXAMS = [
  "Mid Semester Exam 1 - Jan 2026",
  "Mid Semester Exam 2 - Mar 2026",
  "Final Semester Exam - Jun 2026",
];

const STUDENTS = [
  { roll: "2023MBBS019", name: "Riya Chatterjee", anatomy: 94.5, physiology: 92.3, biochemistry: 89.7, pathology: 95.8, pharmacology: 84.9, microbiology: 90.2, generalMedicine: 93.5, generalSurgery: 88.4, obg: 90.6 },
  { roll: "2023MBBS007", name: "Meera Iyer", anatomy: 93.2, physiology: 90.6, biochemistry: 87.9, pathology: 94.5, pharmacology: 82.7, microbiology: 88.9, generalMedicine: 91.2, generalSurgery: 86.8, obg: 88.5 },
  { roll: "2023MBBS013", name: "Ishita Joshi", anatomy: 90.8, physiology: 88.4, biochemistry: 85.6, pathology: 92.7, pharmacology: 80.3, microbiology: 86.7, generalMedicine: 89.8, generalSurgery: 85.2, obg: 86.5 },
  { roll: "2023MBBS002", name: "Rahul Verma", anatomy: 91.2, physiology: 87.5, biochemistry: 84.3, pathology: 92.1, pharmacology: 78.9, microbiology: 85.1, generalMedicine: 88.4, generalSurgery: 83.5, obg: 85.7 },
  { roll: "2023MBBS017", name: "Tanvi Malhotra", anatomy: 89.4, physiology: 86.7, biochemistry: 83.2, pathology: 91.1, pharmacology: 78.6, microbiology: 84.6, generalMedicine: 87.9, generalSurgery: 82.3, obg: 84.9 },
  { roll: "2023MBBS004", name: "Arjun Patel", anatomy: 88.5, physiology: 85.2, biochemistry: 81.7, pathology: 90.3, pharmacology: 76.8, microbiology: 83.7, generalMedicine: 86.1, generalSurgery: 81.2, obg: 83.4 },
  { roll: "2023MBBS011", name: "Pooja Desai", anatomy: 87.9, physiology: 84.6, biochemistry: 80.5, pathology: 89.2, pharmacology: 75.8, microbiology: 82.4, generalMedicine: 85.3, generalSurgery: 80.6, obg: 82.9 },
  { roll: "2023MBBS006", name: "Vikram Singh", anatomy: 85.7, physiology: 81.9, biochemistry: 77.6, pathology: 87.4, pharmacology: 74.2, microbiology: 80.1, generalMedicine: 83.5, generalSurgery: 78.4, obg: 80.7 },
  { roll: "2023MBBS015", name: "Kavya Pillai", anatomy: 83.6, physiology: 80.2, biochemistry: 76.9, pathology: 85.7, pharmacology: 72.8, microbiology: 78.9, generalMedicine: 81.7, generalSurgery: 77.1, obg: 79.3 },
  { roll: "2023MBBS020", name: "Akash Sinha", anatomy: 80.2, physiology: 77.8, biochemistry: 74.5, pathology: 82.9, pharmacology: 71.3, microbiology: 75.6, generalMedicine: 78.8, generalSurgery: 73.9, obg: 76.6 },
  { roll: "2023MBBS001", name: "Priya Sharma", anatomy: 79.1, physiology: 76.3, biochemistry: 72.8, pathology: 83.4, pharmacology: 70.6, microbiology: 74.9, generalMedicine: 79.6, generalSurgery: 72.5, obg: 74.3 },
  { roll: "2023MBBS008", name: "Karthik Rao", anatomy: 78.4, physiology: 75.8, biochemistry: 71.6, pathology: 82.2, pharmacology: 69.4, microbiology: 73.5, generalMedicine: 78.2, generalSurgery: 71.8, obg: 73.1 },
  { roll: "2023MBBS003", name: "Aman Gupta", anatomy: 76.9, physiology: 73.5, biochemistry: 69.8, pathology: 80.7, pharmacology: 67.2, microbiology: 71.9, generalMedicine: 76.7, generalSurgery: 69.4, obg: 71.2 },
  { roll: "2023MBBS014", name: "Neha Reddy", anatomy: 75.6, physiology: 72.1, biochemistry: 67.5, pathology: 79.2, pharmacology: 65.9, microbiology: 70.4, generalMedicine: 75.1, generalSurgery: 68.2, obg: 69.8 },
  { roll: "2023MBBS012", name: "Rohit Nair", anatomy: 72.4, physiology: 70.2, biochemistry: 64.8, pathology: 76.1, pharmacology: 62.7, microbiology: 68.3, generalMedicine: 72.6, generalSurgery: 65.4, obg: 67.3 },
  { roll: "2023MBBS016", name: "Nikhil Bhat", anatomy: 66.8, physiology: 63.9, biochemistry: 59.8, pathology: 69.5, pharmacology: 56.7, microbiology: 60.4, generalMedicine: 65.1, generalSurgery: 58.3, obg: 61.4 },
  { roll: "2023MBBS005", name: "Sneha Gupta", anatomy: 68.2, physiology: 65.1, biochemistry: 60.7, pathology: 71.2, pharmacology: 58.4, microbiology: 62.1, generalMedicine: 66.8, generalSurgery: 59.2, obg: 62.0 },
  { roll: "2023MBBS018", name: "Sanjay Menon", anatomy: 62.4, physiology: 58.7, biochemistry: 54.2, pathology: 65.8, pharmacology: 52.4, microbiology: 56.5, generalMedicine: 60.6, generalSurgery: 53.9, obg: 55.7 },
  { roll: "2023MBBS009", name: "Fatima Ali", anatomy: 58.3, physiology: 54.1, biochemistry: 50.6, pathology: 62.4, pharmacology: 48.9, microbiology: 52.8, generalMedicine: 57.2, generalSurgery: 49.5, obg: 51.4 },
  { roll: "2023MBBS010", name: "Aditya Kumar", anatomy: 45.2, physiology: 51.8, biochemistry: 48.3, pathology: 54.6, pharmacology: 46.9, microbiology: 49.7, generalMedicine: 52.4, generalSurgery: 47.8, obg: 44.5 },
];

const INITIAL_QUERIES = [
  { id: 1, studentName: "Priya Sharma", roll: "2023MBBS001", subject: "Pharmacology", date: "Feb 10, 2026", question: "Could you please clarify the mechanism of action for beta blockers?", status: "answered", response: "Beta blockers work by blocking the effects of epinephrine on beta-adrenergic receptors. This reduces heart rate, blood pressure, and cardiac output. Please review Chapter 12 for detailed mechanisms." },
  { id: 2, studentName: "Priya Sharma", roll: "2023MBBS001", subject: "OBG", date: "Feb 12, 2026", question: "I need help understanding the stages of labor and their management.", status: "pending", response: "" },
  { id: 3, studentName: "Karthik Rao", roll: "2023MBBS008", subject: "General Medicine", date: "Feb 9, 2026", question: "What are the differential diagnoses for chest pain in young adults?", status: "answered", response: "Common causes include: 1) Musculoskeletal pain, 2) Gastroesophageal reflux, 3) Anxiety/panic attacks, 4) Costochondritis. However, always rule out cardiac causes first, even in young patients." },
  { id: 4, studentName: "Aman Gupta", roll: "2023MBBS003", subject: "Biochemistry", date: "Feb 11, 2026", question: "Can you explain glycolysis regulation with key enzymes?", status: "pending", response: "" },
  { id: 5, studentName: "Vikram Singh", roll: "2023MBBS006", subject: "Pathology", date: "Feb 13, 2026", question: "How should I approach short notes in systemic pathology?", status: "pending", response: "" },
];

const INITIAL_MARK_ENTRIES = [
  { id: 1, roll: "2023MBBS001", subject: "Anatomy", marks: 79.1 },
  { id: 2, roll: "2023MBBS008", subject: "General Medicine", marks: 78.2 },
  { id: 3, roll: "2023MBBS010", subject: "OBG", marks: 44.5 },
];

const TABS = [
  { id: "students", label: "Students" },
  { id: "subjects", label: "Subjects" },
  { id: "rankings", label: "Rankings" },
  { id: "weak", label: "Weak Students" },
  { id: "analytics", label: "Analytics" },
  { id: "queries", label: "Queries" },
  { id: "marks", label: "Marks Entry" },
];

const PAGE_SIZE = 10;

const scoreClass = (score) => {
  if (score >= 85) return "score-green";
  if (score >= 75) return "score-blue";
  if (score >= 60) return "score-yellow";
  if (score >= 50) return "score-orange";
  return "score-red";
};

const rankBadgeClass = (rank) => {
  if (rank === 1) return "rank-gold";
  if (rank === 2) return "rank-silver";
  if (rank === 3) return "rank-bronze";
  return "rank-plain";
};

function StaffDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const [selectedExam, setSelectedExam] = useState(EXAMS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("rank");
  const [sortDirection, setSortDirection] = useState("asc");
  const [api75Only, setApi75Only] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryFilter, setQueryFilter] = useState("all");
  const [queries, setQueries] = useState(INITIAL_QUERIES);
  const [queryReplies, setQueryReplies] = useState({});
  const [marksMode, setMarksMode] = useState("manual");
  const [markForm, setMarkForm] = useState({ subject: "", roll: "", marks: "" });
  const [recentEntries, setRecentEntries] = useState(INITIAL_MARK_ENTRIES);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const [toast, setToast] = useState("");

  const studentsWithApi = useMemo(() => {
    const computed = STUDENTS.map((student) => {
      const total = SUBJECTS.reduce((sum, subject) => sum + student[subject.key], 0);
      return { ...student, api: Number((total / SUBJECTS.length).toFixed(1)) };
    });

    const ranked = [...computed].sort((a, b) => b.api - a.api);
    const rankMap = new Map(ranked.map((item, index) => [item.roll, index + 1]));
    return computed.map((student) => ({ ...student, rank: rankMap.get(student.roll) }));
  }, []);

  const overviewStats = useMemo(() => {
    const apis = studentsWithApi.map((s) => s.api);
    const totalStudents = studentsWithApi.length;
    const classAverage = Number((apis.reduce((sum, api) => sum + api, 0) / totalStudents).toFixed(1));
    const highest = Math.max(...apis);
    const lowest = Math.min(...apis);
    const passCount = studentsWithApi.filter((student) => student.api >= 50).length;
    const passPercentage = Number(((passCount / totalStudents) * 100).toFixed(1));
    return { totalStudents, classAverage, highest, lowest, passPercentage };
  }, [studentsWithApi]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const base = studentsWithApi.filter((student) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.roll.toLowerCase().includes(normalizedSearch);
      return matchesSearch && (api75Only ? student.api > 75 : true);
    });

    return [...base].sort((a, b) => {
      const colA = a[sortColumn];
      const colB = b[sortColumn];
      if (typeof colA === "string" || typeof colB === "string") {
        return sortDirection === "asc"
          ? String(colA).localeCompare(String(colB))
          : String(colB).localeCompare(String(colA));
      }
      return sortDirection === "asc" ? colA - colB : colB - colA;
    });
  }, [studentsWithApi, searchTerm, api75Only, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const subjectCards = useMemo(
    () =>
      SUBJECTS.map((subject) => {
        const scores = studentsWithApi.map((student) => student[subject.key]);
        const average = Number((scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1));
        const highest = Number(Math.max(...scores).toFixed(1));
        const lowest = Number(Math.min(...scores).toFixed(1));
        const failed = scores.filter((score) => score < 50).length;
        const passPercentage = Number((((scores.length - failed) / scores.length) * 100).toFixed(1));
        return { ...subject, average, highest, lowest, failed, passPercentage };
      }),
    [studentsWithApi]
  );

  const topTen = useMemo(() => [...studentsWithApi].sort((a, b) => b.api - a.api).slice(0, 10), [studentsWithApi]);

  const weakSegments = useMemo(() => {
    const withFailures = studentsWithApi.map((student) => ({
      ...student,
      failedSubjects: SUBJECTS.filter((subject) => student[subject.key] < 50).map((subject) => subject.label),
    }));
    return {
      critical: withFailures.filter((student) => student.api < 50),
      multiple: withFailures.filter((student) => student.failedSubjects.length >= 2),
      borderline: withFailures.filter((student) => student.api >= 50 && student.api <= 60),
    };
  }, [studentsWithApi]);

  const analytics = useMemo(() => {
    const barData = subjectCards.map((subject) => ({ name: subject.short, value: subject.average }));
    const gradeCounts = studentsWithApi.reduce(
      (acc, student) => {
        if (student.api >= 85) acc.A += 1;
        else if (student.api >= 75) acc.B += 1;
        else if (student.api >= 60) acc.C += 1;
        else if (student.api >= 50) acc.D += 1;
        else acc.F += 1;
        return acc;
      },
      { A: 0, B: 0, C: 0, D: 0, F: 0 }
    );

    const pieData = [
      { name: `A (>=85): ${gradeCounts.A}`, value: gradeCounts.A, color: "#1fb981" },
      { name: `B (75-84): ${gradeCounts.B}`, value: gradeCounts.B, color: "#417fe0" },
      { name: `C (60-74): ${gradeCounts.C}`, value: gradeCounts.C, color: "#ecb700" },
      { name: `D (50-59): ${gradeCounts.D}`, value: gradeCounts.D, color: "#ff7b12" },
      { name: `F (<50): ${gradeCounts.F}`, value: gradeCounts.F, color: "#f44747" },
    ];

    const ranges = [
      { range: "90-100", min: 90, max: 100 },
      { range: "80-89", min: 80, max: 89.99 },
      { range: "70-79", min: 70, max: 79.99 },
      { range: "60-69", min: 60, max: 69.99 },
      { range: "50-59", min: 50, max: 59.99 },
      { range: "<50", min: -Infinity, max: 49.99 },
    ];
    const lineData = ranges.map((bucket) => ({
      range: bucket.range,
      students: studentsWithApi.filter((student) => student.api >= bucket.min && student.api <= bucket.max).length,
    }));
    return { barData, pieData, lineData };
  }, [studentsWithApi, subjectCards]);

  const queryStats = useMemo(() => {
    const pending = queries.filter((query) => query.status === "pending").length;
    const answered = queries.length - pending;
    return { total: queries.length, pending, answered };
  }, [queries]);

  const visibleQueries = useMemo(() => {
    if (queryFilter === "all") return queries;
    return queries.filter((query) => query.status === queryFilter);
  }, [queries, queryFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, api75Only]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const setSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortColumn(column);
    setSortDirection(column === "rank" ? "asc" : "desc");
  };

  const handleReplySubmit = (queryId) => {
    const text = (queryReplies[queryId] ?? "").trim();
    if (!text) {
      setToast("Please type a response before sending");
      return;
    }
    setQueries((prev) => prev.map((query) => (query.id === queryId ? { ...query, status: "answered", response: text } : query)));
    setQueryReplies((prev) => ({ ...prev, [queryId]: "" }));
    setToast("Response sent successfully");
  };

  const handleSaveMark = () => {
    const subject = markForm.subject.trim();
    const roll = markForm.roll.trim().toUpperCase();
    const marks = Number(markForm.marks);
    if (!subject || !roll || Number.isNaN(marks)) {
      setToast("Enter subject, roll number and marks");
      return;
    }
    if (marks < 0 || marks > 100) {
      setToast("Marks must be between 0 and 100");
      return;
    }
    if (editingEntryId) {
      setRecentEntries((prev) => prev.map((entry) => (entry.id === editingEntryId ? { ...entry, subject, roll, marks } : entry)));
      setEditingEntryId(null);
      setToast("Entry updated");
    } else {
      setRecentEntries((prev) => [{ id: Date.now(), subject, roll, marks: Number(marks.toFixed(1)) }, ...prev]);
      setToast("Marks saved");
    }
    setMarkForm({ subject: "", roll: "", marks: "" });
  };

  const handleEditEntry = (entry) => {
    setEditingEntryId(entry.id);
    setMarkForm({ subject: entry.subject, roll: entry.roll, marks: String(entry.marks) });
    setMarksMode("manual");
  };

  const handleDeleteEntry = (entryId) => {
    setRecentEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    if (editingEntryId === entryId) {
      setEditingEntryId(null);
      setMarkForm({ subject: "", roll: "", marks: "" });
    }
    setToast("Entry deleted");
  };

  const handleChooseUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    setToast(`Selected file: ${file.name}`);
  };

  const handleDownloadTemplate = () => {
    const content = "Roll Number,Student Name,Anatomy,Physiology,Biochemistry,Pathology,Pharmacology,Microbiology,General Medicine,General Surgery,OBG";
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "marks-template.csv";
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  const quickReport = (
    <section className="sd-quick-report">
      <h3>Quick Report Generation</h3>
      <div className="sd-quick-grid">
        <button type="button"><FiFileText /> Individual Student Report</button>
        <button type="button"><FiFileText /> Subject Performance Report</button>
        <button type="button"><FiFileText /> Class Summary Report</button>
        <button type="button"><FiFileText /> Semester Result Report</button>
      </div>
    </section>
  );

  return (
    <div className="sd-root">
      <header className="sd-header">
        <div className="sd-header-inner">
          <div className="sd-header-left">
            <div className="sd-logo"><FiBook /></div>
            <div>
              <h1>Staff Dashboard - Academic Performance Normalizer</h1>
              <p><FiUser /> Dr. Rajesh Kumar Faculty ID: FAC2023145</p>
            </div>
          </div>
          <div className="sd-header-actions">
            <button type="button"><FiFileText /> Generate Report</button>
            <button type="button"><FiDownload /> Export</button>
            <button type="button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="sd-container">
        <section className="sd-exam-card">
          <div className="sd-exam-left">
            <label htmlFor="examSelect">Select Exam:</label>
            <div className="sd-select-wrap">
              <select id="examSelect" value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
                {EXAMS.map((exam) => <option key={exam} value={exam}>{exam}</option>)}
              </select>
              <FiChevronDown />
            </div>
          </div>
          <div className="sd-exam-right">
            <span className="sd-pill">Spring 2026</span>
            <span>Jan 2026</span>
          </div>
        </section>

        <section className="sd-overview-grid">
          <article className="sd-stat-card"><div><h4>Total Students</h4><strong className="score-blue">{overviewStats.totalStudents}</strong></div><span className="sd-stat-icon icon-blue"><FiUsers /></span></article>
          <article className="sd-stat-card"><div><h4>Total Subjects</h4><strong className="score-purple">9</strong></div><span className="sd-stat-icon icon-purple"><FiBook /></span></article>
          <article className="sd-stat-card"><div><h4>Class Average</h4><strong className="score-green">{overviewStats.classAverage}%</strong></div><span className="sd-stat-icon icon-green"><FiTrendingUp /></span></article>
          <article className="sd-stat-card"><div><h4>Highest Score</h4><strong className="score-orange">{overviewStats.highest}%</strong></div><span className="sd-stat-icon icon-yellow"><FiAward /></span></article>
          <article className="sd-stat-card"><div><h4>Lowest Score</h4><strong className="score-red">{overviewStats.lowest}%</strong></div><span className="sd-stat-icon icon-red"><FiTrendingDown /></span></article>
          <article className="sd-stat-card"><div><h4>Pass Percentage</h4><strong className="score-teal">{overviewStats.passPercentage}%</strong></div><span className="sd-stat-icon icon-teal"><FiCheckCircle /></span></article>
        </section>

        <nav className="sd-tabbar" aria-label="Staff Dashboard Tabs">
          {TABS.map((tab) => (
            <button key={tab.id} type="button" className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "students" && (
          <section className="sd-panel">
            <h2>Student Performance Table</h2>
            <div className="sd-table-controls">
              <label className="sd-search"><FiSearch /><input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by name or roll number..." /></label>
              <div className="sd-select-wrap sort-select">
                <select value={sortColumn} onChange={(e) => setSort(e.target.value)}>
                  <option value="rank">Rank</option><option value="api">API Score</option><option value="name">Name</option><option value="anatomy">Anatomy</option><option value="physiology">Physiology</option><option value="biochemistry">Biochemistry</option><option value="pathology">Pathology</option><option value="pharmacology">Pharmacology</option>
                </select>
                <FiChevronDown />
              </div>
              <button type="button" className={`sd-filter-button ${api75Only ? "active" : ""}`} onClick={() => setApi75Only((prev) => !prev)}><FiFilter /> API &gt; 75</button>
            </div>

            <div className="sd-table-wrap">
              <table className="sd-students-table">
                <thead>
                  <tr>
                    <th onClick={() => setSort("rank")}>Rank <span className="sd-sort-icon" aria-hidden="true">&#8597;</span></th><th onClick={() => setSort("roll")}>Roll No <span className="sd-sort-icon" aria-hidden="true">&#8597;</span></th><th onClick={() => setSort("name")}>Name <span className="sd-sort-icon" aria-hidden="true">&#8597;</span></th><th onClick={() => setSort("anatomy")}>Anatomy <span className="sd-sort-icon" aria-hidden="true">&#8597;</span></th><th onClick={() => setSort("physiology")}>Physiology <span className="sd-sort-icon" aria-hidden="true">&#8597;</span></th><th onClick={() => setSort("biochemistry")}>Biochem <span className="sd-sort-icon" aria-hidden="true">&#8597;</span></th><th onClick={() => setSort("pathology")}>Pathology <span className="sd-sort-icon" aria-hidden="true">&#8597;</span></th><th onClick={() => setSort("pharmacology")}>Pharma <span className="sd-sort-icon" aria-hidden="true">&#8597;</span></th><th onClick={() => setSort("api")}>API <span className="sd-sort-icon" aria-hidden="true">&#8597;</span></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => (
                    <tr key={student.roll}>
                      <td><span className={`sd-rank-badge ${rankBadgeClass(student.rank)}`}>{student.rank}</span></td>
                      <td>{student.roll}</td><td>{student.name}</td>
                      <td className={scoreClass(student.anatomy)}>{student.anatomy.toFixed(1)}</td>
                      <td className={scoreClass(student.physiology)}>{student.physiology.toFixed(1)}</td>
                      <td className={scoreClass(student.biochemistry)}>{student.biochemistry.toFixed(1)}</td>
                      <td className={scoreClass(student.pathology)}>{student.pathology.toFixed(1)}</td>
                      <td className={scoreClass(student.pharmacology)}>{student.pharmacology.toFixed(1)}</td>
                      <td className={scoreClass(student.api)}>{student.api.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sd-table-footer">
              <span>Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)} of {filteredStudents.length} students</span>
              <div className="sd-pagination">
                <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><FiChevronLeft /> Previous</button>
                <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next <FiChevronRight /></button>
              </div>
            </div>

            {quickReport}
          </section>
        )}

        {activeTab === "subjects" && (
          <section className="sd-panel">
            <h2>Subject-wise Analysis</h2>
            <div className="sd-subject-list">
              {subjectCards.map((subject) => (
                <article className="sd-subject-card" key={subject.key}>
                  <div className="sd-subject-head"><h3>{subject.label}</h3><span className="sd-pass-pill">{subject.passPercentage.toFixed(1)}% Pass</span></div>
                  <div className="sd-subject-stats">
                    <div><label>Average</label><strong className={scoreClass(subject.average)}>{subject.average.toFixed(1)}</strong></div>
                    <div><label>Highest</label><strong className="score-green">{subject.highest.toFixed(1)}</strong></div>
                    <div><label>Lowest</label><strong className="score-red">{subject.lowest.toFixed(1)}</strong></div>
                    <div><label>Failed</label><strong className="score-red">{subject.failed} {subject.failed === 1 ? "student" : "students"}</strong></div>
                    <div><label>Pass %</label><div className="sd-progress"><span style={{ width: `${subject.passPercentage}%` }} /></div></div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "rankings" && (
          <section className="sd-panel">
            <div className="sd-panel-head">
              <h2>Merit List - Top 10 Students</h2>
              <div className="sd-icon-buttons"><button type="button"><FiDownload /> PDF</button><button type="button"><FiFileText /> Excel</button></div>
            </div>
            <div className="sd-ranking-list">
              {topTen.map((student) => (
                <article key={student.roll} className={`sd-ranking-row ${student.rank <= 3 ? "top" : ""}`}>
                  <div className="sd-ranking-left">
                    <span className={`sd-medal ${rankBadgeClass(student.rank)}`}>{student.rank <= 3 ? <FiAward /> : null}</span>
                    <div className="sd-ranking-name"><span className={`sd-rank-label ${rankBadgeClass(student.rank)}`}>Rank {student.rank}</span><h3>{student.name}</h3><p>{student.roll}</p></div>
                  </div>
                  <div className="sd-ranking-right"><strong>{student.api.toFixed(2)}</strong><span>API Score</span></div>
                </article>
              ))}
            </div>
            <div className="sd-podium-grid">
              {topTen.slice(0, 3).map((student) => (
                <article key={student.roll} className={`sd-podium-card podium-${student.rank}`}>
                  <span className="sd-medal"><FiAward /></span>
                  <span className={`sd-rank-label ${rankBadgeClass(student.rank)}`}>Rank {student.rank}</span>
                  <h3>{student.name}</h3><p>{student.roll}</p><strong>{student.api.toFixed(2)}</strong><span>API Score</span>
                </article>
              ))}
            </div>
          </section>
        )}
        {activeTab === "weak" && (
          <section className="sd-panel">
            <div className="sd-weak-summary-grid">
              <article className="sd-weak-summary critical"><span className="circle"><FiAlertTriangle /></span><div><h4>Critical (API &lt; 50)</h4><strong>{weakSegments.critical.length}</strong></div></article>
              <article className="sd-weak-summary multiple"><span className="circle"><FiInfo /></span><div><h4>Multiple Failures</h4><strong>{weakSegments.multiple.length}</strong></div></article>
              <article className="sd-weak-summary borderline"><span className="circle"><FiTrendingDown /></span><div><h4>Borderline (50-60)</h4><strong>{weakSegments.borderline.length}</strong></div></article>
            </div>
            <section className="sd-weak-block">
              <h3 className="score-red"><FiAlertTriangle /> Critical Students (API &lt; 50)</h3>
              {weakSegments.critical.map((student) => (
                <article key={student.roll} className="sd-weak-item critical"><h4>{student.name} ({student.roll})</h4><p>API: <strong>{student.api.toFixed(1)}</strong> � Rank: {student.rank}</p><div className="sd-chip-wrap">{student.failedSubjects.map((sub) => <span key={sub} className="sd-chip critical">Failed: {sub}</span>)}</div></article>
              ))}
            </section>
            <section className="sd-weak-block">
              <h3 className="score-orange"><FiInfo /> Students with Multiple Failures (2+ subjects)</h3>
              {weakSegments.multiple.map((student) => (
                <article key={student.roll} className="sd-weak-item multiple"><h4>{student.name} ({student.roll})</h4><p>API: <strong>{student.api.toFixed(1)}</strong> � Rank: {student.rank}</p><div className="sd-chip-wrap">{student.failedSubjects.map((sub) => <span key={sub} className="sd-chip multiple">{sub}</span>)}</div></article>
              ))}
            </section>
            <section className="sd-weak-block">
              <h3 className="score-yellow"><FiTrendingDown /> Borderline Students (API 50-60)</h3>
              <div className="sd-borderline-grid">
                {weakSegments.borderline.map((student) => (
                  <article key={student.roll} className="sd-borderline-card"><div><h4>{student.name}</h4><p>{student.roll}</p></div><div className="align-right"><strong>{student.api.toFixed(1)}</strong><p>Rank {student.rank}</p></div></article>
                ))}
              </div>
            </section>
            <section className="sd-recommendations">
              <h3>Recommendations for Remedial Action:</h3>
              <ul><li>Schedule one-on-one counseling sessions with critical students</li><li>Organize remedial classes for weak subjects</li><li>Implement peer tutoring programs</li><li>Provide additional study materials and resources</li><li>Monitor progress weekly through regular assessments</li></ul>
            </section>
            {quickReport}
          </section>
        )}

        {activeTab === "analytics" && (
          <section className="sd-panel">
            <section className="sd-chart-card">
              <h3>Subject-wise Average Performance</h3>
              <ResponsiveContainer width="100%" height={460}><BarChart data={analytics.barData}><CartesianGrid strokeDasharray="4 4" stroke="#d1d5db" /><XAxis dataKey="name" /><YAxis domain={[0, 100]} /><Tooltip /><Bar dataKey="value" fill="#417fe0" radius={[12, 12, 0, 0]} /></BarChart></ResponsiveContainer>
            </section>
            <div className="sd-chart-grid">
              <section className="sd-chart-card">
                <h3>Grade Distribution</h3>
                <ResponsiveContainer width="100%" height={420}><PieChart><Pie data={analytics.pieData} dataKey="value" nameKey="name" outerRadius={140} label>{analytics.pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
              </section>
              <section className="sd-chart-card">
                <h3>NORMALIZED Score Distribution</h3>
                <ResponsiveContainer width="100%" height={420}><LineChart data={analytics.lineData}><CartesianGrid strokeDasharray="4 4" stroke="#d1d5db" /><XAxis dataKey="range" /><YAxis /><Tooltip /><Line type="monotone" dataKey="students" stroke="#7f5ce4" strokeWidth={4} dot={{ r: 8, fill: "#ffffff", strokeWidth: 4 }} /></LineChart></ResponsiveContainer>
              </section>
            </div>
          </section>
        )}

        {activeTab === "queries" && (
          <section className="sd-panel">
            <div className="sd-query-summary-grid">
              <article className="sd-query-summary-card"><span className="sd-stat-icon icon-blue"><FiFileText /></span><div><h4>Total Queries</h4><strong className="score-blue">{queryStats.total}</strong></div></article>
              <article className="sd-query-summary-card"><span className="sd-stat-icon icon-orange"><FiInfo /></span><div><h4>Pending</h4><strong className="score-orange">{queryStats.pending}</strong></div></article>
              <article className="sd-query-summary-card"><span className="sd-stat-icon icon-green"><FiCheckCircle /></span><div><h4>Answered</h4><strong className="score-green">{queryStats.answered}</strong></div></article>
            </div>
            <section className="sd-query-panel">
              <div className="sd-panel-head">
                <h2>Student Queries</h2>
                <div className="sd-query-filters">
                  <button type="button" className={queryFilter === "all" ? "active" : ""} onClick={() => setQueryFilter("all")}>All</button>
                  <button type="button" className={queryFilter === "pending" ? "active" : ""} onClick={() => setQueryFilter("pending")}>Pending ({queryStats.pending})</button>
                  <button type="button" className={queryFilter === "answered" ? "active" : ""} onClick={() => setQueryFilter("answered")}>Answered ({queryStats.answered})</button>
                </div>
              </div>
              <div className="sd-query-list">
                {visibleQueries.map((query) => (
                  <article key={query.id} className="sd-query-card">
                    <div className="sd-query-userline"><h3><FiUser /> {query.studentName} <span>({query.roll})</span></h3><span className={`sd-status ${query.status}`}>{query.status === "answered" ? "Answered" : "Pending"}</span></div>
                    <div className="sd-query-meta"><span className="subject-chip">{query.subject}</span><span>{query.date}</span></div>
                    <div className="sd-query-question"><h4>Student's Question:</h4><p>{query.question}</p></div>
                    {query.status === "answered" ? (
                      <div className="sd-query-response-view"><h4>Your Response:</h4><p>{query.response}</p></div>
                    ) : (
                      <div className="sd-query-reply"><label htmlFor={`reply-${query.id}`}>Your Response:</label><textarea id={`reply-${query.id}`} placeholder="Type your response here..." value={queryReplies[query.id] ?? ""} onChange={(event) => setQueryReplies((prev) => ({ ...prev, [query.id]: event.target.value }))} /><button type="button" onClick={() => handleReplySubmit(query.id)}><FiSend /> Send Response</button></div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeTab === "marks" && (
          <section className="sd-panel">
            <h2>Marks Entry &amp; Management</h2>
            <p className="sd-subtitle">Enter marks manually or upload an Excel sheet for bulk entry</p>
            <div className="sd-mode-toggle"><button type="button" className={marksMode === "manual" ? "active" : ""} onClick={() => setMarksMode("manual")}>Manual Entry</button><button type="button" className={marksMode === "upload" ? "active" : ""} onClick={() => setMarksMode("upload")}>Upload Excel</button></div>
            {marksMode === "manual" ? (
              <div className="sd-manual-form">
                <div><label>Subject</label><div className="sd-select-wrap"><select value={markForm.subject} onChange={(event) => setMarkForm((prev) => ({ ...prev, subject: event.target.value }))}><option value="">Select subject</option>{SUBJECTS.map((subject) => <option key={subject.key} value={subject.label}>{subject.label}</option>)}</select><FiChevronDown /></div></div>
                <div><label>Roll Number</label><input type="text" placeholder="e.g., 2023MBBS001" value={markForm.roll} onChange={(event) => setMarkForm((prev) => ({ ...prev, roll: event.target.value }))} /></div>
                <div><label>Marks</label><input type="number" placeholder="Enter marks" value={markForm.marks} onChange={(event) => setMarkForm((prev) => ({ ...prev, marks: event.target.value }))} /></div>
                <button type="button" className="sd-primary-btn full" onClick={handleSaveMark}><FiFileText /> {editingEntryId ? "Update Marks" : "Save Marks"}</button>
              </div>
            ) : (
              <div className="sd-upload-block"><FiFileText className="upload-placeholder" /><p>Upload an Excel file with student marks</p><label className="sd-primary-btn" htmlFor="excelFile"><FiUpload /> Choose Excel File</label><input id="excelFile" type="file" accept=".xls,.xlsx" onChange={handleChooseUpload} hidden />{uploadFileName ? <span className="sd-file-name"><FiPaperclip /> {uploadFileName}</span> : null}</div>
            )}
            <hr className="sd-divider" />
            <section>
              <h3>Recent Entries</h3>
              <div className="sd-entry-list">{recentEntries.map((entry) => (<article key={entry.id} className="sd-entry-card"><div><h4>{entry.roll}</h4><p>{entry.subject} � {entry.marks}</p></div><div className="sd-entry-actions"><button type="button" onClick={() => handleEditEntry(entry)}><FiFileText /> Edit</button><button type="button" onClick={() => handleDeleteEntry(entry.id)}><FiX /> Delete</button></div></article>))}</div>
            </section>
            <section className="sd-format-card"><h3>Excel Format Requirements:</h3><ul><li>Column A: Roll Number</li><li>Column B: Student Name</li><li>Columns C onwards: Subject marks</li><li>First row should contain headers</li><li>Save file as .xlsx or .xls format</li></ul></section>
            <button type="button" className="sd-template-btn" onClick={handleDownloadTemplate}><FiFileText /> Download Template</button>
          </section>
        )}
      </main>

      {toast ? <div className="sd-toast">{toast}</div> : null}
    </div>
  );
}

export default StaffDashboard;
