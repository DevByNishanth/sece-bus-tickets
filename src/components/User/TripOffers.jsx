import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Tag,
  ChevronRight,
  ChevronLeft,
  Zap,
  Plane,
  Check,
  X,
  Clock,
  ShieldCheck
} from 'lucide-react';
import {
  DEFAULT_OFFERS,
  generateUserOffers,
  fetchUserOffers,
//   getPersistentUserId
} from '../../services/offersService';

/**
 * TripOffers Component
 * 
 * Reusable, responsive trip offers widget matching exact travel booking design.
 * 
 * @param {Object} props
 * @param {string|number} [props.userId] - Optional unique user identifier. If omitted, uses persistent guest ID.
 * @param {Object} [props.user] - Optional user object { id, name, isNewUser, tripsCount }
 * @param {Array} [props.offers] - Optional pre-fetched offers array (overrides dynamic generation/API)
 * @param {string} [props.apiEndpoint] - Optional backend API endpoint for future integration
 * @param {Function} [props.onApplyOffer] - Callback fired when an offer is copied or applied: (offer) => void
 * @param {Function} [props.onViewAllOffers] - Custom callback when clicking "View all offers >"
 * @param {string} [props.title='Special offers just for you'] - Section heading
 * @param {string} [props.subtitle='Instant discounts available for direct checkout'] - Subtitle text
 * @param {string} [props.className=''] - Additional container classes
 * @param {'default'|'compact'|'grid'} [props.variant='default'] - Layout variant
 * @param {boolean} [props.showViewAll=true] - Toggle display of 'View all offers'
 */
export default function TripOffers({
  userId,
  user,
  offers: initialOffers,
  apiEndpoint,
  onApplyOffer,
  onViewAllOffers,
  title = 'Special offers just for you',
  subtitle = 'Instant discounts available for direct checkout',
  className = '',
  variant = 'default',
  showViewAll = true
}) {
  // Determine effective user ID for unique offer generation
  const effectiveUserId = useMemo(() => {
    if (userId) return String(userId);
    if (user && user.id) return String(user.id);
    // return getPersistentUserId();
  }, [userId, user]);

  // State management
  const [offersList, setOffersList] = useState(() => {
    if (initialOffers && Array.isArray(initialOffers) && initialOffers.length > 0) {
      return initialOffers;
    }
    return generateUserOffers(effectiveUserId, user);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOfferTerms, setSelectedOfferTerms] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const scrollContainerRef = useRef(null);

  // Fetch or regenerate offers when userId, user, or apiEndpoint changes
  useEffect(() => {
    if (initialOffers && Array.isArray(initialOffers)) {
      setOffersList(initialOffers);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchUserOffers(effectiveUserId, apiEndpoint)
      .then((data) => {
        if (isMounted) {
          setOffersList(data && data.length > 0 ? data : DEFAULT_OFFERS);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('[TripOffers] Failed to load offers:', err);
          setError('Failed to load personalized offers');
          setOffersList(DEFAULT_OFFERS);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [effectiveUserId, apiEndpoint, initialOffers]);

  // Handle coupon copy action with feedback
  const handleCopyCode = (offer, e) => {
    if (e) e.stopPropagation();
    const code = offer.code;

    // Clipboard copy
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }

    setCopiedCode(code);
    setToastMessage(`Coupon "${code}" copied to clipboard!`);

    if (onApplyOffer) {
      onApplyOffer(offer);
    }

    // Reset copy state after 2.5s
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2500);

    // Dismiss toast after 3s
    setTimeout(() => {
      setToastMessage((prev) => (prev && prev.includes(code) ? null : prev));
    }, 3000);
  };

  // Scroll controls for mobile / tablet carousel
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle view all click
  const handleOpenViewAll = () => {
    if (onViewAllOffers) {
      onViewAllOffers(offersList);
    } else {
      setIsModalOpen(true);
    }
  };

  // Theme styling helpers matching exact screenshot colors
  const getThemeConfig = (theme = 'teal', cardIndex = 0) => {
    switch (theme) {
      case 'amber':
      case 'orange':
        return {
          cardBorder: 'border-[#FDE68A]', // pastel yellow/amber border
          cardBg: 'bg-white',
          notchBorder: '#FDE68A',
          notchLeftBg: 'bg-white',
          notchRightBg: 'bg-white',
          iconBg: 'bg-[#FFFDF5]',
          iconBorder: 'border-[#FDE68A]',
          iconColor: 'text-[#F59E0B]',
          codeBadgeBg: 'bg-[#F97316] text-white', // bright orange pill
          tagBadgeBg: 'bg-[#FEF3C7] text-[#B45309]', // soft amber pill
          buttonBorder: 'border-[#D97706]/40 text-[#B45309] hover:bg-[#FFFBEB] hover:border-[#D97706]'
        };
      case 'blue':
      case 'sky':
        return {
          cardBorder: 'border-[#BAE6FD]', // pastel sky blue border
          cardBg: 'bg-white',
          notchBorder: '#BAE6FD',
          notchLeftBg: 'bg-white',
          notchRightBg: 'bg-white',
          iconBg: 'bg-[#F0F9FF]',
          iconBorder: 'border-[#BAE6FD]',
          iconColor: 'text-[#0284C7]',
          codeBadgeBg: 'bg-[#0284C7] text-white', // royal blue pill
          tagBadgeBg: 'bg-[#E0F2FE] text-[#0284C7]', // light sky blue pill
          buttonBorder: 'border-[#0284C7]/40 text-[#0284C7] hover:bg-[#F0F9FF] hover:border-[#0284C7]'
        };
      case 'teal':
      case 'emerald':
      case 'mint':
      default:
        return {
          cardBorder: 'border-[#9FE3D5]', // pastel mint/emerald border
          cardBg: 'bg-white',
          notchBorder: '#9FE3D5',
          notchLeftBg: cardIndex === 0 ? 'bg-[#EEFAF5]' : 'bg-white',
          notchRightBg: 'bg-white',
          iconBg: 'bg-white',
          iconBorder: 'border-[#9FE3D5]',
          iconColor: 'text-[#0D9488]',
          codeBadgeBg: 'bg-[#0B7A75] text-white', // dark teal pill
          tagBadgeBg: 'bg-[#D1FAE5] text-[#0B7A75]', // light mint pill
          buttonBorder: 'border-[#0D9488]/40 text-[#0B7A75] hover:bg-[#E6F8F3] hover:border-[#0D9488]'
        };
    }
  };

  // Render left icon matching screenshot
  const renderOfferIcon = (iconType, themeConfig) => {
    switch (iconType) {
      case 'zap':
      case 'lightning':
        return (
          <div
            className={`w-10 h-10 rounded-xl ${themeConfig.iconBg} border ${themeConfig.iconBorder} flex items-center justify-center shrink-0 shadow-2xs`}
          >
            <Zap size={18} className="text-[#F59E0B] fill-[#F59E0B]" />
          </div>
        );
      case 'plane':
      case 'flight':
      case 'return':
        return (
          <div
            className={`w-10 h-10 rounded-xl ${themeConfig.iconBg} border ${themeConfig.iconBorder} flex items-center justify-center shrink-0 shadow-2xs`}
          >
            <Plane size={18} className="text-[#0284C7] fill-[#0284C7]/20 -rotate-12" />
          </div>
        );
      case 'percent':
      default:
        return (
          <div
            className={`w-10 h-10 rounded-xl ${themeConfig.iconBg} border ${themeConfig.iconBorder} flex items-center justify-center shrink-0 shadow-2xs`}
          >
            <span className="text-[#0D9488] font-bold text-base leading-none select-none">%</span>
          </div>
        );
    }
  };

  // Filtered offers for modal view
  const modalFilteredOffers = useMemo(() => {
    if (activeCategoryFilter === 'all') return offersList;
    if (activeCategoryFilter === 'new') {
      return offersList.filter(
        (o) =>
          o.badgeText?.toLowerCase().includes('new') ||
          o.badgeText?.toLowerCase().includes('first') ||
          o.heading?.toLowerCase().includes('first') ||
          o.offerCategory?.toLowerCase().includes('new')
      );
    }
    if (activeCategoryFilter === 'expiring') {
      return offersList.filter(
        (o) =>
          o.isExpiring ||
          o.badgeText?.toLowerCase().includes('expir') ||
          o.offerCategory?.toLowerCase().includes('festive') ||
          o.badgeText?.toLowerCase().includes('festive')
      );
    }
    if (activeCategoryFilter === 'return') {
      return offersList.filter(
        (o) =>
          o.badgeText?.toLowerCase().includes('round') ||
          o.badgeText?.toLowerCase().includes('return') ||
          o.offerCategory?.toLowerCase().includes('round')
      );
    }
    return offersList;
  }, [offersList, activeCategoryFilter]);

  return (
    <section
      aria-label="Trip Offers"
      className={`relative w-full rounded-2xl sm:rounded-3xl border border-emerald-100/70 bg-gradient-to-r from-[#EDFAF5]/70 via-[#F7FCF9] to-white p-4 sm:p-5 md:p-6 shadow-xs transition-all ${className}`}
    >
      {/* Toast Notification for Instant Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check size={12} strokeWidth={3} />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        {/* Left: Tag Icon + Title + Subtitle */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E6F8F3] text-[#0D9488] flex items-center justify-center shrink-0 shadow-2xs"
            aria-hidden="true"
          >
            <Tag size={19} className="stroke-[2.2] -rotate-12" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: View All Offers Action */}
        {showViewAll && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleOpenViewAll}
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0E7A74] hover:text-[#085a55] transition-colors cursor-pointer py-1 px-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <span>View all offers</span>
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 xl:gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="relative p-3.5 sm:p-4 rounded-2xl border border-slate-200/70 bg-white/60 animate-pulse flex items-center justify-between gap-3 h-[78px]"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <div className="h-4 w-14 bg-slate-200 rounded" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
                <div className="h-3 w-3/4 bg-slate-200 rounded" />
              </div>
              <div className="h-7 w-16 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        /* Offers Row: Responsive Grid on Desktop / Smooth Swipeable Carousel on Mobile & Tab */
        <div className="relative group/carousel">
          {/* Mobile/Tab Scroll Arrows */}
          <div className="hidden sm:flex lg:hidden items-center justify-between absolute -top-11 right-28 gap-1 z-10">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition shadow-2xs cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition shadow-2xs cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex lg:grid lg:grid-cols-3 gap-3 sm:gap-3.5 xl:gap-4 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {offersList.slice(0, 3).map((offer, index) => {
              const themeConfig = getThemeConfig(offer.theme, index);
              const isCopied = copiedCode === offer.code;

              return (
                <div
                  key={offer.id || offer.code || index}
                  className={`relative flex items-center justify-between gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-2xl border ${themeConfig.cardBorder} ${themeConfig.cardBg} transition-all duration-200 hover:shadow-xs group min-w-[300px] xs:min-w-[320px] lg:min-w-0 flex-1 snap-start`}
                >
                  {/* Left Ticket Notch Cutout */}
                  <div
                    aria-hidden="true"
                    className={`absolute -left-[1px] top-1/2 -translate-y-1/2 w-2 h-4 sm:w-2.5 sm:h-4.5 ${themeConfig.notchLeftBg} rounded-r-full border-t border-b border-r pointer-events-none transition-colors`}
                    style={{ borderColor: themeConfig.notchBorder }}
                  />

                  {/* Right Ticket Notch Cutout */}
                  <div
                    aria-hidden="true"
                    className={`absolute -right-[1px] top-1/2 -translate-y-1/2 w-2 h-4 sm:w-2.5 sm:h-4.5 ${themeConfig.notchRightBg} rounded-l-full border-t border-b border-l pointer-events-none transition-colors`}
                    style={{ borderColor: themeConfig.notchBorder }}
                  />

                  {/* Card Content Left: Icon + Badges + Description */}
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    {/* Visual Icon */}
                    {renderOfferIcon(offer.iconType, themeConfig)}

                    {/* Text Column */}
                    <div className="flex flex-col min-w-0 flex-1">
                      {/* Badges Row */}
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        {/* Coupon Code Pill */}
                        <span
                          className={`font-bold text-xs px-2 sm:px-2.5 py-0.5 rounded-md tracking-wider uppercase select-all ${themeConfig.codeBadgeBg}`}
                        >
                          {offer.offerCode || offer.code}
                        </span>

                        {/* Tag/Heading Pill */}
                        {(offer.heading || offer.badgeText) && (
                          <span
                            className={`font-semibold text-[11px] px-2 py-0.5 rounded-md tracking-tight ${themeConfig.tagBadgeBg}`}
                          >
                            {offer.heading || offer.badgeText}
                          </span>
                        )}
                      </div>

                      {/* Offer Description */}
                      <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-tight line-clamp-2">
                        {offer.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Content Right: Copy Action Button */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(offer, e)}
                    className={`shrink-0 ml-1.5 px-3.5 sm:px-4 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 select-none shadow-2xs border ${
                      isCopied
                        ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-200'
                        : `${themeConfig.buttonBorder}`
                    }`}
                    title={`Copy code ${offer.code}`}
                    aria-label={`Copy coupon code ${offer.code}`}
                  >
                    {isCopied ? (
                      <span className="flex items-center gap-1">
                        <Check size={12} strokeWidth={3} />
                        <span>Copied</span>
                      </span>
                    ) : (
                      'Copy'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* "View All Offers" Modal Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F8F3] text-[#0D9488] flex items-center justify-center">
                  <Tag size={18} />
                </div>
                <div>
                  <h3 id="modal-title" className="font-bold text-slate-900 text-base sm:text-lg">
                    All Available Trip Offers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Exclusive personalized discounts for your booking
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
                aria-label="Close offers modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-slate-100 overflow-x-auto scrollbar-none bg-slate-50/50">
              {[
                { id: 'all', label: 'All Offers' },
                { id: 'new', label: 'New User' },
                { id: 'expiring', label: 'Expiring Soon' },
                { id: 'return', label: 'Round-Trip' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition cursor-pointer shrink-0 ${
                    activeCategoryFilter === cat.id
                      ? 'bg-[#0B7A75] text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Modal Offers List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
              {modalFilteredOffers.map((offer, idx) => {
                const themeConfig = getThemeConfig(offer.theme, idx);
                const isCopied = copiedCode === offer.code;

                return (
                  <div
                    key={offer.id || idx}
                    className={`relative p-4 rounded-2xl border ${themeConfig.cardBorder} ${themeConfig.cardBg} transition-all`}
                  >
                    {/* Ticket Notches */}
                    <div
                      className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-2.5 h-5 bg-white rounded-r-full border-t border-b border-r"
                      style={{ borderColor: themeConfig.notchBorder }}
                    />
                    <div
                      className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-2.5 h-5 bg-white rounded-l-full border-t border-b border-l"
                      style={{ borderColor: themeConfig.notchBorder }}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {renderOfferIcon(offer.iconType, themeConfig)}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className={`font-bold text-xs px-2.5 py-0.5 rounded-md tracking-wider uppercase ${themeConfig.codeBadgeBg}`}
                            >
                              {offer.offerCode || offer.code}
                            </span>
                            {(offer.heading || offer.badgeText) && (
                              <span
                                className={`font-semibold text-[11px] px-2 py-0.5 rounded-md ${themeConfig.tagBadgeBg}`}
                              >
                                {offer.heading || offer.badgeText}
                              </span>
                            )}
                            {(offer.validTill || offer.validUntil) && (
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock size={11} /> Valid till {offer.validTill || offer.validUntil}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-800">
                            {offer.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOfferTerms(
                              selectedOfferTerms === (offer.offerCode || offer.code) ? null : (offer.offerCode || offer.code)
                            )
                          }
                          className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 px-2 py-1 cursor-pointer"
                        >
                          {selectedOfferTerms === (offer.offerCode || offer.code) ? 'Hide T&C' : 'View T&C'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(offer, e)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                            isCopied
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : `${themeConfig.buttonBorder}`
                          }`}
                        >
                          {isCopied ? 'Copied ✓' : 'Copy Code'}
                        </button>
                      </div>
                    </div>

                    {/* Terms & Conditions Accordion */}
                    {selectedOfferTerms === (offer.offerCode || offer.code) && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600 space-y-1 bg-white/70 p-2.5 rounded-xl">
                        <p className="font-semibold text-slate-700">Terms & Conditions:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                          {(offer.termsAndConditions || offer.terms || []).map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Discounts automatically applied at checkout step
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
