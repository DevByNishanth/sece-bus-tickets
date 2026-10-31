// export default function AdminDashboardSidebar() {
//   const navItemClass =
//     "block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-[#078797]";

//   return (
//     <aside className="min-h-screen w-60 shrink-0 border-r border-[#dcebed] bg-white px-4 pt-10 pb-8">
//       <nav aria-label="Admin dashboard">
//         <div className="space-y-2 border border-[#dcebed] pb-3" bg-white >
//           {["Bus & Operator", "Bus Specifications", "Required Documents", "Fitness Certificate", "Operations & Maintenance", "Amenities"].map(
//             (item) => (
//               <div key={item} className={navItemClass}>
//                 {item}
//               </div>
//             )
//           )}

//           <div className={`${navItemClass} mt-2 pt-2`}>Approvals</div>
//           <a
//             href="/admin"
//             aria-current="page"
//             className={`${navItemClass} ml-1 w-[calc(100%-0.25rem)] bg-[#0E7A88] font-medium text-white hover:bg-[#0E7A88] hover:text-white`}
//           >
//             Bus Approval
//           </a>
//           <div className={`${navItemClass} pl-6`}>Travels Approval</div>
//         </div>
//       </nav>
//     </aside>
//   );
// }
