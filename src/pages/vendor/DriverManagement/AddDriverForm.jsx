
import { useEffect, useState } from "react";

import {
    X,
    ChevronRight,
    ChevronLeft,
    Check,
    Info,
    Upload,
    User,
    FileText,
    Trash2,
    ShieldCheck,
    ChevronDown,
} from "lucide-react";

import sheild from "../../../assets/sheild.svg";
import CustomDatePicker from "../../../components/CustomDatePicker";


// --------------------------------------------------
// Reusable Input Component
// --------------------------------------------------

const FormInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
}) => {
    return (
        <div className="w-full">
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
            />
        </div>
    );
};


// --------------------------------------------------
// Custom Dropdown Component
// --------------------------------------------------

const CustomDropdown = ({
    label,
    value,
    options,
    onChange,
    placeholder = "Select an option",
    required = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full">

            <label className="mb-1.5 block text-xs font-medium text-slate-700">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition hover:border-slate-300 focus:border-teal-600"
            >
                <span className={value ? "text-slate-700" : "text-slate-400"}>
                    {value || placeholder}
                </span>

                <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <>
                    {/* Clicking outside closes the dropdown */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg">

                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-xs transition hover:bg-teal-50 hover:text-teal-800 ${
                                    value === option
                                        ? "bg-teal-50 font-medium text-teal-800"
                                        : "text-slate-600"
                                }`}
                            >
                                {option}

                                {value === option && (
                                    <Check size={14} />
                                )}
                            </button>
                        ))}

                    </div>
                </>
            )}
        </div>
    );
};


// --------------------------------------------------
// Profile Image Upload Component
// --------------------------------------------------

const ProfileImageUpload = ({ file, setFile }) => {
    const [error, setError] = useState("");

    const [preview, setPreview] = useState("");

    // Create an image preview when a file is selected
    useEffect(() => {
        if (!file) {
            setPreview("");
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);

        // Release the preview URL when the file changes
        return () => URL.revokeObjectURL(imageUrl);
    }, [file]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) return;

        const allowedTypes = ["image/png", "image/jpeg"];

        if (!allowedTypes.includes(selectedFile.type)) {
            setError("Please select a PNG, JPG, or JPEG image.");
            event.target.value = "";
            return;
        }

        setError("");
        setFile(selectedFile);

        // Allow the same file to be selected again later
        event.target.value = "";
    };

    return (
        <div>

            <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Profile Image
            </label>

            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-3">

                {/* Image Preview */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">

                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <User size={24} className="text-slate-300" />
                    )}

                </div>

                <div className="min-w-0 flex-1">

                    {file ? (
                        <>
                            <p className="truncate text-xs font-medium text-slate-700">
                                {file.name}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setFile(null);
                                    setError("");
                                }}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
                            >
                                <Trash2 size={12} />
                                Remove image
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-xs font-medium text-slate-700">
                                Upload profile photo
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">
                                PNG, JPG, or JPEG
                            </p>

                            <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100">
                                <Upload size={13} />
                                Choose Image

                                <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </>
                    )}

                </div>

            </div>

            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
};


// --------------------------------------------------
// Document Upload Component
// --------------------------------------------------

const DocumentUpload = ({
    label,
    file,
    setFile,
    maxSize = 1,
    allowedTypes = ["png", "jpg", "jpeg"],
}) => {
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) return;

        // Get the file extension
        const extension = selectedFile.name
            .split(".")
            .pop()
            .toLowerCase();

        // Validate file format
        if (!allowedTypes.includes(extension)) {
            setError(
                `Allowed formats: ${allowedTypes.join(", ").toUpperCase()}`
            );

            event.target.value = "";
            return;
        }

        // Validate file size
        if (selectedFile.size > maxSize * 1024 * 1024) {
            setError(`File size must not exceed ${maxSize} MB.`);

            event.target.value = "";
            return;
        }

        setFile(selectedFile);
        setError("");

        event.target.value = "";
    };

    return (
        <div>

            <label className="mb-1.5 block text-xs font-medium text-slate-700">
                {label}

                <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-4">

                {file ? (

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                            <FileText size={20} />
                        </div>

                        <div className="min-w-0 flex-1">

                            <p className="truncate text-xs font-medium text-slate-700">
                                {file.name}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>

                        </div>

                        <button
                            type="button"
                            title="Remove file"
                            onClick={() => {
                                setFile(null);
                                setError("");
                            }}
                            className="rounded-md p-2 text-red-500 transition hover:bg-red-50"
                        >
                            <Trash2 size={15} />
                        </button>

                    </div>

                ) : (

                    <label className="flex cursor-pointer flex-col items-center justify-center py-3 text-center">

                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                            <Upload size={18} />
                        </div>

                        <p className="text-xs font-medium text-slate-700">
                            Click to upload document
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                            {allowedTypes.join(", ").toUpperCase()}
                            {" · "}
                            Maximum {maxSize} MB
                        </p>

                        <input
                            type="file"
                            accept={allowedTypes.map((type) => `.${type}`).join(",")}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                    </label>

                )}

            </div>

            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
};


// ==================================================
// MAIN ADD DRIVER FORM
// ==================================================

const AddDriverForm = ({ onClose }) => {

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    // All text, dropdown, and date field values
    const [formData, setFormData] = useState({
        agentId: "",
        fullName: "",
        mobile: "",
        email: "",

        licenseNumber: "",
        licenseClass: "",
        vehicleType: "",
        licenseExpiry: "",

        emergencyName: "",
        relationship: "",
        emergencyMobile: "",

        employeeCode: "",
        joiningDate: "",
        employmentType: "",
    });

    // Uploaded files
    const [profileImage, setProfileImage] = useState(null);
    const [licenseDocument, setLicenseDocument] = useState(null);
    const [fitnessCertificate, setFitnessCertificate] = useState(null);

    const steps = [
        {
            title: "Basic Details",
            description: "Identity & contact",
        },
        {
            title: "License Details",
            description: "License information",
        },
        {
            title: "Emergency Contact",
            description: "Emergency details",
        },
        {
            title: "Employment Details",
            description: "Employment information",
        },
        {
            title: "Documents",
            description: "Required documents",
        },
        {
            title: "Review",
            description: "Confirm details",
        },
    ];

    // Update input fields
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    // Update custom dropdown fields
    const handleDropdownChange = (name, value) => {
        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    // Move to next step
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Move to previous step
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Display review information
    const reviewFields = [
        { label: "Agent ID", value: formData.agentId },
        { label: "Full Name", value: formData.fullName },
        { label: "Mobile Number", value: formData.mobile },
        { label: "Email Address", value: formData.email },
        { label: "License Number", value: formData.licenseNumber },
        { label: "License Class", value: formData.licenseClass },
        { label: "Vehicle Type", value: formData.vehicleType },
        { label: "License Expiry", value: formData.licenseExpiry },
        { label: "Emergency Contact", value: formData.emergencyName },
        { label: "Relationship", value: formData.relationship },
        { label: "Emergency Mobile", value: formData.emergencyMobile },
        { label: "Employee Code", value: formData.employeeCode },
        { label: "Joining Date", value: formData.joiningDate },
        { label: "Employment Type", value: formData.employmentType },
    ];

    return (
        <>

            {/* Background Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[4px]"
                onClick={onClose}
            />

            {/* Main Modal */}
            <div className="fixed left-1/2 top-1/2 z-50 flex h-[calc(100vh-32px)] w-[calc(100%-24px)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[90%] lg:w-[85%]">

                {/* Header */}
                <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                            <img
                                src={sheild}
                                alt="Driver setup"
                                className="h-5 w-5 object-contain"
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                                Add Driver Details
                            </h2>

                            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                                Verify driver details, license information, and employment
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close Add Driver form"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                    >
                        <X size={16} />
                    </button>

                </header>


                {/* Main Content */}
                <div className="custom-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-white p-3 sm:p-5 md:flex-row">

                    {/* LEFT SIDEBAR */}
                    <aside className="flex w-full shrink-0 flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-4 md:w-56 lg:w-60">

                        <div className="mb-3 flex items-center justify-between">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                Driver Setup
                            </p>

                            <p className="text-[10px] text-slate-500">
                                Step {currentStep + 1} of {steps.length}
                            </p>

                        </div>

                        {/* Progress Bar */}
                        <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-slate-200">

                            <div
                                className="h-full rounded-full bg-teal-700 transition-all duration-300"
                                style={{
                                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                                }}
                            />

                        </div>

                        {/* Step Navigation */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">

                            {steps.map((step, index) => {

                                const isActive = currentStep === index;
                                const isCompleted = currentStep > index;

                                return (
                                    <button
                                        key={step.title}
                                        type="button"
                                        onClick={() => setCurrentStep(index)}
                                        className={`flex min-w-36 shrink-0 items-center gap-2.5 rounded-lg border p-2 text-left transition md:min-w-0 ${
                                            isActive
                                                ? "border-teal-100 bg-teal-50/80"
                                                : "border-transparent hover:bg-white"
                                        }`}
                                    >

                                        <div
                                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                                                isActive || isCompleted
                                                    ? "border-teal-800 bg-teal-800 text-white"
                                                    : "border-slate-200 bg-white text-slate-500"
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <Check size={13} />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>

                                        <div className="min-w-0">

                                            <p className="whitespace-nowrap text-[11px] font-medium text-slate-800">
                                                {step.title}
                                            </p>

                                            <p className="mt-0.5 hidden text-[9px] text-slate-400 md:block">
                                                {step.description}
                                            </p>

                                        </div>

                                    </button>
                                );
                            })}

                        </div>

                       

                    </aside>


                    {/* RIGHT FORM CONTENT */}
                    <main className="min-h-[320px] min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">

                        {/* Section Heading */}
                        <div className="mb-6">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">
                                STEP {currentStep + 1}
                            </p>

                            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                                {steps[currentStep].title}
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                {currentStep === 0 &&
                                    "Start with the driver's identity and contact information."}

                                {currentStep === 1 &&
                                    "Enter the driving license and vehicle qualification information."}

                                {currentStep === 2 &&
                                    "Provide emergency contact information."}

                                {currentStep === 3 &&
                                    "Enter employee identification and employment information."}

                                {currentStep === 4 &&
                                    "Upload the required driver documents."}

                                {currentStep === 5 &&
                                    "Review the information before completing registration."}
                            </p>

                        </div>


                        {/* ================================== */}
                        {/* STEP 1: BASIC DETAILS */}
                        {/* ================================== */}

                        {currentStep === 0 && (

                            <div className="space-y-5">

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <FormInput
                                        label="Agent ID"
                                        name="agentId"
                                        placeholder="Enter agent ID"
                                        value={formData.agentId}
                                        onChange={handleChange}
                                        required
                                    />

                                    <FormInput
                                        label="Full Name"
                                        name="fullName"
                                        placeholder="Name exactly in the driving license"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />

                                    <FormInput
                                        label="Mobile Number"
                                        name="mobile"
                                        type="tel"
                                        placeholder="Enter mobile number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                    />

                                    <FormInput
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="border-t border-slate-100 pt-4">

                                    <ProfileImageUpload
                                        file={profileImage}
                                        setFile={setProfileImage}
                                    />

                                </div>

                            </div>

                        )}


                        {/* ================================== */}
                        {/* STEP 2: LICENSE DETAILS */}
                        {/* ================================== */}

                        {currentStep === 1 && (

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <FormInput
                                    label="Driving License Number"
                                    name="licenseNumber"
                                    placeholder="Enter license number"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    required
                                />

                                <CustomDropdown
                                    label="License Class"
                                    value={formData.licenseClass}
                                    onChange={(value) =>
                                        handleDropdownChange("licenseClass", value)
                                    }
                                    placeholder="Select license class"
                                    options={[
                                        "MCWOG - Two Wheeler Without Gear",
                                        "MCWG - Two Wheeler With Gear",
                                        "LMV - Light Motor Vehicle",
                                        "HMV - Heavy Motor Vehicle",
                                        "HGMV - Heavy Goods Motor Vehicle",
                                        "HPMV - Heavy Passenger Motor Vehicle",
                                        "Transport Vehicle",
                                    ]}
                                    required
                                />

                                <CustomDropdown
                                    label="Vehicle Type"
                                    value={formData.vehicleType}
                                    onChange={(value) =>
                                        handleDropdownChange("vehicleType", value)
                                    }
                                    placeholder="Select vehicle type"
                                    options={[
                                        "Two Wheeler",
                                        "Car",
                                        "Van",
                                        "Mini Bus",
                                        "Bus",
                                        "Heavy Truck",
                                        "Other",
                                    ]}
                                    required
                                />

                                <CustomDatePicker
                                    label="License Expiry Date"
                                    name="licenseExpiry"
                                    value={formData.licenseExpiry}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="sm:col-span-2">

                                    <div className="flex items-start gap-2 rounded-lg border border-teal-100 bg-teal-50/50 p-3">

                                        <Info
                                            size={15}
                                            className="mt-0.5 shrink-0 text-teal-700"
                                        />

                                        <p className="text-[10px] leading-relaxed text-slate-600">
                                            Ensure the license class matches the vehicle the driver is authorized to operate. Upload the license document in the Documents step.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* ================================== */}
                        {/* STEP 3: EMERGENCY CONTACT */}
                        {/* ================================== */}

                        {currentStep === 2 && (

                            <div className="space-y-4">

                                <div className="rounded-lg border border-slate-200 p-4">

                                    <h3 className="mb-4 text-xs font-semibold text-slate-800">
                                        Emergency Contact Information
                                    </h3>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        <FormInput
                                            label="Contact Name"
                                            name="emergencyName"
                                            placeholder="Enter contact person's name"
                                            value={formData.emergencyName}
                                            onChange={handleChange}
                                            required
                                        />

                                        <CustomDropdown
                                            label="Relationship"
                                            value={formData.relationship}
                                            onChange={(value) =>
                                                handleDropdownChange("relationship", value)
                                            }
                                            placeholder="Select relationship"
                                            options={[
                                                "Father",
                                                "Mother",
                                                "Spouse",
                                                "Brother",
                                                "Sister",
                                                "Son",
                                                "Daughter",
                                                "Friend",
                                                "Other",
                                            ]}
                                            required
                                        />

                                        <div className="sm:col-span-2">

                                            <FormInput
                                                label="Emergency Mobile Number"
                                                name="emergencyMobile"
                                                type="tel"
                                                placeholder="Enter emergency contact number"
                                                value={formData.emergencyMobile}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                    </div>

                                </div>

                                <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">

                                    <Info
                                        size={15}
                                        className="mt-0.5 shrink-0 text-slate-500"
                                    />

                                    <p className="text-[10px] leading-relaxed text-slate-500">
                                        Provide a contact number that can be reached in case of an emergency.
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* ================================== */}
                        {/* STEP 4: EMPLOYMENT DETAILS */}
                        {/* ================================== */}

                        {currentStep === 3 && (

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <FormInput
                                    label="Employee Code"
                                    name="employeeCode"
                                    placeholder="Enter employee code"
                                    value={formData.employeeCode}
                                    onChange={handleChange}
                                    required
                                />

                                <CustomDatePicker
                                    label="Joining Date"
                                    name="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="sm:col-span-2">

                                    <CustomDropdown
                                        label="Employment Type"
                                        value={formData.employmentType}
                                        onChange={(value) =>
                                            handleDropdownChange("employmentType", value)
                                        }
                                        placeholder="Select employment type"
                                        options={[
                                            "Full Time",
                                            "Part Time",
                                            "Contract",
                                        ]}
                                        required
                                    />

                                </div>

                            </div>

                        )}


                        {/* ================================== */}
                        {/* STEP 5: DOCUMENTS */}
                        {/* ================================== */}

                        {currentStep === 4 && (

                            <div className="space-y-5 max-h-[340px] overflow-auto">

                                <div>

                                    <h3 className="mb-1 text-xs font-semibold text-slate-800">
                                        Driving License Document
                                    </h3>

                                    <p className="mb-3 text-[10px] text-slate-500">
                                        Upload a clear image of the driving license.
                                    </p>

                                    <DocumentUpload
                                        label="Driving License"
                                        file={licenseDocument}
                                        setFile={setLicenseDocument}
                                        maxSize={1}
                                        allowedTypes={["png", "jpg", "jpeg"]}
                                    />

                                </div>

                                <div className="border-t border-slate-100 pt-4">

                                    <h3 className="mb-1 text-xs font-semibold text-slate-800">
                                        Fitness Certificate
                                    </h3>

                                    <p className="mb-3 text-[10px] text-slate-500">
                                        Upload the driver's fitness certificate.
                                    </p>

                                    <DocumentUpload
                                        label="Fitness Certificate"
                                        file={fitnessCertificate}
                                        setFile={setFitnessCertificate}
                                        maxSize={5}
                                        allowedTypes={[
                                            "pdf",
                                            "png",
                                            "jpg",
                                            "jpeg",
                                        ]}
                                    />

                                </div>

                            </div>

                        )}


                        {/* ================================== */}
                        {/* STEP 6: REVIEW */}
                        {/* ================================== */}

                        {currentStep === 5 && (

                            <div className="space-y-5 max-h-[340px] overflow-auto">

                                {/* Driver Summary */}
                                <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-50 text-teal-700">

                                        {profileImage ? (
                                            <ProfileImagePreview file={profileImage} />
                                        ) : (
                                            <User size={22} />
                                        )}

                                    </div>

                                    <div className="min-w-0">

                                        <h3 className="truncate text-sm font-semibold text-slate-900">
                                            {formData.fullName || "Driver name not entered"}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {formData.agentId || "No Agent ID"}
                                        </p>

                                    </div>

                                </div>

                                {/* Review Fields */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                    {reviewFields.map((item) => (

                                        <div
                                            key={item.label}
                                            className="rounded-lg bg-slate-50 p-3"
                                        >

                                            <p className="text-[10px] text-slate-500">
                                                {item.label}
                                            </p>

                                            <p className="mt-1 break-words text-xs font-medium text-slate-800">
                                                {item.value || "Not provided"}
                                            </p>

                                        </div>

                                    ))}

                                </div>

                                {/* Uploaded Documents */}
                                <div className="rounded-lg border border-slate-200 p-4">

                                    <h3 className="mb-3 text-xs font-semibold text-slate-800">
                                        Uploaded Documents
                                    </h3>

                                    <div className="space-y-3">

                                        <ReviewFile
                                            label="Profile Image"
                                            file={profileImage}
                                        />

                                        <ReviewFile
                                            label="Driving License"
                                            file={licenseDocument}
                                        />

                                        <ReviewFile
                                            label="Fitness Certificate"
                                            file={fitnessCertificate}
                                        />

                                    </div>

                                </div>

                                {/* Review Note */}
                                <div className="flex items-start gap-2 rounded-lg border border-teal-100 bg-teal-50 p-3">

                                    <ShieldCheck
                                        size={16}
                                        className="mt-0.5 shrink-0 text-teal-700"
                                    />

                                    <p className="text-[10px] leading-relaxed text-slate-600">
                                        Review all information before completing registration. Ensure the driver's name matches the driving license.
                                    </p>

                                </div>

                            </div>

                        )}

                    </main>

                </div>


                {/* FOOTER */}
                <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-6">

                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                    >
                        <ChevronLeft size={15} />
                        Previous
                    </button>

                    <div className="flex items-center gap-3">

                        <span className="hidden text-[10px] text-slate-500 sm:block">
                            Step {currentStep + 1} of {steps.length}
                        </span>

                        {currentStep < steps.length - 1 ? (

                            <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex items-center gap-2 rounded-lg bg-teal-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-900"
                            >
                                Save & Continue
                                <ChevronRight size={15} />
                            </button>

                        ) : (

                            <button
                                type="button"
                                onClick={() => {
                                    console.log("Driver Form Data:", formData);
                                    console.log("Profile Image:", profileImage);
                                    console.log("License Document:", licenseDocument);
                                    console.log("Fitness Certificate:", fitnessCertificate);
                                }}
                                className="inline-flex items-center gap-2 rounded-lg bg-teal-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-900"
                            >
                                Complete Setup
                                <Check size={15} />
                            </button>

                        )}

                    </div>

                </footer>

            </div>

        </>
    );
};


// --------------------------------------------------
// Profile Image Preview for Review Section
// --------------------------------------------------

const ProfileImagePreview = ({ file }) => {
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (!file) {
            setPreview("");
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);

        return () => URL.revokeObjectURL(imageUrl);
    }, [file]);

    if (!preview) {
        return <User size={22} />;
    }

    return (
        <img
            src={preview}
            alt="Driver profile"
            className="h-full w-full object-cover"
        />
    );
};


// --------------------------------------------------
// Uploaded File Name for Review Section
// --------------------------------------------------

const ReviewFile = ({ label, file }) => {
    return (
        <div className="flex items-center gap-2 text-xs">

            <FileText
                size={15}
                className="shrink-0 text-teal-700"
            />

            <span className="text-slate-500">
                {label}:
            </span>

            <span className="min-w-0 flex-1 truncate font-medium text-slate-800">
                {file ? file.name : "Not uploaded"}
            </span>

        </div>
    );
};

export default AddDriverForm;
