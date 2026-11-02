import { X, UserRound, FileText, Phone, Mail, BriefcaseBusiness, BadgeCheck, IdCard, CarFront, CalendarDays, ShieldCheck } from "lucide-react";

const SummaryCard = ({ label, value, icon: Icon }) => (
    <div className="rounded-xl border border-[#DCEAEC] bg-gradient-to-br from-[#F2FAFA] to-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-[#0E7A88]"><Icon size={14} /><p className="text-[10px] font-medium uppercase tracking-wide text-[#668184]">{label}</p></div>
        <p className="mt-2 break-words text-sm font-semibold capitalize text-[#183638]">{value || "—"}</p>
    </div>
);

const ContactItem = ({ label, value, icon: Icon }) => (
    <div className="flex min-w-0 items-center gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white"><Icon size={16} /></span>
        <div className="min-w-0"><p className="text-[9px] uppercase tracking-wide text-teal-100">{label}</p><p className="mt-1 truncate text-xs font-semibold text-white">{value || "—"}</p></div>
    </div>
);

const Detail = ({ label, value }) => <div className="rounded-lg border border-slate-100 bg-white p-3"><p className="text-[10px] text-slate-500">{label}</p><p className="mt-1 break-words text-xs font-medium capitalize text-slate-800">{value || "—"}</p></div>;

const FileLink = ({ label, file }) => {
    const url = typeof file === "string" ? file : file?.url;
    return <a href={url || undefined} target="_blank" rel="noreferrer" className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs ${url ? "border-[#DCEAEC] bg-[#F5FBFB] text-teal-800 hover:bg-teal-50" : "pointer-events-none border-slate-100 text-slate-400"}`}><FileText size={14} />{label}{url ? " · View" : " · Not uploaded"}</a>;
};

const DriverDetailsModal = ({ driver, onClose }) => {
    let emergencyContact = driver.emergencyContact;
    if (typeof emergencyContact === "string") {
        try { emergencyContact = JSON.parse(emergencyContact); } catch { emergencyContact = {}; }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section role="dialog" aria-modal="true" aria-labelledby="driver-details-title" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#EAF6F6] text-[#0E7A88] shadow-sm">{driver.profilePhoto?.url ? <img src={driver.profilePhoto.url} alt="Driver profile" className="h-full w-full object-cover" /> : <UserRound size={19} />}</div><div><h2 id="driver-details-title" className="text-sm font-semibold text-slate-900">{driver.fullName || "Driver details"}</h2><p className="text-xs text-slate-500">Driver profile</p></div></div>
                    <button type="button" aria-label="Close driver details" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"><X size={15} /></button>
                </header>
                <div className="custom-scroll space-y-4 overflow-y-auto bg-[#F7FAFA] p-4 sm:p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <SummaryCard label="Employment type" value={driver.employmentType} icon={BriefcaseBusiness} />
                        <SummaryCard label="Driver status" value={driver.status} icon={BadgeCheck} />
                        <SummaryCard label="Employee code" value={driver.employeeCode} icon={IdCard} />
                        <SummaryCard label="License class" value={driver.licenseClass} icon={ShieldCheck} />
                    </div>
                    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-[#0E7A88] to-[#12626B] shadow-sm"><div className="grid sm:grid-cols-2 sm:divide-x sm:divide-white/20"><ContactItem label="Driver name" value={driver.fullName} icon={UserRound} /><ContactItem label="Mobile number" value={driver.mobile} icon={Phone} /></div></div>
                    <section className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Contact & employment</h3><div className="grid gap-2 sm:grid-cols-2"><Detail label="Email address" value={driver.email} /><Detail label="Joining date" value={driver.joiningDate?.slice?.(0, 10)} /><Detail label="Emergency contact name" value={emergencyContact?.name} /><Detail label="Emergency relationship" value={emergencyContact?.relationship} /><Detail label="Emergency phone" value={emergencyContact?.phone} /></div></section>
                    <section className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">License & fitness</h3><div className="grid gap-2 sm:grid-cols-2"><Detail label="Driving license number" value={driver.drivingLicenseNumber} /><Detail label="Vehicle type" value={driver.vehicleType} /><Detail label="License expiry" value={driver.licenseExpiryDate?.slice?.(0, 10)} /><Detail label="Fitness certificate number" value={driver.fitnessCertificateNumber} /><Detail label="Fitness certificate expiry" value={driver.fitnessExpiryDate?.slice?.(0, 10)} /></div></section>
                    <section className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Documents</h3><div className="grid gap-2 sm:grid-cols-3"><FileLink label="Profile photo" file={driver.profilePhoto} /><FileLink label="Driving license" file={driver.licenseDoc} /><FileLink label="Fitness certificate" file={driver.fitnessCertificate} /></div></section>
                </div>
                <footer className="flex shrink-0 justify-end border-t border-slate-100 bg-white px-5 py-3"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Close</button></footer>
            </section>
        </div>
    );
};

export default DriverDetailsModal;
