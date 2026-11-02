import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X, Upload, UserRound, FileText, Trash2, LoaderCircle, BriefcaseBusiness, Phone, Mail, Hash, CalendarDays, BadgeCheck, IdCard, CarFront, HeartHandshake } from "lucide-react";

const initialValues = (crew) => ({
    fullName: crew?.fullName || "",
    crewRole: crew?.crewRole || crew?.role || "",
    mobile: crew?.mobile || "",
    email: crew?.email || "",
    employeeCode: crew?.employeeCode || "",
    joiningDate: crew?.joiningDate?.slice?.(0, 10) || "",
    employmentType: crew?.employmentType === "permanent" ? "full-time" : crew?.employmentType || "",
    status: crew?.status || "available",
    drivingLicenseNumber: crew?.drivingLicenseNumber || "",
    licenseClass: crew?.licenseClass || "",
    vehicleType: crew?.vehicleType || "",
    licenseExpiryDate: crew?.licenseExpiryDate?.slice?.(0, 10) || "",
    emergencyName: crew?.emergencyContact?.name || "",
    emergencyRelationship: crew?.emergencyContact?.relationship || "",
    emergencyPhone: crew?.emergencyContact?.phone || "",
});

const FieldLabel = ({ children, icon: Icon, required = false }) => (
    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
        {Icon && <Icon size={13} className="shrink-0 text-teal-700" />}
        {children}{required && <span className="text-rose-500">*</span>}
    </span>
);

const CrewMemberForm = ({ crew = null, onClose, onSuccess }) => {
    const [values, setValues] = useState(() => initialValues(crew));
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [licenseDoc, setLicenseDoc] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [photoError, setPhotoError] = useState("");

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = previousOverflow; };
    }, []);

    const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    const validate = () => {
        if (!values.fullName.trim() || !values.crewRole.trim() || !values.mobile.trim() || !values.employeeCode.trim() || !values.joiningDate || !values.employmentType || !values.status) return "Complete all required crew details.";
        if (!/^\+?[\d\s()-]{10,18}$/.test(values.mobile.trim())) return "Enter a valid mobile number.";
        if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return "Enter a valid email address.";
        if (!crew && !profilePhoto) return "Upload a crew profile photo.";
        if (!crew && !licenseDoc) return "Upload the driving license document.";
        return "";
    };

    const submit = async (event) => {
        event.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); return; }
        setError("");
        setIsSaving(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
            const token = window.localStorage.getItem("exte_key");
            if (!baseUrl) throw new Error("API URL is not configured.");
            const form = new FormData();
            const payload = {
                fullName: values.fullName.trim(),
                crewRole: values.crewRole.trim(),
                mobile: values.mobile.trim(),
                email: values.email.trim(),
                employeeCode: values.employeeCode.trim(),
                joiningDate: values.joiningDate,
                employmentType: values.employmentType,
                status: values.status,
                drivingLicenseNumber: values.drivingLicenseNumber.trim(),
                licenseClass: values.licenseClass,
                vehicleType: values.vehicleType,
                licenseExpiryDate: values.licenseExpiryDate,
                emergencyContact: JSON.stringify({
                    name: values.emergencyName.trim(),
                    relationship: values.emergencyRelationship,
                    phone: values.emergencyPhone.trim(),
                }),
            };
            Object.entries(payload).forEach(([key, value]) => form.append(key, value));
            if (profilePhoto) form.append("profilePhoto", profilePhoto);
            if (licenseDoc) form.append("licenseDoc", licenseDoc);
            const response = await axios({
                method: crew ? "put" : "post",
                url: crew ? `${baseUrl}/agent/crews/${crew._id || crew.id}` : `${baseUrl}/agent/crews`,
                data: form,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            toast.success(response.data?.message || (crew ? "Crew member updated successfully." : "Crew member added successfully."));
            await onSuccess?.();
            onClose();
        } catch (requestError) {
            setError(requestError.response?.data?.message || requestError.message || "Could not save crew member.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10";
    const fields = [
        ["Full Name", "fullName", "text", true, UserRound], ["Crew Role", "crewRole", "text", true, BriefcaseBusiness],
        ["Mobile Number", "mobile", "tel", true, Phone], ["Email Address", "email", "email", false, Mail],
        ["Employee Code", "employeeCode", "text", true, Hash], ["Joining Date", "joiningDate", "date", true, CalendarDays],
    ];

    return <>
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[3px]" onMouseDown={(event) => event.target === event.currentTarget && !isSaving && onClose()} />
        <section role="dialog" aria-modal="true" aria-labelledby="crew-form-title" className="fixed left-1/2 top-1/2 z-50 flex h-[82vh] max-h-[calc(100dvh-32px)] w-[calc(100%-24px)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-teal-700"><UserRound size={20} /></div><div><h2 id="crew-form-title" className="text-base font-semibold text-slate-900">{crew ? "Edit Crew Member" : "Add Crew Member"}</h2><p className="mt-0.5 text-xs text-slate-500">Crew details, employment, license, and documents</p></div></div>
                <button type="button" disabled={isSaving} onClick={onClose} aria-label="Close form" className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 disabled:opacity-50"><X size={16} /></button>
            </header>
            <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="custom-scroll min-h-0 flex-1 overflow-y-auto">
                    <div className="grid gap-5 p-5 sm:p-6">
                        <section><h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Crew Information</h3><div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                            {fields.map(([label, name, type, required, Icon]) => <label key={name} className="block"><FieldLabel icon={Icon} required={required}>{label}</FieldLabel><input className={`${inputClass} mt-1.5`} type={type} name={name} value={values[name]} onChange={change} required={required} /></label>)}
                            <label className="block"><FieldLabel icon={BriefcaseBusiness} required>Employment Type</FieldLabel><select className={`${inputClass} mt-1.5`} name="employmentType" value={values.employmentType} onChange={change} required><option value="">Select employment type</option><option value="full-time">Full Time</option><option value="part-time">Part Time</option><option value="contract">Contract</option><option value="daily-wages">Daily Wages</option></select></label>
                            <label className="block"><FieldLabel icon={BadgeCheck} required>Status</FieldLabel><select className={`${inputClass} mt-1.5`} name="status" value={values.status} onChange={change} required><option value="available">Available</option><option value="assigned">Assigned</option><option value="not-available">Not available</option><option value="leave">Leave</option></select></label>
                        </div></section>
                        <section><h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">License Details</h3><div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                            <label className="block"><FieldLabel icon={IdCard}>Driving License Number</FieldLabel><input className={`${inputClass} mt-1.5`} name="drivingLicenseNumber" value={values.drivingLicenseNumber} onChange={change} /></label>
                            <label className="block"><FieldLabel icon={BadgeCheck}>License Class</FieldLabel><input className={`${inputClass} mt-1.5`} name="licenseClass" value={values.licenseClass} onChange={change} /></label>
                            <label className="block"><FieldLabel icon={CarFront}>Vehicle Type</FieldLabel><input className={`${inputClass} mt-1.5`} name="vehicleType" value={values.vehicleType} onChange={change} /></label>
                            <label className="block"><FieldLabel icon={CalendarDays}>License Expiry Date</FieldLabel><input className={`${inputClass} mt-1.5`} type="date" name="licenseExpiryDate" value={values.licenseExpiryDate} onChange={change} /></label>
                        </div></section>
                        <section><h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Emergency Contact</h3><div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                            <label className="block"><FieldLabel icon={UserRound}>Contact Name</FieldLabel><input className={`${inputClass} mt-1.5`} name="emergencyName" value={values.emergencyName} onChange={change} /></label>
                            <label className="block"><FieldLabel icon={HeartHandshake}>Relationship</FieldLabel><input className={`${inputClass} mt-1.5`} name="emergencyRelationship" value={values.emergencyRelationship} onChange={change} /></label>
                            <label className="block"><FieldLabel icon={Phone}>Contact Phone</FieldLabel><input className={`${inputClass} mt-1.5`} type="tel" name="emergencyPhone" value={values.emergencyPhone} onChange={change} /></label>
                        </div></section>
                        <section><h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Documents</h3><div className="grid gap-4 sm:grid-cols-2">
                            {[["Crew Profile Photo", profilePhoto, setProfilePhoto, ".png,.jpg,.jpeg", crew?.profilePhoto?.url], ["Driving License Document", licenseDoc, setLicenseDoc, ".pdf,.png,.jpg,.jpeg", crew?.licenseDoc?.url]].map(([label, file, setFile, accept, existingUrl]) => <div key={label} className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4"><p className="mb-2 text-xs font-medium text-slate-700">{label}</p>{label === "Crew Profile Photo" && <p className={`mb-2 text-[10px] ${photoError ? "text-rose-600" : "text-slate-500"}`}>{photoError || "Allowed formats: PNG, JPG, JPEG · Max size: 1 MB"}</p>}{file ? <div className="flex items-center gap-2 text-xs text-slate-600"><FileText size={16} /> <span className="flex-1 truncate">{file.name}</span><button type="button" onClick={() => { setFile(null); if (label === "Crew Profile Photo") setPhotoError(""); }} aria-label={`Remove ${label}`}><Trash2 size={14} className="text-rose-500" /></button></div> : <div className="flex items-center justify-between gap-2"><span className="truncate text-[10px] text-slate-500">{existingUrl ? "Current document attached" : "PNG, JPG, JPEG · Max 1 MB"}</span><label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100"><Upload size={13} />{existingUrl ? "Replace" : "Upload"}<input type="file" accept={accept} className="hidden" onChange={(event) => { const nextFile = event.target.files?.[0]; if (nextFile) { if (label === "Crew Profile Photo") { const allowedTypes = ["image/png", "image/jpeg"]; if (!allowedTypes.includes(nextFile.type)) setPhotoError("Profile photo must be a PNG, JPG, or JPEG image."); else if (nextFile.size > 1024 * 1024) setPhotoError("Profile photo must be 1 MB or smaller."); else { setPhotoError(""); setFile(nextFile); } } else { setFile(nextFile); } } event.target.value = ""; }} /></label></div>}</div>)}
                        </div></section>
                    </div>
                    {error && <p role="alert" className="px-5 pb-3 text-xs text-rose-600 sm:px-6">{error}</p>}
                </div>
                <footer className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6"><button type="button" disabled={isSaving} onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-teal-800 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-900 disabled:cursor-wait disabled:opacity-60">{isSaving && <LoaderCircle size={14} className="animate-spin" />}{isSaving ? "Saving..." : crew ? "Save Changes" : "Add Crew Member"}</button></footer>
            </form>
        </section>
    </>;
};

export default CrewMemberForm;



