
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAward,
  FiBarChart2,
  FiBook,
  FiCheckCircle,
  FiChevronDown,
  FiDownload,
  FiEdit2,
  FiEye,
  FiFileText,
  FiPlus,
  FiSave,
  FiSearch,
  FiSettings,
  FiShield,
  FiTrash2,
  FiTrendingUp,
  FiUpload,
  FiUser,
  FiUserCheck,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import "./AdminDashboard.css";

const TABS = ["overview", "students", "staff", "subjects", "marks", "settings", "reports"];
const MARKS_TABS = ["add", "view", "upload"];

const mbbsSubjects = [
  { code: "MBBS101", name: "Anatomy", department: "MBBS", maxMarks: 100, passMarks: 50, credits: 4 },
  { code: "MBBS102", name: "Physiology", department: "MBBS", maxMarks: 100, passMarks: 50, credits: 4 },
  { code: "MBBS103", name: "Biochemistry", department: "MBBS", maxMarks: 100, passMarks: 50, credits: 3 },
  { code: "MBBS201", name: "Pathology", department: "MBBS", maxMarks: 150, passMarks: 75, credits: 5 },
  { code: "MBBS202", name: "Pharmacology", department: "MBBS", maxMarks: 150, passMarks: 75, credits: 5 },
  { code: "MBBS203", name: "Microbiology", department: "MBBS", maxMarks: 100, passMarks: 50, credits: 4 },
  { code: "MBBS301", name: "General Medicine", department: "MBBS", maxMarks: 150, passMarks: 75, credits: 5 },
  { code: "MBBS302", name: "General Surgery", department: "MBBS", maxMarks: 150, passMarks: 75, credits: 5 },
  { code: "MBBS303", name: "OBG", department: "MBBS", maxMarks: 100, passMarks: 50, credits: 4 },
];

const mdSubjects = [
  { code: "MD101", name: "Advanced Pathology", department: "MD", maxMarks: 200, passMarks: 100, credits: 6 },
  { code: "MD102", name: "Clinical Medicine", department: "MD", maxMarks: 200, passMarks: 100, credits: 6 },
  { code: "MD103", name: "Advanced Pharmacology", department: "MD", maxMarks: 150, passMarks: 75, credits: 5 },
  { code: "MD104", name: "Research Methodology", department: "MD", maxMarks: 100, passMarks: 50, credits: 4 },
  { code: "MD105", name: "Diagnostic Procedures", department: "MD", maxMarks: 150, passMarks: 75, credits: 5 },
  { code: "MD106", name: "Medical Ethics", department: "MD", maxMarks: 100, passMarks: 50, credits: 3 },
];

const initialSubjects = [...mbbsSubjects, ...mdSubjects];

const initialStaff = [
  { id: "FAC2023001", name: "Dr. Rajesh Kumar", department: "MBBS", designation: "Professor", subjects: ["Anatomy", "Physiology"], status: "active" },
  { id: "FAC2023002", name: "Dr. Sunita Rao", department: "MBBS", designation: "Associate Professor", subjects: ["Biochemistry", "Pathology"], status: "active" },
  { id: "FAC2023003", name: "Dr. Anil Verma", department: "MBBS", designation: "Assistant Professor", subjects: ["Pharmacology", "Microbiology"], status: "active" },
  { id: "FAC2023004", name: "Dr. Meena Patel", department: "MBBS", designation: "Professor", subjects: ["General Medicine", "General Surgery"], status: "active" },
  { id: "FAC2023005", name: "Dr. Sanjay Gupta", department: "MBBS", designation: "Associate Professor", subjects: ["OBG"], status: "active" },
  { id: "FAC2023006", name: "Dr. Kavita Reddy", department: "MD", designation: "Professor", subjects: ["Advanced Pathology", "Clinical Medicine"], status: "active" },
  { id: "FAC2023007", name: "Dr. Ramesh Iyer", department: "MD", designation: "Professor", subjects: ["Advanced Pharmacology", "Research Methodology"], status: "active" },
  { id: "FAC2023008", name: "Dr. Priya Desai", department: "MD", designation: "Associate Professor", subjects: ["Diagnostic Procedures", "Medical Ethics"], status: "active" },
];

const mbbsStudents = [
  "Rohan Kapoor", "Meera Iyer", "Aditya Kumar", "Akash Sinha", "Kavya Pillai", "Vikram Singh", "Arjun Patel", "Priya Sharma", "Sneha Gupta", "Divya Nair",
  "Ritu Sharma", "Aman Khanna", "Ishita Joshi", "Rahul Verma", "Tanvi Malhotra", "Nikhil Bhat", "Ananya Reddy", "Aman Kumar", "Pooja Desai", "Riya Chatterjee",
];

const mdStudents = [
  "Dr. Meena Chatterjee", "Dr. Tanuja Mehta", "Dr. Priya Iyer", "Dr. Rohit Nair", "Dr. Anjali Mehta", "Dr. Kavita Nair", "Dr. Deepika Singh", "Dr. Ritu Malhotra", "Dr. Madhuri Pillai", "Dr. Arjun Rao",
  "Dr. Karthik Menon", "Dr. Neha Varma", "Dr. Sanjay Nair", "Dr. Aman Reddy", "Dr. Bhavna Iyer", "Dr. Surya Patel", "Dr. Geeta Sharma", "Dr. Nisha Reddy", "Dr. Tarun Joshi", "Dr. Kiran Rao",
  "Dr. Manish Gupta", "Dr. Pooja Menon", "Dr. Tejas Patel", "Dr. Niharika Iyer", "Dr. Vishal Nair", "Dr. Sarika Menon", "Dr. Pradeep Rao", "Dr. Vani Sharma", "Dr. Ritika Gupta", "Dr. Saurabh Iyer",
];

const methods = [
  { id: "zscore", name: "Z Score Method", desc: "Standard Z-Score normalization with mean 0 and standard deviation 1" },
  { id: "minmax", name: "Min Max Method", desc: "Min-Max normalization scaling scores between 0-100" },
  { id: "percentile", name: "Percentile Method", desc: "Percentile-based normalization ranking students" },
];

const createStudents = () => {
  const list = [];
  let api = 99.98;

  for (let i = 0; i < mdStudents.length; i += 1) {
    list.push({
      roll: `2023MD${String(i + 1).padStart(3, "0")}`,
      name: mdStudents[i],
      department: "MD",
      year: `Year ${(i % 3) + 1}`,
      batch: "2023",
      api: Number(api.toFixed(2)),
      status: "active",
    });
    api -= 1.15;
  }

  api = 98.96;
  for (let i = 0; i < mbbsStudents.length; i += 1) {
    list.push({
      roll: `2023MBBS${String(i + 1).padStart(3, "0")}`,
      name: mbbsStudents[i],
      department: "MBBS",
      year: `Year ${(i % 3) + 1}`,
      batch: "2023",
      api: Number(api.toFixed(2)),
      status: "active",
    });
    api -= 2.35;
  }

  return list.sort((a, b) => b.api - a.api).map((s, idx) => ({ ...s, rank: idx + 1 }));
};

const initialMarks = [
  { id: 1, studentRoll: "2023MBBS001", subjectCode: "MBBS101", rawMarks: 94, normalized: 96.2 },
  { id: 2, studentRoll: "2023MBBS007", subjectCode: "MBBS202", rawMarks: 82, normalized: 88.4 },
  { id: 3, studentRoll: "2023MD020", subjectCode: "MD102", rawMarks: 176, normalized: 99.98 },
];

const deptBadge = (dept) => (dept === "MBBS" ? "dept-badge badge-mbbs" : "dept-badge badge-md");
const rankBadgeClass = (rank) => {
  if (rank === 1) return "rank-gold";
  if (rank === 2) return "rank-silver";
  if (rank === 3) return "rank-bronze";
  return "rank-normal";
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [students, setStudents] = useState(createStudents());
  const [staff, setStaff] = useState(initialStaff);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [marks, setMarks] = useState(initialMarks);

  const [searchStudent, setSearchStudent] = useState("");
  const [searchStaff, setSearchStaff] = useState("");
  const [searchSubject, setSearchSubject] = useState("");

  const [marksTab, setMarksTab] = useState("add");
  const [method, setMethod] = useState("minmax");
  const [threshold, setThreshold] = useState(50);
  const [methodDesc, setMethodDesc] = useState(methods[1].desc);
  const [toast, setToast] = useState("");

  const [studentForm, setStudentForm] = useState({ roll: "", name: "", department: "MBBS", year: "Year 1", batch: "2023", api: "" });
  const [staffForm, setStaffForm] = useState({ id: "", name: "", department: "MBBS", designation: "Professor", subjects: [] });
  const [subjectForm, setSubjectForm] = useState({ code: "", name: "", department: "MBBS", maxMarks: 100, passMarks: 50, credits: 4 });
  const [marksForm, setMarksForm] = useState({ studentRoll: "", subjectCode: "", rawMarks: "" });

  const [editingStudent, setEditingStudent] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingMarkId, setEditingMarkId] = useState(null);

  const showToast = (msg) => setToast(msg);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const recalcRanks = (arr) => [...arr].sort((a, b) => b.api - a.api).map((s, idx) => ({ ...s, rank: idx + 1 }));

  const filteredStudents = useMemo(() => {
    const q = searchStudent.trim().toLowerCase();
    return students
      .filter((s) => (departmentFilter === "all" ? true : s.department === departmentFilter))
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q))
      .sort((a, b) => a.rank - b.rank);
  }, [students, departmentFilter, searchStudent]);

  const filteredStaff = useMemo(() => {
    const q = searchStaff.trim().toLowerCase();
    return staff
      .filter((s) => (departmentFilter === "all" ? true : s.department === departmentFilter))
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
  }, [staff, departmentFilter, searchStaff]);

  const filteredSubjects = useMemo(() => {
    const q = searchSubject.trim().toLowerCase();
    return subjects
      .filter((s) => (departmentFilter === "all" ? true : s.department === departmentFilter))
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
  }, [subjects, departmentFilter, searchSubject]);

  const topTen = useMemo(() => [...students].sort((a, b) => b.api - a.api).slice(0, 10), [students]);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const mbbs = students.filter((s) => s.department === "MBBS").length;
    const md = students.filter((s) => s.department === "MD").length;
    const highest = Math.max(...students.map((s) => s.api));
    const classAvg = students.reduce((sum, s) => sum + s.api, 0) / totalStudents;
    const failed = students.filter((s) => s.api < threshold).length;
    const passPercentage = ((totalStudents - failed) / totalStudents) * 100;
    return {
      totalStudents,
      mbbs,
      md,
      staff: staff.length,
      subjects: subjects.length,
      classAvg: Number(classAvg.toFixed(2)),
      highest: Number(highest.toFixed(2)),
      failed,
      passPercentage: Number(passPercentage.toFixed(1)),
      departments: 2,
    };
  }, [students, staff.length, subjects.length, threshold]);

  const distribution = useMemo(() => {
    return {
      excellent: students.filter((s) => s.api >= 85).length,
      good: students.filter((s) => s.api >= 75 && s.api < 85).length,
      average: students.filter((s) => s.api >= 60 && s.api < 75).length,
      low: students.filter((s) => s.api >= 50 && s.api < 60).length,
      failed: students.filter((s) => s.api < 50).length,
    };
  }, [students]);

  const handleStudentSave = () => {
    const api = Number(studentForm.api);
    if (!studentForm.roll || !studentForm.name || Number.isNaN(api)) {
      showToast("Enter valid student details");
      return;
    }

    if (editingStudent) {
      setStudents((prev) => recalcRanks(prev.map((s) => (s.roll === editingStudent ? { ...s, ...studentForm, api } : s))));
      setEditingStudent(null);
      showToast("Student updated");
    } else {
      setStudents((prev) => recalcRanks([...prev, { ...studentForm, api, status: "active", rank: prev.length + 1 }]));
      showToast("Student added");
    }

    setStudentForm({ roll: "", name: "", department: "MBBS", year: "Year 1", batch: "2023", api: "" });
  };

  const handleStaffSave = () => {
    if (!staffForm.id || !staffForm.name) {
      showToast("Enter valid staff details");
      return;
    }

    if (editingStaff) {
      setStaff((prev) => prev.map((s) => (s.id === editingStaff ? { ...s, ...staffForm, status: "active" } : s)));
      setEditingStaff(null);
      showToast("Staff updated");
    } else {
      setStaff((prev) => [...prev, { ...staffForm, status: "active" }]);
      showToast("Staff added");
    }

    setStaffForm({ id: "", name: "", department: "MBBS", designation: "Professor", subjects: [] });
  };

  const handleSubjectSave = () => {
    if (!subjectForm.code || !subjectForm.name) {
      showToast("Enter valid subject details");
      return;
    }

    const next = {
      ...subjectForm,
      maxMarks: Number(subjectForm.maxMarks),
      passMarks: Number(subjectForm.passMarks),
      credits: Number(subjectForm.credits),
    };

    if (editingSubject) {
      setSubjects((prev) => prev.map((s) => (s.code === editingSubject ? next : s)));
      setEditingSubject(null);
      showToast("Subject updated");
    } else {
      setSubjects((prev) => [...prev, next]);
      showToast("Subject added");
    }

    setSubjectForm({ code: "", name: "", department: "MBBS", maxMarks: 100, passMarks: 50, credits: 4 });
  };

  const handleMarksSave = () => {
    const raw = Number(marksForm.rawMarks);
    if (!marksForm.studentRoll || !marksForm.subjectCode || Number.isNaN(raw)) {
      showToast("Enter marks details");
      return;
    }

    const sub = subjects.find((s) => s.code === marksForm.subjectCode);
    if (!sub) return;

    const normalized = Number(((raw / sub.maxMarks) * 100).toFixed(2));

    if (editingMarkId) {
      setMarks((prev) => prev.map((m) => (m.id === editingMarkId ? { ...m, ...marksForm, rawMarks: raw, normalized } : m)));
      setEditingMarkId(null);
      showToast("Marks updated");
    } else {
      setMarks((prev) => [{ id: Date.now(), ...marksForm, rawMarks: raw, normalized }, ...prev]);
      showToast("Marks added");
    }

    setStudents((prev) => recalcRanks(prev.map((s) => (s.roll === marksForm.studentRoll ? { ...s, api: Number(((s.api + normalized) / 2).toFixed(2)) } : s))));
    setMarksForm({ studentRoll: "", subjectCode: "", rawMarks: "" });
  };

  const deleteWithConfirm = (text, cb) => {
    if (!window.confirm(text)) return;
    cb();
  };

  const toggleStaffSubject = (subjectName) => {
    setStaffForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subjectName)
        ? prev.subjects.filter((s) => s !== subjectName)
        : [...prev.subjects, subjectName],
    }));
  };

  const downloadTemplate = () => {
    const blob = new Blob(["studentRoll,subjectCode,rawMarks"], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "marks-template.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Template downloaded");
  };

  const exportData = () => showToast("Export started");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  const footerStats = (
    <section className="ad-footer-strip">
      <div><strong className="score-violet">{staff.length}</strong><span>Active Staff</span></div>
      <div><strong className="score-purple">{subjects.length}</strong><span>Total Subjects</span></div>
      <div><strong className="score-blue">{students.length}</strong><span>Active Students</span></div>
      <div><strong className="score-green">{students.filter((s) => s.api >= threshold).length}</strong><span>Passed Students</span></div>
    </section>
  );
  return (
    <div className="admin-shell">
      <header className="ad-header">
        <div className="ad-header-left">
          <div className="ad-logo"><FiShield /></div>
          <div>
            <h1>Admin Dashboard - Academic Performance Normalizer</h1>
            <p><FiUser /> Admin Portal • Full System Access</p>
          </div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-export" onClick={exportData}><FiDownload /> Export Data</button>
          <button type="button" className="ad-export" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="ad-container">
        {(activeTab === "overview" || activeTab === "students") && (
          <section className="ad-filter-card">
            <div>
              <label>Select Department:</label>
              <div className="ad-select">
                <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                  <option value="all">All Departments</option>
                  <option value="MBBS">MBBS Only</option>
                  <option value="MD">MD Only</option>
                </select>
                <FiChevronDown />
              </div>
            </div>
            <div className="ad-top-counts">
              <div><strong className="score-blue">{stats.totalStudents}</strong><span>Total Students</span></div>
              <div><strong className="score-indigo">{stats.mbbs}</strong><span>MBBS</span></div>
              <div><strong className="score-violet">{stats.md}</strong><span>MD</span></div>
            </div>
          </section>
        )}

        <nav className="ad-tabbar">
          {TABS.map((tab) => (
            <button key={tab} type="button" className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {activeTab === "overview" && (
          <>
            <section className="ad-grid-8">
              <article className="ad-card"><h3>Total Students</h3><strong className="score-blue">{stats.totalStudents}</strong><p>20 MBBS, 30 MD</p><span className="icon blue"><FiUsers /></span></article>
              <article className="ad-card"><h3>Total Staff</h3><strong className="score-violet">{stats.staff}</strong><p>Active faculty members</p><span className="icon violet"><FiUserCheck /></span></article>
              <article className="ad-card"><h3>Total Subjects</h3><strong className="score-indigo">{stats.subjects}</strong><p>Across all departments</p><span className="icon indigo"><FiBook /></span></article>
              <article className="ad-card"><h3>Class Average</h3><strong className="score-green">{stats.classAvg}%</strong><p>Normalized API score</p><span className="icon green"><FiTrendingUp /></span></article>
              <article className="ad-card"><h3>Highest Score</h3><strong className="score-orange">{stats.highest}%</strong><p>Top performer</p><span className="icon orange"><FiAward /></span></article>
              <article className="ad-card"><h3>Pass Percentage</h3><strong className="score-green">{stats.passPercentage}%</strong><p>{students.length - stats.failed} students passed</p><span className="icon green"><FiCheckCircle /></span></article>
              <article className="ad-card"><h3>Failed Students</h3><strong className="score-red">{stats.failed}</strong><p>Below {threshold}% API</p><span className="icon red"><FiXCircle /></span></article>
              <article className="ad-card"><h3>Departments</h3><strong className="score-sky">{stats.departments}</strong><p>MBBS &amp; MD</p><span className="icon sky"><FiBarChart2 /></span></article>
            </section>

            <section className="ad-grid-2">
              <article className="ad-panel">
                <div className="panel-head"><h3>MBBS Department</h3><span className="pill dark">20 Students</span></div>
                <div className="rows">
                  <p>Students <strong>{stats.mbbs}</strong></p>
                  <p>Staff <strong>{staff.filter((s) => s.department === "MBBS").length}</strong></p>
                  <p>Subjects <strong>{subjects.filter((s) => s.department === "MBBS").length}</strong></p>
                  <p>Avg API <strong className="score-blue">{Number((students.filter((s) => s.department === "MBBS").reduce((sum, s) => sum + s.api, 0) / stats.mbbs).toFixed(2))}%</strong></p>
                </div>
              </article>
              <article className="ad-panel">
                <div className="panel-head"><h3>MD Department</h3><span className="pill light">30 Students</span></div>
                <div className="rows">
                  <p>Students <strong>{stats.md}</strong></p>
                  <p>Staff <strong>{staff.filter((s) => s.department === "MD").length}</strong></p>
                  <p>Subjects <strong>{subjects.filter((s) => s.department === "MD").length}</strong></p>
                  <p>Avg API <strong className="score-blue">{Number((students.filter((s) => s.department === "MD").reduce((sum, s) => sum + s.api, 0) / stats.md).toFixed(2))}%</strong></p>
                </div>
              </article>
            </section>

            <section className="ad-panel">
              <h3>Performance Distribution</h3>
              <div className="dist-grid">
                <div><strong className="score-green">{distribution.excellent}</strong><span>Excellent (&gt;=85%)</span></div>
                <div><strong className="score-blue">{distribution.good}</strong><span>Good (75-84%)</span></div>
                <div><strong className="score-yellow">{distribution.average}</strong><span>Average (60-74%)</span></div>
                <div><strong className="score-orange">{distribution.low}</strong><span>Below Avg (50-59%)</span></div>
                <div><strong className="score-red">{distribution.failed}</strong><span>Failed (&lt;50%)</span></div>
              </div>
            </section>
            {footerStats}
          </>
        )}

        {activeTab === "students" && (
          <section className="ad-panel">
            <div className="head-row">
              <div><h2>Student Management</h2><p>Manage student records, assignments, and details</p></div>
              <button type="button" className="dark-btn" onClick={handleStudentSave}><FiPlus /> {editingStudent ? "Update Student" : "Add Student"}</button>
            </div>
            <div className="ad-form-grid six">
              <input placeholder="Roll No" value={studentForm.roll} onChange={(e) => setStudentForm((p) => ({ ...p, roll: e.target.value }))} />
              <input placeholder="Name" value={studentForm.name} onChange={(e) => setStudentForm((p) => ({ ...p, name: e.target.value }))} />
              <select value={studentForm.department} onChange={(e) => setStudentForm((p) => ({ ...p, department: e.target.value }))}><option>MBBS</option><option>MD</option></select>
              <input placeholder="Year" value={studentForm.year} onChange={(e) => setStudentForm((p) => ({ ...p, year: e.target.value }))} />
              <input placeholder="Batch" value={studentForm.batch} onChange={(e) => setStudentForm((p) => ({ ...p, batch: e.target.value }))} />
              <input placeholder="API" value={studentForm.api} onChange={(e) => setStudentForm((p) => ({ ...p, api: e.target.value }))} />
            </div>
            <label className="search"><FiSearch /><input placeholder="Search by name or roll number..." value={searchStudent} onChange={(e) => setSearchStudent(e.target.value)} /></label>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Roll No</th><th>Name</th><th>Department</th><th>Year</th><th>Batch</th><th>API</th><th>Rank</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.roll}>
                      <td>{s.roll}</td>
                      <td>{s.name}</td>
                      <td><span className={deptBadge(s.department)}>{s.department}</span></td>
                      <td>{s.year}</td>
                      <td>{s.batch}</td>
                      <td>{s.api.toFixed(2)}</td>
                      <td><span className="rank-chip">#{s.rank}</span></td>
                      <td><span className="status">{s.status}</span></td>
                      <td><div className="actions"><button type="button" onClick={() => showToast(s.name)}><FiEye /></button><button type="button" onClick={() => { setEditingStudent(s.roll); setStudentForm({ roll: s.roll, name: s.name, department: s.department, year: s.year, batch: s.batch, api: String(s.api) }); }}><FiEdit2 /></button><button type="button" onClick={() => deleteWithConfirm("Delete this student?", () => { setStudents((prev) => recalcRanks(prev.filter((x) => x.roll !== s.roll))); showToast("Student deleted"); })}><FiTrash2 /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {footerStats}
          </section>
        )}

        {activeTab === "staff" && (
          <section className="ad-panel">
            <div className="head-row">
              <div><h2>Staff Management</h2><p>Manage staff records and subject assignments</p></div>
              <button type="button" className="dark-btn" onClick={handleStaffSave}><FiPlus /> {editingStaff ? "Update Staff" : "Add Staff"}</button>
            </div>
            <div className="ad-form-grid four">
              <input placeholder="Staff ID" value={staffForm.id} onChange={(e) => setStaffForm((p) => ({ ...p, id: e.target.value }))} />
              <input placeholder="Name" value={staffForm.name} onChange={(e) => setStaffForm((p) => ({ ...p, name: e.target.value }))} />
              <select value={staffForm.department} onChange={(e) => setStaffForm((p) => ({ ...p, department: e.target.value }))}><option>MBBS</option><option>MD</option></select>
              <input placeholder="Designation" value={staffForm.designation} onChange={(e) => setStaffForm((p) => ({ ...p, designation: e.target.value }))} />
            </div>
            <div className="subject-multi-select">
              {(staffForm.department === "MBBS" ? mbbsSubjects : mdSubjects).map((s) => (
                <label key={s.code}><input type="checkbox" checked={staffForm.subjects.includes(s.name)} onChange={() => toggleStaffSubject(s.name)} /> {s.name}</label>
              ))}
            </div>
            <label className="search"><FiSearch /><input placeholder="Search by name or staff ID..." value={searchStaff} onChange={(e) => setSearchStaff(e.target.value)} /></label>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Staff ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Subjects</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredStaff.map((f) => (
                    <tr key={f.id}>
                      <td>{f.id}</td>
                      <td>{f.name}</td>
                      <td><span className={deptBadge(f.department)}>{f.department}</span></td>
                      <td>{f.designation}</td>
                      <td><span className="count-chip">{f.subjects.length} subjects</span></td>
                      <td><span className="status">{f.status}</span></td>
                      <td><div className="actions"><button type="button" onClick={() => showToast(f.subjects.join(", ") || "No subjects") }><FiEye /></button><button type="button" onClick={() => { setEditingStaff(f.id); setStaffForm({ id: f.id, name: f.name, department: f.department, designation: f.designation, subjects: [...f.subjects] }); }}><FiEdit2 /></button><button type="button" onClick={() => deleteWithConfirm("Delete this staff member?", () => { setStaff((prev) => prev.filter((x) => x.id !== f.id)); showToast("Staff deleted"); })}><FiTrash2 /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {footerStats}
          </section>
        )}
        {activeTab === "subjects" && (
          <section className="ad-panel">
            <div className="head-row">
              <div><h2>Subject Management</h2><p>Manage subjects, marks allocation, and credits</p></div>
              <button type="button" className="dark-btn" onClick={handleSubjectSave}><FiPlus /> {editingSubject ? "Update Subject" : "Add Subject"}</button>
            </div>
            <div className="ad-form-grid six">
              <input placeholder="Code" value={subjectForm.code} onChange={(e) => setSubjectForm((p) => ({ ...p, code: e.target.value }))} />
              <input placeholder="Name" value={subjectForm.name} onChange={(e) => setSubjectForm((p) => ({ ...p, name: e.target.value }))} />
              <select value={subjectForm.department} onChange={(e) => setSubjectForm((p) => ({ ...p, department: e.target.value }))}><option>MBBS</option><option>MD</option></select>
              <input type="number" placeholder="Max Marks" value={subjectForm.maxMarks} onChange={(e) => setSubjectForm((p) => ({ ...p, maxMarks: e.target.value }))} />
              <input type="number" placeholder="Pass Marks" value={subjectForm.passMarks} onChange={(e) => setSubjectForm((p) => ({ ...p, passMarks: e.target.value }))} />
              <input type="number" placeholder="Credits" value={subjectForm.credits} onChange={(e) => setSubjectForm((p) => ({ ...p, credits: e.target.value }))} />
            </div>
            <label className="search"><FiSearch /><input placeholder="Search by name or code..." value={searchSubject} onChange={(e) => setSearchSubject(e.target.value)} /></label>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Code</th><th>Name</th><th>Department</th><th>Max Marks</th><th>Passing Marks</th><th>Credits</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredSubjects.map((s) => (
                    <tr key={s.code}>
                      <td>{s.code}</td>
                      <td>{s.name}</td>
                      <td><span className={deptBadge(s.department)}>{s.department}</span></td>
                      <td>{s.maxMarks}</td>
                      <td>{s.passMarks}</td>
                      <td>{s.credits}</td>
                      <td><div className="actions"><button type="button" onClick={() => { setEditingSubject(s.code); setSubjectForm({ ...s }); }}><FiEdit2 /></button><button type="button" onClick={() => deleteWithConfirm("Delete this subject?", () => { setSubjects((prev) => prev.filter((x) => x.code !== s.code)); showToast("Subject deleted"); })}><FiTrash2 /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "marks" && (
          <section className="ad-panel">
            <div className="subtabs">
              {MARKS_TABS.map((tab) => (
                <button key={tab} type="button" className={marksTab === tab ? "active" : ""} onClick={() => setMarksTab(tab)}>{tab === "add" ? "Add Marks" : tab === "view" ? "View Marks" : "Upload Excel"}</button>
              ))}
            </div>

            {marksTab === "add" && (
              <div className="marks-add">
                <h2>Add Student Marks</h2>
                <p>Enter marks for individual students</p>
                <div className="ad-form-grid four">
                  <select value={marksForm.studentRoll} onChange={(e) => setMarksForm((p) => ({ ...p, studentRoll: e.target.value }))}>
                    <option value="">Choose student</option>
                    {students.map((s) => <option key={s.roll} value={s.roll}>{s.roll} - {s.name}</option>)}
                  </select>
                  <select value={marksForm.subjectCode} onChange={(e) => setMarksForm((p) => ({ ...p, subjectCode: e.target.value }))}>
                    <option value="">Choose subject</option>
                    {subjects.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
                  </select>
                  <input placeholder="Enter marks" value={marksForm.rawMarks} onChange={(e) => setMarksForm((p) => ({ ...p, rawMarks: e.target.value }))} />
                  <button type="button" className="dark-btn" onClick={handleMarksSave}><FiSave /> {editingMarkId ? "Update Marks" : "Add Marks"}</button>
                </div>
              </div>
            )}

            {marksTab === "view" && (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Student</th><th>Subject</th><th>Raw Marks</th><th>Normalized</th><th>Actions</th></tr></thead>
                  <tbody>
                    {marks.map((m) => (
                      <tr key={m.id}>
                        <td>{m.studentRoll}</td>
                        <td>{m.subjectCode}</td>
                        <td>{m.rawMarks}</td>
                        <td>{m.normalized}</td>
                        <td><div className="actions"><button type="button" onClick={() => { setEditingMarkId(m.id); setMarksForm({ studentRoll: m.studentRoll, subjectCode: m.subjectCode, rawMarks: String(m.rawMarks) }); setMarksTab("add"); }}><FiEdit2 /></button><button type="button" onClick={() => deleteWithConfirm("Delete this marks entry?", () => { setMarks((prev) => prev.filter((x) => x.id !== m.id)); showToast("Marks deleted"); })}><FiTrash2 /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {marksTab === "upload" && (
              <div className="upload-box">
                <FiUpload />
                <p>Upload marks using Excel sheet</p>
                <button type="button" className="dark-btn" onClick={downloadTemplate}>Download Template</button>
              </div>
            )}
            {footerStats}
          </section>
        )}

        {activeTab === "settings" && (
          <section className="ad-panel">
            <h2><FiSettings /> Normalization Settings</h2>
            <p>Configure how scores are normalized across different exams</p>

            <label className="control-label">Normalization Method</label>
            <div className="ad-select wide">
              <select
                value={method}
                onChange={(e) => {
                  const next = methods.find((m) => m.id === e.target.value);
                  setMethod(e.target.value);
                  setMethodDesc(next ? next.desc : "");
                }}
              >
                <option value="minmax">Min-Max Normalization</option>
                <option value="zscore">Z-Score Normalization</option>
                <option value="percentile">Percentile Normalization</option>
              </select>
              <FiChevronDown />
            </div>

            <div className="method-note">
              <h4>About method:</h4>
              <p>{methodDesc}</p>
            </div>

            <label className="control-label">Pass Mark Threshold (%)</label>
            <input className="wide-input" type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />

            <label className="control-label">Description</label>
            <textarea className="wide-input" rows={3} value={methodDesc} onChange={(e) => setMethodDesc(e.target.value)} />

            <button type="button" className="dark-btn full" onClick={() => showToast("Settings saved")}><FiSave /> Save Settings</button>

            <section className="methods-list">
              <h3>Available Normalization Methods</h3>
              {methods.map((m) => (
                <article key={m.id} className={`method-card ${method === m.id ? "active" : ""}`}>
                  <div>
                    <h4>{m.name} {method === m.id ? <span className="status">Currently Active</span> : null}</h4>
                    <p>{m.desc}</p>
                    <small>Pass Threshold: {threshold}%</small>
                  </div>
                  <button type="button" onClick={() => { setMethod(m.id); setMethodDesc(m.desc); }}>Select</button>
                </article>
              ))}
            </section>

            <section className="formula-box">
              <h3>Formula Preview</h3>
              <pre>{`Min-Max Formula:\nNormalized Score = ((Raw Score - Min) / (Max - Min)) * 100`}</pre>
            </section>
          </section>
        )}

        {activeTab === "reports" && (
          <section className="ad-panel">
            <div className="report-cards">
              <article><span className="icon blue"><FiAward /></span><h4>Merit List</h4><p>Top performers</p><div><button type="button" onClick={exportData}><FiDownload /> PDF</button><button type="button" onClick={exportData}><FiDownload /> Excel</button></div></article>
              <article><span className="icon violet"><FiBarChart2 /></span><h4>Subject Report</h4><p>Performance analysis</p><div><button type="button" onClick={exportData}><FiDownload /> PDF</button><button type="button" onClick={exportData}><FiDownload /> Excel</button></div></article>
              <article><span className="icon green"><FiUsers /></span><h4>Class Summary</h4><p>Overall statistics</p><div><button type="button" onClick={exportData}><FiDownload /> PDF</button><button type="button" onClick={exportData}><FiDownload /> Excel</button></div></article>
              <article><span className="icon orange"><FiFileText /></span><h4>Semester Report</h4><p>Complete results</p><div><button type="button" onClick={exportData}><FiDownload /> PDF</button><button type="button" onClick={exportData}><FiDownload /> Excel</button></div></article>
            </div>

            <section className="ad-panel merit">
              <div className="head-row">
                <div><h2>Merit List - Top 10 Students</h2><p>Ranked by normalized API score</p></div>
                <button type="button" className="dark-btn" onClick={exportData}><FiDownload /> Download Full List</button>
              </div>
              <div className="rank-list">
                {topTen.map((s) => (
                  <article key={s.roll} className={`rank-row ${s.rank <= 3 ? "top" : ""}`}>
                    <div className="rank-left">
                      <span className={`rank-pill ${rankBadgeClass(s.rank)}`}>Rank {s.rank}</span>
                      <div className="rank-meta">
                        <h4>{s.name}</h4>
                        <p>{s.roll} <span className={deptBadge(s.department)}>{s.department}</span></p>
                      </div>
                    </div>
                    <div className="rank-right">
                      <strong>{s.api.toFixed(2)}</strong>
                      <span>API Score</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="ad-panel">
              <h3>Normalized Score Distribution</h3>
              <p>Visual breakdown of student performance</p>
              <div className="legend-list">
                <div><span className="dot green" /> Excellent (&gt;=85%) <strong>{distribution.excellent} students</strong></div>
                <div><span className="dot blue" /> Good (75-84%) <strong>{distribution.good} students</strong></div>
                <div><span className="dot yellow" /> Average (60-74%) <strong>{distribution.average} students</strong></div>
                <div><span className="dot orange" /> Below Average (50-59%) <strong>{distribution.low} students</strong></div>
                <div><span className="dot red" /> Failed (&lt;50%) <strong>{distribution.failed} students</strong></div>
              </div>
            </section>
          </section>
        )}
      </main>

      {toast ? <div className="ad-toast">{toast}</div> : null}
    </div>
  );
}

export default AdminDashboard;
