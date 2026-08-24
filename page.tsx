"use client"

import { useState, useEffect } from "react"
import {
  ShieldAlert,
  Activity,
  Terminal,
  Zap,
  AlertTriangle,
  RefreshCcw,
  Cpu,
  ChevronDown,
  CheckCircle2,
  BellRing
} from "lucide-react"
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from "recharts"

const driftHistory = [
  { time: "00:00", score: 0.10 },
  { time: "04:00", score: 0.12 },
  { time: "08:00", score: 0.35 },
  { time: "12:00", score: 0.28 },
  { time: "16:00", score: 0.45 },
  { time: "20:00", score: 0.31 },
]

const DESCRIPTIONS: any = {
  income: "Average yearly earnings. High drift indicates a change in customer purchasing power.",
  age: "Demographic shift. Suggests the model is seeing a different generation than trained.",
  credit_score: "User creditworthiness. Drift means the risk profile of applicants has changed.",
  loan_amount: "Total principal requested. Reflects shifts in market rates or inflation.",
  tenure_months: "The length of the loan. Suggests a move toward different financial commitments.",
  dependents: "Number of family members. Affects disposable income calculations.",
  monthly_debt: "Current monthly obligations. High drift is a red flag for potential defaults."
}

export default function DriftMonitor() {
  const [report, setReport] = useState<any>(null)
  const [showFailure, setShowFailure] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([
    "[SYS] Initialization Complete.",
    "[DB] Reference Data Loaded."
  ])

  useEffect(() => {
    fetch("http://localhost:8000/api/monitor")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReport(data)

          if (data.drift_detected) {
            setShowFailure(true)
            setLogs(prev => [
              ...prev,
              "!! ALERT: CRITICAL DRIFT DETECTED !!",
              `[SIG] Variance: ${(data.drift_score * 100).toFixed(1)}%`
            ])
          }
        }
      })
      .catch(() =>
        setLogs(prev => [...prev, "[ERR] Backend Connection Failed."])
      )
  }, [])

  const notifyDanger = () => {
    setLogs(prev => [
      ...prev,
      "[ACTION] Danger notification sent to AI users.",
      "[STATUS] Users Alerted Successfully."
    ])
    alert("DANGER NOTIFIED TO USER OF THE AI MODEL")
  }

  if (!report) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center font-mono text-blue-500">
      <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="tracking-[0.4em] animate-pulse uppercase text-xs">Loading System...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020204] text-slate-400 p-6 lg:p-10 font-mono">
      {/* ⚠️ FAILURE OVERLAY */}
      {showFailure && (
        <div className="fixed inset-0 z-[100] bg-red-950/40 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-black border-2 border-red-500 p-10 max-w-2xl w-full relative">
            <div className="flex items-center gap-5 text-red-500 mb-6 text-left">
              <AlertTriangle size={48} className="animate-pulse" />
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Drift Alert</h2>
                <div className="text-[10px] tracking-[0.3em] font-bold opacity-70 uppercase">
                  Model Reliability Compromised
                </div>
              </div>
            </div>

            <div className="text-slate-300 mb-8 border-l-2 border-red-500/30 pl-4 text-sm text-left">
              Significant variance detected between reference and production datasets. This
              notification indicates the model is no longer operating within safe parameters.
            </div>

            <button
              onClick={() => setShowFailure(false)}
              className="w-full bg-red-600 text-white font-bold py-4 hover:bg-red-700 transition-all uppercase text-xs tracking-widest"
            >
              Close System Warning
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto space-y-8 text-left">
        {/* UPDATED HEADER */}
        <header className="flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Activity size={16} />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-500">
                System Monitoring v1.0
              </span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
              Drift Monitoring System
            </h1>
          </div>

          <div className="hidden md:block text-right">
            <div className="text-slate-600 text-[10px] uppercase font-bold tracking-widest mb-1">Status</div>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              Live Monitoring
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0a0a0c] border border-white/5 p-8 relative">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">
                  Global Drift
                </div>
                <div className="text-6xl font-black text-white italic">
                  {(report.drift_score * 100).toFixed(1)}%
                </div>
                <Zap className="absolute bottom-4 right-4 text-blue-500/20" size={30} />
              </div>

              <div className="bg-[#0a0a0c] border border-white/5 p-8">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">
                  Integrity
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-1000"
                    style={{ width: `${Math.max(10, 100 - (report.drift_score * 100))}%` }}
                  ></div>
                </div>
                <div className="text-[10px] mt-4 text-blue-500 font-bold tracking-tighter uppercase">
                  Health: {(100 - (report.drift_score * 100)).toFixed(0)}%
                </div>
              </div>

              <div
                className={`p-8 border ${
                  report.drift_detected
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-emerald-500/30 bg-emerald-500/5"
                } flex flex-col justify-center items-center`}
              >
                <ShieldAlert
                  className={
                    report.drift_detected
                      ? "text-red-500 animate-pulse"
                      : "text-emerald-500"
                  }
                  size={40}
                />
                <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em]">
                  {report.drift_detected ? "Alert" : "Stable"}
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0c] border border-white/5 p-8">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-10">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Drift Trend Analysis
              </div>

              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={driftHistory}>
                    <defs>
                      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000",
                        border: "1px solid #222",
                        fontSize: "12px",
                        color: "#fff"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#glow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* LOGS & NEW NOTIFICATION BUTTON */}
          <div className="col-span-12 lg:col-span-4 bg-black border border-white/10 p-8 flex flex-col h-full min-h-[600px] text-left">
            <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-6 mb-6">
              <Terminal size={14} className="text-blue-500" />
              System Logs
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-[11px] leading-relaxed custom-scrollbar font-mono">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-slate-800 shrink-0">
                    [{new Date().toLocaleTimeString([], { hour12: false })}]
                  </span>
                  <span
                    className={
                      log.includes("!!") || log.includes("Danger")
                        ? "text-red-500 font-bold"
                        : "text-blue-400"
                    }
                  >
                    {log}
                  </span>
                </div>
              ))}
              <div className="w-2 h-4 bg-white/20 animate-pulse"></div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
              {/* THE NOTIFY BUTTON */}
              <button
                onClick={notifyDanger}
                className="w-full py-5 border-2 border-red-500/50 text-red-500 font-bold text-[10px] tracking-[0.4em] hover:bg-red-500 hover:text-white transition-all uppercase flex items-center justify-center gap-3 shadow-lg shadow-red-500/10"
              >
                <BellRing size={16} />
                Notify Danger to Users
              </button>

              <button className="w-full py-5 bg-blue-600 text-white font-bold text-[10px] tracking-[0.4em] hover:bg-blue-500 transition-all uppercase flex items-center justify-center gap-3">
                <RefreshCcw size={16} />
                Retrain AI Model
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-10 text-left">
          {Object.keys(report.column_details).map((col) => {
            const drifted = report.column_details[col].drift_detected
            const isExpanded = expanded === col

            return (
              <div
                key={col}
                onClick={() => setExpanded(isExpanded ? null : col)}
                className={`cursor-pointer transition-all p-6 border ${
                  isExpanded
                    ? "bg-[#0f172a]/40 border-blue-500 shadow-xl"
                    : "bg-[#0a0a0c] border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    {col.replace("_", " ")}
                  </span>
                  {drifted ? (
                    <ShieldAlert size={16} className="text-red-500" />
                  ) : (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  )}
                </div>

                <div className="flex justify-between items-end">
                  <div className="text-3xl font-black text-white italic">
                    {(report.column_details[col].drift_score * 100).toFixed(1)}%
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-700 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-white/5 text-[10px] text-slate-400 italic animate-in fade-in slide-in-from-top-2">
                    {DESCRIPTIONS[col]}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
