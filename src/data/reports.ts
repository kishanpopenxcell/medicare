import type { MedicalReport } from "@/types"

export const reports: MedicalReport[] = [
  {
    id: "r-1",
    patientId: "p-1",
    title: "Annual Blood Panel",
    type: "Bloodwork",
    doctor: "Dr. Sarah Kim",
    facility: "MediCare Connect — Main Campus Lab",
    date: "2026-06-28",
    status: "final",
    findings:
      "All values within normal range. Cholesterol slightly elevated (LDL 118 mg/dL) — recommend dietary review at next visit. Vitamin D borderline low; supplementation suggested.",
    recommendation:
      "Reduce saturated fat intake, continue Vitamin D3 supplementation, recheck lipid panel in 6 months.",
    followUpDate: "2026-12-28",
    labValues: [
      { label: "LDL Cholesterol", value: "118 mg/dL", range: "< 100 mg/dL", flag: "high" },
      { label: "HDL Cholesterol", value: "58 mg/dL", range: "> 40 mg/dL", flag: "normal" },
      { label: "Vitamin D", value: "28 ng/mL", range: "30–100 ng/mL", flag: "low" },
      { label: "Fasting Glucose", value: "91 mg/dL", range: "70–99 mg/dL", flag: "normal" },
    ],
    attachments: [
      { name: "blood-panel-full-results.pdf", kind: "pdf", size: "412 KB" },
    ],
  },
  {
    id: "r-2",
    patientId: "p-1",
    title: "Chest X-Ray",
    type: "Imaging",
    doctor: "Dr. Marcus Webb",
    facility: "MediCare Connect — Radiology Center",
    date: "2026-05-14",
    status: "final",
    findings:
      "No acute cardiopulmonary abnormality. Lungs clear bilaterally. Heart size within normal limits. No further imaging indicated at this time.",
    recommendation: "No further action needed. Routine follow-up at next annual physical.",
    attachments: [
      { name: "chest-xray-frontal.jpg", kind: "image", size: "2.1 MB" },
      { name: "radiology-report.pdf", kind: "pdf", size: "180 KB" },
    ],
  },
  {
    id: "r-3",
    patientId: "p-1",
    title: "Cardiac Stress Test",
    type: "Cardiology",
    doctor: "Dr. Sarah Kim",
    facility: "MediCare Connect — Cardiology Suite",
    date: "2026-07-02",
    status: "pending-review",
    findings:
      "Test completed. Results pending physician review — report will be finalized within 2–3 business days.",
    recommendation: "Pending — recommendation will be added once the report is finalized.",
    attachments: [],
  },
  {
    id: "r-4",
    patientId: "p-1",
    title: "Allergy Panel",
    type: "Immunology",
    doctor: "Dr. Elena Cho",
    facility: "MediCare Connect — Immunology Clinic",
    date: "2026-03-09",
    status: "final",
    findings:
      "Mild sensitivity to pollen and dust mites detected. No food allergies identified. Antihistamine as-needed recommended during high-pollen season.",
    recommendation: "Over-the-counter antihistamine during spring season. Re-test in 2 years or if symptoms worsen.",
    labValues: [
      { label: "Pollen IgE", value: "0.8 kU/L", range: "< 0.35 kU/L", flag: "high" },
      { label: "Dust Mite IgE", value: "0.6 kU/L", range: "< 0.35 kU/L", flag: "high" },
      { label: "Food Panel IgE", value: "0.1 kU/L", range: "< 0.35 kU/L", flag: "normal" },
    ],
    attachments: [{ name: "allergy-panel-results.pdf", kind: "pdf", size: "298 KB" }],
  },
  {
    id: "r-5",
    patientId: "p-2",
    title: "Lipid Panel",
    type: "Bloodwork",
    doctor: "Dr. Sarah Kim",
    facility: "MediCare Connect — Main Campus Lab",
    date: "2026-06-20",
    status: "final",
    findings:
      "Total cholesterol 205 mg/dL, HDL 52 mg/dL. Slightly above target — follow-up in 6 months recommended.",
    recommendation: "Dietary modification and follow-up lipid panel in 6 months.",
    followUpDate: "2026-12-20",
    labValues: [
      { label: "Total Cholesterol", value: "205 mg/dL", range: "< 200 mg/dL", flag: "high" },
      { label: "HDL Cholesterol", value: "52 mg/dL", range: "> 40 mg/dL", flag: "normal" },
    ],
    attachments: [{ name: "lipid-panel-results.pdf", kind: "pdf", size: "205 KB" }],
  },
  {
    id: "r-6",
    patientId: "p-3",
    title: "MRI — Left Knee",
    type: "Imaging",
    doctor: "Dr. Marcus Webb",
    facility: "MediCare Connect — Radiology Center",
    date: "2026-06-30",
    status: "final",
    findings:
      "Mild meniscal wear consistent with age. No tear identified. Conservative management (physical therapy) recommended.",
    recommendation: "Begin physical therapy, reassess in 8 weeks if symptoms persist.",
    followUpDate: "2026-08-25",
    attachments: [
      { name: "knee-mri-sagittal.jpg", kind: "image", size: "3.4 MB" },
      { name: "mri-report.pdf", kind: "pdf", size: "220 KB" },
    ],
  },
]
