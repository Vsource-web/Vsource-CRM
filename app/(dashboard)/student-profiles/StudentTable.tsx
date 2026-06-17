'use client';

import React, { useState } from 'react';
import { Eye, Edit, Trash2, Shield, ShieldOff, FileText, ChevronRight } from 'lucide-react';
// import { Student } from '../lib/mockData';
import { DocumentItem } from './DMSSection';
import { Student } from './mockData';

export interface LocalStudent extends Student {
  password?: string;
  twelfthEnglishMoi?: string;
  documents: DocumentItem[];
}

interface StudentTableProps {
  students: LocalStudent[];
  isDarkMode: boolean;
  onSelectStudent: (id: string) => void;
  onEditStudent: (student: LocalStudent) => void;
  onDeleteStudent: (id: string) => void;
  onStatusChange: (id: string, field: string, value: any) => void;
}

export function StudentTable({
  students,
  isDarkMode,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onStatusChange
}: StudentTableProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePassword = (studentId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  // Student Progress Color Logic (Mandated by Prompt Guidelines)
  const getCellColorClass = (val: string) => {
    if (!val) return 'bg-white text-slate-800 border-slate-100 dark:bg-slate-900 dark:text-slate-205';
    const s = val.toLowerCase().trim();

    // GREEN (Deposit Paid, CAS Received, Visa Approved, Loan Sanctioned, Disbursed, Approved, Paid, Completed, Waived, Received)
    if ([
      'deposit paid', 'cas received', 'visa approved', 'loan sanctioned', 'disbursed',
      'approved', 'paid', 'completed', 'waived', 'received'
    ].includes(s) || s === 'disbursed' || s === 'sanctioned') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-250 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800';
    }

    // RED (Application Rejected, Student Dropped, Visa Rejected, File Closed, Rejected, Dropped, Cancelled, Hold)
    if ([
      'application rejected', 'student dropped', 'visa rejected', 'file closed',
      'rejected', 'dropped', 'cancelled', 'hold'
    ].includes(s)) {
      return 'bg-rose-100 text-rose-800 border-rose-250 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800';
    }

    // ORANGE (Student requested hold, Intake change requested, Waiting for documents, Deferred)
    if ([
      'student requested hold', 'intake change requested', 'waiting for documents',
      'deferred', 'paused'
    ].includes(s)) {
      return 'bg-orange-100 text-orange-850 border-orange-250 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-800';
    }

    // YELLOW (University Decision Pending, CAS Under Review, Visa Decision Pending, Applied, Under Review, Decision Pending)
    if ([
      'university decision pending', 'cas under review', 'visa decision pending',
      'applied', 'under review', 'decision pending', 'pending'
    ].includes(s) || (s.includes('pending') && !s.includes('not'))) {
      return 'bg-amber-100 text-amber-805 border-amber-250 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800';
    }

    // WHITE (Application Not Submitted, CAS Not Applied, Deposit Not Paid, Draft, Draft Pending, Not Required, Not Applied)
    return 'bg-white text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800';
  };

  const thBgClass = isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500';

  return (
    <div className="space-y-4" id="student-module-master-table">
      {/* Scrollable Container Wrapper with sticky name panels */}
      <div className="overflow-auto max-h-[70vh] rounded-3xl border border-slate-200/85 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-sm relative">
        <table className="w-full text-left text-xs border-collapse relative">
          {/* Header row with precise columns defined by User */}
          <thead className="text-[10px] uppercase font-black tracking-wider border-b whitespace-nowrap select-none sticky top-0 z-30">
            <tr>
              <th className={`px-3 py-3 text-center sticky top-0 left-0 z-[40] border-r shadow-[2px_0_5px_rgba(0,0,0,0.05)] w-14 ${thBgClass}`}>SNO</th>
              <th className={`px-4 py-3 sticky top-0 left-14 z-[40] border-r shadow-[2px_0_5px_rgba(0,0,0,0.05)] ${thBgClass}`}>Student Unique ID</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Counsellor Name</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Date of Admission</th>
              <th className={`px-5 py-3 sticky top-0 left-44 z-[40] border-r shadow-[2px_0_5px_rgba(0,0,0,0.05)] min-w-[160px] ${thBgClass}`}>Student Name</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Type of Application</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Passport Number</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Mobile Number</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Email ID</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Password</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Country</th>
              <th className={`px-4 py-3 text-center ${thBgClass}`}>Intake</th>
              <th className={`px-4 py-3 ${thBgClass}`}>12th English / MOI</th>
              
              {/* PRIMARY APP META SECTION */}
              <th className={`px-4 py-3 min-w-[150px] ${thBgClass}`}>Application Status</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Portal</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Application Date</th>
              <th className={`px-4 py-3 ${thBgClass}`}>University Name</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Course Name</th>
              <th className={`px-4 py-3 min-w-[150px] ${thBgClass}`}>Application Status</th>
              
              <th className={`px-4 py-3 ${thBgClass}`}>Deposit Status</th>
              <th className={`px-4 py-3 ${thBgClass}`}>IHS & Visa Paid Status</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Interview Status</th>
              <th className={`px-4 py-3 ${thBgClass}`}>CAS Status</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Visa Status</th>
              
              {/* FINANCES & LOANS METRICS */}
              <th className={`px-4 py-3 ${thBgClass}`}>Fintech Assignee</th>
              <th className={`px-4 py-3 ${thBgClass}`}>NBFC</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Loan Status</th>
              <th className={`px-4 py-3 ${thBgClass}`}>PF Status</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Sanctioned</th>
              <th className={`px-4 py-3 ${thBgClass}`}>Disbursed</th>
              <th className={`px-4 py-3 min-w-[185px] ${thBgClass}`}>Remarks</th>
              <th className={`px-5 py-3 text-right sticky top-0 right-0 z-[40] border-l ${thBgClass}`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 whitespace-nowrap">
            {students.length === 0 ? (
              <tr>
                <td colSpan={32} className="text-center py-12 text-xs text-slate-400 font-bold bg-white dark:bg-slate-900">
                  No registered active students found. Check filter exclusions.
                </td>
              </tr>
            ) : (
              students.map((student, idx) => {
                const firstApp = student.applications[0] || {
                  portal: 'Direct',
                  applicationDate: '15-Jun-2026',
                  university: 'N/A',
                  course: 'N/A',
                  status: 'Draft'
                };

                const latestRemark = student.remarks[student.remarks.length - 1]?.note || 'No active remarks';

                return (
                  <tr 
                    key={student.id}
                    className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors"
                  >
                    {/* SNO (Sticky left) */}
                    <td className="px-3 py-3.5 font-bold font-mono text-center text-slate-400 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                      {idx + 1}
                    </td>

                    {/* Student unique ID (Sticky left 14) */}
                    <td className="px-4 py-3.5 font-mono text-[11px] font-black tracking-wider text-slate-500 bg-white dark:bg-slate-900 sticky left-14 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                      STU{100 + Number(student.id)}
                    </td>

                    {/* Counsellor Name */}
                    <td className="px-4 py-3.5 font-semibold text-slate-600 dark:text-slate-300">
                      {student.counsellor}
                    </td>

                    {/* Date of Admission */}
                    <td className="px-4 py-3.5 text-slate-400 font-semibold font-mono text-[11px]">
                      {student.admissionDate}
                    </td>

                    {/* Student Name (Sticky left 44) */}
                    <td className="px-5 py-3.5 font-extrabold text-red-600 hover:underline cursor-pointer sticky left-44 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.03)] truncate max-w-[170px]" onClick={() => onSelectStudent(student.id)}>
                      {student.name}
                    </td>

                    {/* Type of Application */}
                    <td className="px-4 py-3.5 text-slate-500 font-semibold">
                      {student.applicationType || 'Undergrad'}
                    </td>

                    {/* Passport Number */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {student.passportNumber}
                    </td>

                    {/* Mobile Number */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {student.mobileNumber}
                    </td>

                    {/* Email ID */}
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-420">
                      {student.email}
                    </td>

                    {/* Password */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span>{visiblePasswords[student.id] ? (student.password || 'Pass@2026') : '••••••••'}</span>
                        <button 
                          onClick={() => togglePassword(student.id)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400"
                        >
                          {visiblePasswords[student.id] ? <ShieldOff className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                        </button>
                      </div>
                    </td>

                    {/* Country */}
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-350">
                      {student.country}
                    </td>

                    {/* Intake */}
                    <td className="px-4 py-3.5 text-center font-bold">
                      <span className="bg-slate-105 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                        {student.intake}
                      </span>
                    </td>

                    {/* 12th English / MOI */}
                    <td className="px-4 py-3.5 text-slate-500 font-medium">
                      {student.twelfthEnglishMoi || 'MOI Waiver Letter'}
                    </td>

                    {/* 14. Application Status overall */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getCellColorClass(firstApp.status)}`}>
                        {firstApp.status}
                      </span>
                    </td>

                    {/* Portal */}
                    <td className="px-4 py-3.5 font-mono font-bold text-[10px] text-red-600 bg-red-600/5 px-2 py-0.5 rounded">
                      {firstApp.portal}
                    </td>

                    {/* Application Date */}
                    <td className="px-4 py-3.5 font-mono text-[10px] text-slate-400">
                      {firstApp.applicationDate}
                    </td>

                    {/* University Name */}
                    <td className="px-4 py-3.5 text-slate-800 dark:text-slate-205 font-bold truncate max-w-[180px]" title={firstApp.university}>
                      {firstApp.university}
                    </td>

                    {/* Course Name */}
                    <td className="px-4 py-3.5 text-slate-550 dark:text-slate-400 truncate max-w-[150px]" title={firstApp.course}>
                      {firstApp.course}
                    </td>

                    {/* 19. Application Status */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getCellColorClass(firstApp.status)}`}>
                        {firstApp.status}
                      </span>
                    </td>

                    {/* Deposit Status */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getCellColorClass(student.visaDetails.depositStatus)}`}>
                        {student.visaDetails.depositStatus}
                      </span>
                    </td>

                    {/* IHS & Visa Paid Status */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getCellColorClass(student.visaDetails.ihsPayment)}`}>
                        {student.visaDetails.ihsPayment}
                      </span>
                    </td>

                    {/* Interview Status */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getCellColorClass(student.visaDetails.interviewStatus)}`}>
                        {student.visaDetails.interviewStatus}
                      </span>
                    </td>

                    {/* CAS Status */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getCellColorClass(student.visaDetails.casStatus)}`}>
                        {student.visaDetails.casStatus}
                      </span>
                    </td>

                    {/* Visa Status */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getCellColorClass(student.visaDetails.visaStatus)}`}>
                        {student.visaDetails.visaStatus}
                      </span>
                    </td>

                    {/* Fintech Assignee */}
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 font-medium font-mono text-[11px]">
                      {student.loan.assignee}
                    </td>

                    {/* NBFC */}
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-bold">
                      {student.loan.nbfc}
                    </td>

                    {/* Loan Status */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getCellColorClass(student.loan.status)}`}>
                        {student.loan.status}
                      </span>
                    </td>

                    {/* PF Status */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getCellColorClass(student.loan.pfStatus || 'Pending')}`}>
                        {student.loan.pfStatus || 'Pending'}
                      </span>
                    </td>

                    {/* Sanctioned */}
                    <td className="px-4 py-3.5 font-black text-slate-800 dark:text-slate-300 font-mono">
                      {student.loan.sanctionedAmount}
                    </td>

                    {/* Disbursed */}
                    <td className="px-4 py-3.5 font-bold text-emerald-600 font-mono">
                      {student.loan.disbursedAmount}
                    </td>

                    {/* Remarks timeline note */}
                    <td className="px-4 py-3.5 text-[11px] text-slate-500 max-w-[200px] truncate" title={latestRemark}>
                      {latestRemark}
                    </td>

                    {/* Actions sticky right */}
                    <td className="px-5 py-3.5 text-right sticky right-0 z-10 bg-white dark:bg-slate-900 border-l border-slate-205 dark:border-slate-800 shadow-[-2px_0_5px_rgba(0,0,0,0.035)]">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectStudent(student.id)}
                          className="bg-red-600/10 text-red-656 hover:bg-red-600 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide inline-flex items-center gap-0.5 transition-colors"
                          title="View complete student folders"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View Detail</span>
                        </button>

                        <button
                          onClick={() => onEditStudent(student)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1.5 rounded-lg text-[10px] font-black inline-flex items-center gap-0.5 transition-colors"
                          title="Edit Student Basic Information"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onDeleteStudent(student.id)}
                          className="bg-rose-500/10 hover:bg-rose-650 hover:bg-rose-600 hover:text-white text-rose-500 px-2 py-1.5 rounded-lg text-[10px] font-black transition-colors"
                          title="Delete Case File"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
