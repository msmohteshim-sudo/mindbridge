import { useState, useEffect } from 'react';
import {
  FileText, Download, Printer, Filter,
  CheckCircle, Brain, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function DoctorReports() {
  const {
    doctor,
    allPatients,
    activePatientId,
    switchPatient,
    patient,
    cognitiveProfile,
    assessmentReports,
  } = useApp();

  const [filterPatientId, setFilterPatientId] = useState(activePatientId);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('90');
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    setFilterPatientId(activePatientId);
  }, [activePatientId]);

  const selectedPatientObj = allPatients.find(p => p.id === filterPatientId) || patient;
  const filteredReports = assessmentReports.filter(r => r.patientId === filterPatientId);

  const activeReport = filteredReports.find(r => r.id === selectedReportId) || filteredReports[0] || assessmentReports[0];

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header (Light Mode) */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-sky-50 to-indigo-50/90 rounded-3xl p-6 text-gray-900 shadow-soft border border-indigo-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-indigo-800 text-xs font-700">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Doctor Clinical Report System (Restricted Doctor-Only Access)</span>
            </div>
            <h1 className="text-2xl font-display font-800 text-gray-900">Cognitive Reports & Assessment Export</h1>
            <p className="text-gray-600 text-xs font-600 mt-0.5">
              Generate, filter, and review longitudinal cognitive progress reports for patients.
            </p>
          </div>

          <button
            onClick={() => setShowPdfModal(true)}
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-700 text-xs px-5 py-3 rounded-2xl shadow-soft flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate & Preview PDF Report
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card bg-white p-5 border border-gray-200 shadow-soft">
        <div className="flex items-center gap-2 mb-3 text-sm font-700 text-gray-800">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Report Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Patient Selector */}
          <div>
            <label className="block text-xs font-600 text-gray-600 mb-1">Select Patient</label>
            <select
              value={filterPatientId}
              onChange={(e) => {
                setFilterPatientId(e.target.value);
                switchPatient(e.target.value);
              }}
              className="input-field text-xs font-600"
            >
              {allPatients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (ID: {p.id}) · {p.age} yrs
                </option>
              ))}
            </select>
          </div>

          {/* Assessment Type Filter */}
          <div>
            <label className="block text-xs font-600 text-gray-600 mb-1">Assessment / Report Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field text-xs font-600"
            >
              <option value="all">All Report Types</option>
              <option value="Periodic Assessment">Periodic Assessment</option>
              <option value="Initial Cognitive Assessment">Initial Cognitive Assessment</option>
              <option value="Domain Trends">Cognitive Domain Trends</option>
              <option value="Adaptive Difficulty History">Adaptive Difficulty History</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-xs font-600 text-gray-600 mb-1">Date Range</label>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="input-field text-xs font-600"
            >
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="180">Last 6 Months</option>
              <option value="365">All History (1 Year)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Summary Modules */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-5 bg-indigo-50/50 border border-indigo-100">
          <div className="text-xs text-gray-500 font-600">Patient Overview</div>
          <div className="text-lg font-display font-800 text-indigo-900 mt-1">{selectedPatientObj.name}</div>
          <div className="text-xs text-indigo-700 mt-0.5">ID: {selectedPatientObj.id} · Stage: {selectedPatientObj.diagnosisStage}</div>
        </div>

        <div className="card p-5 bg-sky-50/50 border border-sky-100">
          <div className="text-xs text-gray-500 font-600">Cognitive Stability</div>
          <div className="text-2xl font-display font-800 text-sky-700 mt-1">{cognitiveProfile.overallScore}% Index</div>
          <div className="text-xs text-sky-600 mt-0.5">Status: {cognitiveProfile.trend}</div>
        </div>

        <div className="card p-5 bg-sage-50/50 border border-sage-100">
          <div className="text-xs text-gray-500 font-600">Primary Strength</div>
          <div className="text-xl font-display font-800 text-sage-900 mt-1">Language (74%)</div>
          <div className="text-xs text-sage-700 mt-0.5">Auditory Music Recognition</div>
        </div>

        <div className="card p-5 bg-purple-50/50 border border-purple-100">
          <div className="text-xs text-gray-500 font-600">Target Focus</div>
          <div className="text-xl font-display font-800 text-purple-900 mt-1">Processing Speed</div>
          <div className="text-xs text-purple-700 mt-0.5">Difficulty level 2 recommended</div>
        </div>
      </div>

      {/* Assessment Reports List & Selected Report View */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Reports Navigation List */}
        <div className="card lg:col-span-1 space-y-3">
          <h2 className="text-lg font-display font-700 text-gray-900 mb-2">Available Reports</h2>
          {filteredReports.map((rep) => (
            <button
              key={rep.id}
              onClick={() => setSelectedReportId(rep.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                activeReport?.id === rep.id
                  ? 'bg-indigo-50 border-indigo-300 shadow-soft'
                  : 'bg-gray-50/60 border-gray-100 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-700 text-indigo-900">{rep.type}</span>
                <span className="text-xs text-gray-400">{rep.date}</span>
              </div>
              <div className="text-sm font-display font-700 text-gray-800">{rep.patientName}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-1">{rep.clinicalObservations}</div>
            </button>
          ))}
        </div>

        {/* Report Content View */}
        <div className="card lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="badge bg-indigo-100 text-indigo-800 text-xs font-700 mb-1">{activeReport.type}</span>
              <h2 className="text-2xl font-display font-800 text-gray-900">{activeReport.patientName} — Clinical Report</h2>
              <p className="text-xs text-gray-500 mt-0.5">Evaluator: {activeReport.evaluator} · Date: {activeReport.date}</p>
            </div>

            <button
              onClick={() => setShowPdfModal(true)}
              className="btn bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs px-4 py-2 rounded-xl font-700 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Preview PDF
            </button>
          </div>

          {/* Cognitive Domain Breakdowns */}
          <div>
            <h3 className="text-sm font-display font-700 text-gray-900 mb-3">1. Cognitive Domain Summary Index</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                <span className="text-xs text-gray-500 font-600">Memory</span>
                <div className="text-lg font-700 text-sky-700">{activeReport.domainScores.memory}%</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-xs text-gray-500 font-600">Attention</span>
                <div className="text-lg font-700 text-amber-700">{activeReport.domainScores.attention}%</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-xs text-gray-500 font-600">Language</span>
                <div className="text-lg font-700 text-purple-700">{activeReport.domainScores.language}%</div>
              </div>
              <div className="p-3 bg-sage-50 rounded-xl border border-sage-100">
                <span className="text-xs text-gray-500 font-600">Executive</span>
                <div className="text-lg font-700 text-sage-700">{activeReport.domainScores.executiveFunction}%</div>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-xs text-gray-500 font-600">Visuospatial</span>
                <div className="text-lg font-700 text-rose-700">{activeReport.domainScores.visuospatial}%</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs text-gray-500 font-600">Processing</span>
                <div className="text-lg font-700 text-gray-700">{activeReport.domainScores.processingSpeed}%</div>
              </div>
            </div>
          </div>

          {/* Clinical Observations */}
          <div>
            <h3 className="text-sm font-display font-700 text-gray-900 mb-2">2. Clinical Observations</h3>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {activeReport.clinicalObservations}
            </p>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-display font-700 text-gray-900 mb-2">3. Recommended Interventions</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {activeReport.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                  <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* PDF REPORT PREVIEW MODAL */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative space-y-6 my-8 print:p-0 print:shadow-none">
            {/* Modal Actions */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span className="font-display font-700 text-gray-900">Clinical Cognitive Report — PDF Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPdf}
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-xl font-700 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="btn-ghost text-xs text-gray-500 px-3 py-2"
                >
                  Close ✕
                </button>
              </div>
            </div>

            {/* PRINTABLE REPORT CONTENT */}
            <div className="space-y-6 text-gray-900 font-sans">
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-indigo-600 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-indigo-700 font-display font-800 text-xl">
                    <Brain className="w-6 h-6 text-indigo-600" />
                    <span>MINDBRIDGE COGNITIVE CARE</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{doctor.hospital} · Neuro-Cognitive Unit</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-700 text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
                    Official Clinical Report
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Generated: 25 Sep 2026</p>
                </div>
              </div>

              {/* Patient & Doctor Meta Table */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs border border-gray-200">
                <div>
                  <div className="text-gray-500 font-600">Patient Name: <strong className="text-gray-900">{selectedPatientObj.name}</strong></div>
                  <div className="text-gray-500 font-600">Patient ID: <strong className="text-gray-900">{selectedPatientObj.id}</strong></div>
                  <div className="text-gray-500 font-600">Age / Gender: <strong className="text-gray-900">{selectedPatientObj.age} yrs · Male</strong></div>
                </div>
                <div>
                  <div className="text-gray-500 font-600">Attending Physician: <strong className="text-gray-900">{doctor.name}</strong></div>
                  <div className="text-gray-500 font-600">Designation: <strong className="text-gray-900">{doctor.title}</strong></div>
                  <div className="text-gray-500 font-600">Caregiver: <strong className="text-gray-900">{selectedPatientObj.caregiverName}</strong></div>
                </div>
              </div>

              {/* Cognitive Domain Scores */}
              <div>
                <h4 className="text-xs font-700 uppercase tracking-wider text-indigo-900 mb-2 border-b border-gray-200 pb-1">
                  1. Cognitive Domain Performance Summary
                </h4>
                <div className="grid grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Memory</span>
                    <div className="font-800 text-sm text-indigo-700">{cognitiveProfile.memory}%</div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Attention</span>
                    <div className="font-800 text-sm text-sky-700">{cognitiveProfile.attention}%</div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Language</span>
                    <div className="font-800 text-sm text-purple-700">{cognitiveProfile.language}%</div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Executive</span>
                    <div className="font-800 text-sm text-sage-700">{cognitiveProfile.executiveFunction}%</div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Visuospatial</span>
                    <div className="font-800 text-sm text-rose-700">{cognitiveProfile.visuospatial}%</div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Processing</span>
                    <div className="font-800 text-sm text-amber-700">{cognitiveProfile.processingSpeed}%</div>
                  </div>
                </div>
              </div>

              {/* Clinical Assessment Notes */}
              <div>
                <h4 className="text-xs font-700 uppercase tracking-wider text-indigo-900 mb-2 border-b border-gray-200 pb-1">
                  2. Clinical Evaluation Notes
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {activeReport.clinicalObservations}
                </p>
              </div>

              {/* Interventions & Recommendations */}
              <div>
                <h4 className="text-xs font-700 uppercase tracking-wider text-indigo-900 mb-2 border-b border-gray-200 pb-1">
                  3. Doctor Recommendations & Action Plan
                </h4>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                  {activeReport.recommendations.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Signature Block */}
              <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-xs">
                <div>
                  <p className="text-gray-400 text-[10px]">Confidential Medical Report — MindBridge Healthcare Platform</p>
                  <p className="text-gray-400 text-[10px]">Supportive performance indicator — Not a formal diagnostic conclusion.</p>
                </div>
                <div className="text-right">
                  <div className="h-8 border-b border-gray-400 w-40 mb-1" />
                  <p className="font-700 text-gray-900">{doctor.name}</p>
                  <p className="text-gray-500 text-[10px]">{doctor.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
