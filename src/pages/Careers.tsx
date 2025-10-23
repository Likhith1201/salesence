import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ICONS
const Briefcase = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);
const Users = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);
const TrendingUp = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
);
const BookOpen = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);
const ChevronDown = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m6 9 6 6 6-6"></path>
    </svg>
);
const MapPin = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);
const Coffee = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
        <line x1="6" x2="6" y1="2" y2="4"></line>
        <line x1="10" x2="10" y1="2" y2="4"></line>
        <line x1="14" x2="14" y1="2" y2="4"></line>
    </svg>
);
const Award = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="8" r="6"></circle>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
    </svg>
);
const HeartHandshake = ({ className = 'w-6 h-6' }) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.94 0l.06-.06L12 11l.96-.96.06.06c.8.8 2.12.8 2.94 0v0a2.17 2.17 0 0 0 0-3.08L12 5Z"></path>
    </svg>
);
const X = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const CheckCircle = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const Home = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);
const Star = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);
const Heart = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);
const Zap = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);
const Globe = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);
const Calendar = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);
const Search = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);
const Rocket = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
    </svg>
);
const Lightbulb = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
    </svg>
);
const Palette = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="13.5" cy="6.5" r=".5"></circle>
        <circle cx="17.5" cy="10.5" r=".5"></circle>
        <circle cx="8.5" cy="7.5" r=".5"></circle>
        <circle cx="6.5" cy="12.5" r=".5"></circle>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
    </svg>
);
const Trophy = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </svg>
);
const Camera = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
    <circle cx="12" cy="13" r="3"></circle>
  </svg>
);
const Video = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);
const Smile = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);
const Target = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);
const Play = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="6 3 20 12 6 21 6 3"></polygon>
  </svg>
);

// Function to get translated job openings
const getJobOpenings = (t: any) => [
    {
        title: t('jobTitleSeniorFrontend'),
        location: t('jobLocationRemote'),
        department: t('jobDepartmentEngineering'),
        type: t('jobTypeFullTime'),
        responsibilities: [t('jobFrontendResp1'), t('jobFrontendResp2'), t('jobFrontendResp3')],
        requirements: [t('jobFrontendReq1'), t('jobFrontendReq2'), t('jobFrontendReq3')],
        experience: t('jobFrontendExp'),
        postedDate: t('jobPosted2Days'),
    },
    {
        title: t('jobTitleProductDesigner'),
        location: t('jobLocationRemote'),
        department: t('jobDepartmentDesign'),
        type: t('jobTypeFullTime'),
        responsibilities: [t('jobDesignerResp1'), t('jobDesignerResp2'), t('jobDesignerResp3')],
        requirements: [t('jobDesignerReq1'), t('jobDesignerReq2'), t('jobDesignerReq3')],
        experience: t('jobDesignerExp'),
        postedDate: t('jobPosted1Week'),
    },
    {
        title: t('jobTitleMarketingIntern'),
        location: t('jobLocationRemote'),
        department: t('jobDepartmentMarketing'),
        type: t('jobTypeInternship'),
        responsibilities: [t('jobInternResp1'), t('jobInternResp2'), t('jobInternResp3')],
        requirements: [t('jobInternReq1'), t('jobInternReq2'), t('jobInternReq3')],
        experience: t('jobInternExp'),
        postedDate: t('jobPosted3Days'),
    }
];

const getTestimonials = (t: any) => [
    {
        name: 'Ayşe Yılmaz',
        role: 'Senior Developer',
        quote: t('testimonialAyseQuote'),
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 5
    },
    {
        name: 'Mehmet Demir',
        role: 'Product Designer',
        quote: t('testimonialMehmetQuote'),
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 5
    },
    {
        name: 'Zeynep Kaya',
        role: 'Marketing Lead',
        quote: t('testimonialZeynepQuote'),
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 5
    }
];

// Enhanced culture data with translation support
const getCultureGallery = (t: any) => [
    {
        id: 1,
        category: 'Team',
        image: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        title: t('cultureCollaborativeTitle'),
        description: t('cultureCollaborativeDesc'),
        stats: '98% team satisfaction',
        video: 'https://player.vimeo.com/video/76979871?h=8272103f6e'
    },
    {
        id: 2,
        category: 'Events',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        title: t('cultureTeamBuildingTitle'),
        description: t('cultureTeamBuildingDesc'),
        stats: 'Monthly team activities',
        video: 'https://player.vimeo.com/video/1084537?h=1a265e56e4'
    },
    {
        id: 3,
        category: 'Workspace',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        title: t('cultureWorkspacesTitle'),
        description: t('cultureWorkspacesDesc'),
        stats: '24/7 access'
    },
    {
        id: 4,
        category: 'Innovation',
        image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        title: t('cultureInnovationTitle'),
        description: t('cultureInnovationDesc'),
        stats: '50+ launched projects',
        video: 'https://player.vimeo.com/video/139707837?h=0c29c8b6a3'
    }
];

const companyValues = [
    {
        icon: <Users className="w-8 h-8" />,
        titleKey: "careersCollaborationTitle",
        descKey: "careersCollaborationDesc",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: <Target className="w-8 h-8" />,
        titleKey: "careersExcellenceTitle",
        descKey: "careersExcellenceDesc",
        color: "from-purple-500 to-pink-500"
    },
    {
        icon: <Lightbulb className="w-8 h-8" />,
        titleKey: "careersInnovationTitle",
        descKey: "careersInnovationDesc",
        color: "from-yellow-500 to-orange-500"
    },
    {
        icon: <Heart className="w-8 h-8" />,
        titleKey: "careersPeopleTitle",
        descKey: "careersPeopleDesc",
        color: "from-red-500 to-pink-500"
    }
];

// Team activities are now defined inline with translation keys

type JobOpening = typeof jobOpenings[0];

// Video Modal Component
const VideoModal = ({ isOpen, onClose, videoUrl }: { isOpen: boolean, onClose: () => void, videoUrl: string }) => {
    const { t } = useTranslation();
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="relative max-w-4xl w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="aspect-video bg-black">
                    <iframe
                        src={videoUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="Company Culture Video"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

// Enhanced Life at Salesence Section Component
const LifeAtSalesenceSection = () => {
    const { t } = useTranslation();
    const cultureGallery = getCultureGallery(t);
    const [activeCategory, setActiveCategory] = useState(t('careersCategoryAll'));
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    const categories = [t('careersCategoryAll'), t('careersCategoryTeam'), t('careersCategoryEvents'), t('careersCategoryWorkspace'), t('careersCategoryInnovation')];

    const filteredGallery = useMemo(() => {
        const allCategory = t('careersCategoryAll');
        if (activeCategory === allCategory) return cultureGallery;
        return cultureGallery.filter(item => t(`careersCategory${item.category}`) === activeCategory);
    }, [activeCategory, t, cultureGallery]);

    const playVideo = (videoUrl: string) => {
        setActiveVideo(videoUrl);
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-cyan-500/20 px-4 py-2 rounded-full border border-cyan-500/30 mb-6">
                        <Smile className="w-5 h-5 text-cyan-400" />
                        <span className="text-cyan-300 text-sm font-medium">{t('careersLifeBadge')}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {t('careersLifeTitle')}
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        {t('careersLifeSubtitle')}
                    </p>
                </div>

                {/* Interactive Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="text-center p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                        <div className="text-3xl font-bold text-cyan-400 mb-2">50+</div>
                        <div className="text-gray-400">{t('careersTeamMembers')}</div>
                    </div>
                    <div className="text-center p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                        <div className="text-3xl font-bold text-purple-400 mb-2">15+</div>
                        <div className="text-gray-400">{t('careersCountries')}</div>
                    </div>
                    <div className="text-center p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                        <div className="text-3xl font-bold text-blue-400 mb-2">25+</div>
                        <div className="text-gray-400">{t('careersTeamEventsYear')}</div>
                    </div>
                    <div className="text-center p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
                        <div className="text-3xl font-bold text-green-400 mb-2">98%</div>
                        <div className="text-gray-400">{t('careersHappinessScore')}</div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-20">
                    <h3 className="text-3xl font-bold text-center mb-12 text-white">{t('careersCoreValuesTitle')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {companyValues.map((value, index) => (
                            <div
                                key={index}
                                className="group p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105"
                            >
                                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${value.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {value.icon}
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">{t(value.titleKey)}</h4>
                                <p className="text-gray-400 leading-relaxed">{t(value.descKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                                activeCategory === category
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Enhanced Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
                    {filteredGallery.map((item, index) => (
                        <div 
                            key={item.id}
                            className="group relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-700 hover:scale-105"
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="h-80 overflow-hidden relative">
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                {/* Overlay with stats */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                                        <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                                        <div className="flex items-center text-cyan-400 text-sm">
                                            <TrendingUp className="w-4 h-4 mr-2" />
                                            {item.stats}
                                        </div>
                                    </div>
                                </div>

                                {/* Category badge */}
                                <div className="absolute top-4 left-4 bg-cyan-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                                    {t(`careersCategory${item.category}`)}
                                </div>

                                {/* Video play button for items with videos */}
                                {item.video && (
                                    <button 
                                        onClick={() => playVideo(item.video!)}
                                        className="absolute top-4 right-4 bg-black/50 hover:bg-cyan-600 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 group"
                                    >
                                        <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Team Activities Section */}
                <div className="mb-16">
                    <h3 className="text-3xl font-bold text-center mb-12 text-white">{t('careersActivitiesTitle')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-cyan-500/20 p-3 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <span className="text-sm text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded-full">
                                    {t('careersHackathonFrequency')}
                                </span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{t('careersHackathonTitle')}</h4>
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{t('careersHackathonDesc')}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <Users className="w-4 h-4 mr-2" />
                                {t('careersHackathonParticipants')}
                            </div>
                        </div>
                        <div className="group p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-cyan-500/20 p-3 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <span className="text-sm text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded-full">
                                    {t('careersLearningFrequency')}
                                </span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{t('careersLearningTitle')}</h4>
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{t('careersLearningDesc')}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <Users className="w-4 h-4 mr-2" />
                                {t('careersLearningParticipants')}
                            </div>
                        </div>
                        <div className="group p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-cyan-500/20 p-3 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                    <Smile className="w-6 h-6" />
                                </div>
                                <span className="text-sm text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded-full">
                                    {t('careersWellnessFrequency')}
                                </span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{t('careersWellnessTitle')}</h4>
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{t('careersWellnessDesc')}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <Users className="w-4 h-4 mr-2" />
                                {t('careersWellnessParticipants')}
                            </div>
                        </div>
                        <div className="group p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-cyan-500/20 p-3 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <span className="text-sm text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded-full">
                                    {t('careersMeetupsFrequency')}
                                </span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{t('careersMeetupsTitle')}</h4>
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{t('careersMeetupsDesc')}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <Users className="w-4 h-4 mr-2" />
                                {t('careersMeetupsParticipants')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Modal */}
                <VideoModal 
                    isOpen={!!activeVideo} 
                    onClose={() => setActiveVideo(null)} 
                    videoUrl={activeVideo || ''} 
                />

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-md">
                        <h3 className="text-2xl font-bold text-white mb-4">{t('careersCtaTitle')}</h3>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            {t('careersCtaSubtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#openings"
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                {t('careersViewPositions')}
                            </a>
                            <button className="border-2 border-cyan-500 text-cyan-400 font-bold py-3 px-8 rounded-full hover:bg-cyan-500/10 transition-all duration-300 transform hover:scale-105">
                                {t('careersTakeTour')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// App Component
export default function CareersPage() {
    const { t } = useTranslation();
    const jobOpenings = getJobOpenings(t);
    const testimonials = getTestimonials(t);
    const [openJob, setOpenJob] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [applyingFor, setApplyingFor] = useState<JobOpening | null>(null);
    const [notification, setNotification] = useState<{ show: boolean; title: string; message: string; } | null>(null);
    const [filters, setFilters] = useState({ department: 'all', type: 'all' });
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        employees: 0,
        countries: 0,
        awards: 0,
        grade: 0
    });

    useEffect(() => {
        if (notification?.show) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        // Animate stats counters
        const interval = setInterval(() => {
            setStats(prev => ({
                employees: prev.employees < 50 ? prev.employees + 1 : 50,
                countries: prev.countries < 25 ? prev.countries + 1 : 25,
                awards: prev.awards < 15 ? prev.awards + 1 : 15,
                grade: prev.grade < 95 ? prev.grade + 1 : 95
            }));
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const handleApplyClick = (job: JobOpening) => {
        setApplyingFor(job);
        setIsModalOpen(true);
    };

    const handleFormSubmit = () => {
        setIsModalOpen(false);
        setNotification({
            show: true,
            title: t('careersNotificationTitle'),
            message: t('careersNotificationMessage'),
        });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const uniqueDepartments = useMemo(() => ['all', ...Array.from(new Set(jobOpenings.map(job => job.department)))], [jobOpenings]);
    const uniqueTypes = useMemo(() => ['all', ...Array.from(new Set(jobOpenings.map(job => job.type)))], [jobOpenings]);

    const filteredJobs = useMemo(() => {
        return jobOpenings.filter(job => {
            const departmentMatch = filters.department === 'all' || job.department === filters.department;
            const typeMatch = filters.type === 'all' || job.type === filters.type;
            const searchMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               job.department.toLowerCase().includes(searchTerm.toLowerCase());
            return departmentMatch && typeMatch && searchMatch;
        });
    }, [filters, searchTerm, jobOpenings]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-200 font-sans antialiased transition-colors duration-300 relative overflow-hidden">
            <ToastNotification notification={notification} onClose={() => setNotification(null)} />
            <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} job={applyingFor} onSubmit={handleFormSubmit} />
            
            {/* Back to Home Button */}
            <div className="fixed top-6 left-6 z-50">
                <Link
                    to="/"
                    className="flex items-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 group backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-indigo-500/30 hover:shadow-xl animate-pulse"
                >
                    <Home className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    {t('careersBackToHome')}
                </Link>
            </div>
            
            {/* Salesence Logo */}
            <div className="fixed top-6 right-6 z-50">
                <div className="font-bold text-2xl text-cyan-400 flex items-center backdrop-blur-md bg-black/20 px-4 py-2 rounded-lg">
                    <Rocket className="w-8 h-8 mr-2" />
                    Salesence
                </div>
            </div>
            
            <main className="relative z-10">
                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-pink-900/60"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center bg-no-repeat opacity-20"
                        style={{ transform: 'translateZ(-10px) scale(2)' }}
                    ></div>
                    
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <div className="inline-block mb-6 bg-cyan-500/20 px-4 py-2 rounded-full border border-cyan-500/30 backdrop-blur-md">
                            <span className="text-cyan-300 text-sm font-medium">{t('careersHeroBadge')}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-white animate-fade-in">
                            {t('careersHeroTitle')}
                        </h1>
                        <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto mb-10">
                            {t('careersHeroSubtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#openings" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center backdrop-blur-md">
                                {t('careersExploreBtn')}
                                <ChevronDown className="w-5 h-5 ml-2" />
                            </a>
                            <a href="#culture" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 flex items-center backdrop-blur-md">
                                {t('careersCultureBtn')}
                                <Heart className="w-5 h-5 ml-2" />
                            </a>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center backdrop-blur-md">
                            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-gradient-to-b from-indigo-900/50 to-purple-900/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center bg-no-repeat opacity-10"></div>
                    <div className="max-w-6xl mx-auto px-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('careersStatsTitle')}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <StatCard number={stats.employees} label={t('careersTeamMembers')} icon={<Users className="w-8 h-8 text-cyan-400" />} />
                            <StatCard number={stats.countries} label={t('careersCountries')} icon={<Globe className="w-8 h-8 text-cyan-400" />} />
                            <StatCard number={stats.awards} label={t('careersAwards')} icon={<Trophy className="w-8 h-8 text-cyan-400" />} />
                            <StatCard number={stats.grade} suffix="%" label={t('careersEmployeeSatisfaction')} icon={<Award className="w-8 h-8 text-cyan-400" />} />
                        </div>
                    </div>
                </section>

                {/* Enhanced Life at Salesence Section */}
                <LifeAtSalesenceSection />

                {/* Culture Section */}
                <section id="culture" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-indigo-900">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">{t('careersCultureTitle')}</h2>
                        <p className="text-gray-300 sm:text-gray-400 text-sm sm:text-base max-w-3xl mx-auto mb-8 sm:mb-12 px-4">{t('careersCultureSubtitle')}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-left">
                            <FeatureCard icon={<Users className="w-8 h-8 text-cyan-400" />} title={t('careersThrivingCultureTitle')} description={t('careersThrivingCultureDesc')} />
                            <FeatureCard icon={<TrendingUp className="w-8 h-8 text-cyan-400" />} title={t('careersCareerGrowthTitle')} description={t('careersCareerGrowthDesc')} />
                            <FeatureCard icon={<BookOpen className="w-8 h-8 text-cyan-400" />} title={t('careersContinuousLearningTitle')} description={t('careersContinuousLearningDesc')} />
                            <FeatureCard icon={<Briefcase className="w-8 h-8 text-cyan-400" />} title={t('careersMeaningfulWorkTitle')} description={t('careersMeaningfulWorkDesc')} />
                        </div>
                    </div>
                </section>
                
                {/* Work Environment Section */}
                <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 to-purple-900">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div className="md:pr-8">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">{t('careersEnvironmentTitle')}</h2>
                            <p className="text-gray-200 sm:text-gray-300 mb-6 text-sm sm:text-base lg:text-lg">{t('careersEnvironmentSubtitle')}</p>
                            <ul className="space-y-3 sm:space-y-4 text-gray-200 sm:text-gray-300 text-sm sm:text-base">
                                <li className="flex items-start">
                                    <span className="text-cyan-400 mr-3 mt-1 text-lg sm:text-xl font-bold flex-shrink-0">✓</span>
                                    <span><strong className="text-white">{t('careersCollaborativeSpacesTitle')}</strong> {t('careersCollaborativeSpacesDesc')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cyan-400 mr-3 mt-1 text-lg sm:text-xl font-bold flex-shrink-0">✓</span>
                                    <span><strong className="text-white">{t('careersFlexibleWorkTitle')}</strong> {t('careersFlexibleWorkDesc')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cyan-400 mr-3 mt-1 text-lg sm:text-xl font-bold flex-shrink-0">✓</span>
                                    <span><strong className="text-white">{t('careersModernToolsTitle')}</strong> {t('careersModernToolsDesc')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cyan-400 mr-3 mt-1 text-lg sm:text-xl font-bold flex-shrink-0">✓</span>
                                    <span><strong className="text-white">{t('careersInnovationDaysTitle')}</strong> {t('careersInnovationDaysDesc')}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="relative mt-8 md:mt-0">
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Collaborative work environment" className="rounded-xl shadow-2xl object-cover w-full h-64 sm:h-80 md:h-96" />
                            <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 bg-cyan-500 text-white p-3 sm:p-4 rounded-lg shadow-lg">
                                <Zap className="w-6 h-6 sm:w-8 sm:h-8" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 to-indigo-900">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 text-white">{t('careersTestimonialsTitle')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard key={index} testimonial={testimonial} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Job Openings Section */}
                <section id="openings" className="py-20 px-4 bg-gradient-to-br from-gray-900 to-indigo-900">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('careersOpeningsTitle')}</h2>
                        <p className="text-center text-gray-400 mb-10">{t('careersOpeningsSubtitle', { count: filteredJobs.length })}</p>

                        {/* Search and Filters */}
                        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg p-6 mb-10 border border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">{t('careersSearchLabel')}</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="search"
                                            placeholder={t('careersSearchPlaceholder')}
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="w-full p-3 pl-10 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500"
                                        />
                                        <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">{t('careersDepartmentLabel')}</label>
                                    <select name="department" id="department" value={filters.department} onChange={handleFilterChange} className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                        {uniqueDepartments.map(dep => <option key={dep} value={dep}>{dep === 'all' ? t('careersAllDepartments') : dep}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">{t('careersJobTypeLabel')}</label>
                                    <select name="type" id="type" value={filters.type} onChange={handleFilterChange} className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                        {uniqueTypes.map(typ => <option key={typ} value={typ}>{typ === 'all' ? t('careersAllTypes') : typ}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Jobs List */}
                        <div className="space-y-6">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <JobCard key={job.title} job={job} isOpen={openJob === job.title} onToggle={() => setOpenJob(openJob === job.title ? null : job.title)} onApply={() => handleApplyClick(job)} />
                                ))
                            ) : (
                                <div className="text-center py-10 px-6 bg-gray-800/50 backdrop-blur-md rounded-lg shadow-md border border-gray-700">
                                    <h3 className="text-xl font-semibold">{t('careersNoResultsTitle')}</h3>
                                    <p className="text-gray-400 mt-2">{t('careersNoResultsSubtitle')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                
                {/* Hiring For Section */}
                <section className="py-20 px-4 bg-gradient-to-br from-purple-900 to-indigo-900">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('careersHiringTitle')}</h2>
                        <p className="text-gray-300 max-w-3xl mx-auto mb-12">{t('careersHiringSubtitle')}</p>
                        <div className="grid md:grid-cols-3 gap-8">
                            <HiringCard title={t('careersExpertsTitle')} description={t('careersExpertsDesc')} />
                            <HiringCard title={t('careersFreshersTitle')} description={t('careersFreshersDesc')} />
                            <HiringCard title={t('careersInternsTitle')} description={t('careersInternsDesc')} />
                        </div>
                    </div>
                </section>

                {/* Perks & Benefits Section */}
                <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-indigo-900">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('careersPerksTitle')}</h2>
                        <p className="text-gray-400 max-w-3xl mx-auto mb-12">{t('careersPerksSubtitle')}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
                            <Perk icon={<HeartHandshake />} text={t('careersHealthInsurance')} />
                            <Perk icon={<Coffee />} text={t('careersPTO')} />
                            <Perk icon={<Award />} text={t('careersDevelopmentStipend')} />
                            <Perk icon={<Users />} text={t('careersTeamRetreats')} />
                            <Perk icon={<TrendingUp />} text={t('careersStockOptions')} />
                            <Perk icon={<BookOpen />} text={t('careersLearningResources')} />
                            <Perk icon={<Briefcase />} text={t('careersRemoteSupport')} />
                            <Perk icon={<MapPin />} text={t('careersWellnessPrograms')} />
                        </div>
                    </div>
                </section>
                
                {/* Application CTA Section */}
                <section id="apply" className="py-20 px-4 bg-gradient-to-br from-indigo-900 to-purple-900">
                    <div className="max-w-3xl mx-auto text-center bg-gray-800/40 backdrop-blur-md p-10 rounded-xl shadow-lg relative overflow-hidden border border-cyan-500/20">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500 rounded-full opacity-20"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500 rounded-full opacity-20"></div>

                        <h2 className="text-3xl font-bold mb-4 relative z-10">{t('careersApplicationCtaTitle')}</h2>
                        <p className="text-gray-300 mb-6 relative z-10">{t('careersApplicationCtaSubtitle')}</p>
                        <Link to="/contact" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-cyan-600 hover:to-blue-600 transition-colors duration-300 transform hover:scale-105 inline-block shadow-md relative z-10">
                            {t('careersContactBtn')}
                        </Link>
                    </div>
                </section>
            </main>

            {/* Enhanced Footer */}
            <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 border-t border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-5"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                        <div className="lg:col-span-2">
                            <div className="flex items-center mb-6">
                                <Rocket className="w-10 h-10 text-cyan-400 mr-3" />
                                <h3 className="text-2xl font-bold">Salesence</h3>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-md">{t('careersFooterTagline')}</p>
                            <div className="flex space-x-4">
                                <a href="#" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-colors duration-300 transform hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-cyan-600 transition-colors duration-300 transform hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                                </a>
                                <a href="https://www.linkedin.com/company/salesence/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-colors duration-300 transform hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-cyan-400">{t('careersQuickLinks')}</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li><Link to="/" className="hover:text-cyan-400 transition-colors duration-300 flex items-center"><ChevronDown className="w-4 h-4 mr-2 rotate-270" />{t('careersHome')}</Link></li>
                                <li><a href="#culture" className="hover:text-cyan-400 transition-colors duration-300 flex items-center"><ChevronDown className="w-4 h-4 mr-2 rotate-270" />{t('careersAbout')}</a></li>
                                <li><a href="#openings" className="hover:text-cyan-400 transition-colors duration-300 flex items-center"><ChevronDown className="w-4 h-4 mr-2 rotate-270" />{t('careersFooterCareers')}</a></li>
                                <li><Link to="/contact" className="hover:text-cyan-400 transition-colors duration-300 flex items-center"><ChevronDown className="w-4 h-4 mr-2 rotate-270" />{t('careersFooterContact')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-cyan-400">{t('careersOpenPositions')}</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li><a href="#openings" className="hover:text-cyan-400 transition-colors duration-300 flex items-center"><Briefcase className="w-4 h-4 mr-2" />{t('careersEngineering')}</a></li>
                                <li><a href="#openings" className="hover:text-cyan-400 transition-colors duration-300 flex items-center"><Palette className="w-4 h-4 mr-2" />{t('careersDesign')}</a></li>
                                <li><a href="#openings" className="hover:text-cyan-400 transition-colors duration-300 flex items-center"><TrendingUp className="w-4 h-4 mr-2" />{t('careersMarketing')}</a></li>
                                <li><a href="#openings" className="hover:text-cyan-400 transition-colors duration-300 flex items-center"><BookOpen className="w-4 h-4 mr-2" />{t('careersInternships')}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-cyan-400">{t('careersContactUs')}</h3>
                            <div className="space-y-4 text-gray-400">
                                <p className="flex items-center"><svg className="w-5 h-5 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>careers@salesence.com</p>
                                <p className="flex items-center"><svg className="w-5 h-5 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>+1 (555) 123-4567</p>
                                <p className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-cyan-400" />{t('careersRemoteFirst')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>{t('careersCopyright', { year: new Date().getFullYear() })}</p>
                    </div>
                </div>
            </footer>

            {/* Custom CSS for animations */}
            <style>{`
                .animate-fade-in { animation: fadeIn 1.5s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

// Helper Components
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-gray-800/50 backdrop-blur-md p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 group h-full">
        <div className="mb-3 sm:mb-4 inline-block bg-cyan-900/30 p-2 sm:p-3 rounded-full group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-gray-300 sm:text-gray-400 text-sm sm:text-base">{description}</p>
    </div>
);

const JobCard = ({ job, isOpen, onToggle, onApply }: { job: JobOpening, isOpen: boolean, onToggle: () => void, onApply: () => void }) => {
    const { t } = useTranslation();
    return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-700">
        <button onClick={onToggle} className="w-full text-left p-4 sm:p-6 hover:bg-gray-700/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-grow min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-cyan-400 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap items-center text-gray-400 gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm">
                        <span className="flex items-center flex-shrink-0"><Briefcase className="w-4 h-4 mr-1.5 flex-shrink-0" />{job.department}</span>
                        <span className="flex items-center flex-shrink-0"><MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />{job.location}</span>
                        <span className="flex items-center bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded-full text-xs flex-shrink-0">{job.type}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-400 mt-3">
                        <Calendar className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span>{job.postedDate}</span>
                    </div>
                </div>
                <div className={`transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </div>
            </div>
        </button>
        {isOpen && (
            <div className="p-6 border-t border-gray-700">
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-lg mb-2">{t('careersResponsibilities')}</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">{t('careersRequirements')}</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {job.requirements.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                </div>
                <div className="mt-6 p-4 bg-cyan-900/20 rounded-lg border border-cyan-800/30">
                    <h5 className="font-semibold text-cyan-400">{t('careersExperienceLevel')}</h5>
                    <p className="text-gray-300">{job.experience}</p>
                </div>
                <div className="mt-6 text-right">
                    <button onClick={onApply} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors duration-300 transform hover:scale-105 shadow-md">
                        {t('careersApplyBtn')}
                    </button>
                </div>
            </div>
        )}
    </div>
    );
};

const HiringCard = ({ title, description }: { title: string, description: string }) => (
    <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 group">
        <h3 className="text-2xl font-bold mb-3 text-cyan-400 group-hover:scale-105 transition-transform">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const Perk = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <div className="flex flex-col items-center text-center group">
        <div className="bg-cyan-900/30 p-4 rounded-full mb-3 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-900/40 transition-all duration-300">
            {React.cloneElement(icon as React.ReactElement, { className: 'w-8 h-8' })}
        </div>
        <p className="font-semibold text-gray-300 text-sm group-hover:text-cyan-300 transition-colors">{text}</p>
    </div>
);

const StatCard = ({ number, label, icon, suffix = '' }: { number: number, label: string, icon: React.ReactNode, suffix?: string }) => (
    <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg shadow-md text-center border border-gray-700 hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center mb-3">{icon}</div>
        <div className="text-4xl font-bold text-cyan-400 mb-2">{number}{suffix}</div>
        <div className="text-gray-400">{label}</div>
    </div>
);

const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
    <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700 hover:scale-105 transition-transform duration-300">
        <div className="flex items-center mb-4">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
            <div className="ml-4">
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
            </div>
        </div>
        <div className="flex mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
        </div>
        <p className="text-gray-300 italic">"{testimonial.quote}"</p>
    </div>
);

const ApplicationModal = ({ isOpen, onClose, job, onSubmit }: { isOpen: boolean, onClose: () => void, job: JobOpening | null, onSubmit: () => void }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-800/80 backdrop-blur-sm flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-cyan-400">{t('careersModalTitle', { position: job?.title })}</h2>
                        <p className="text-gray-400">{t('careersModalSubtitle')}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <ApplicationForm onSubmit={onSubmit} />
            </div>
        </div>
    );
};

const ApplicationForm = ({ onSubmit }: { onSubmit: () => void }) => {
    const { t } = useTranslation();
    const [urlErrors, setUrlErrors] = useState({ linkedin: false, portfolio: false });

    const validateUrl = (value: string) => {
        if (!value) return true; // Empty is valid (not required)
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'linkedin' | 'portfolio') => {
        const value = e.target.value;
        const isValid = validateUrl(value);
        setUrlErrors(prev => ({ ...prev, [field]: !isValid && value !== '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const linkedin = (form.elements.namedItem('linkedin') as HTMLInputElement).value;
        const portfolio = (form.elements.namedItem('portfolio') as HTMLInputElement).value;

        const linkedinValid = validateUrl(linkedin);
        const portfolioValid = validateUrl(portfolio);

        setUrlErrors({ linkedin: !linkedinValid && linkedin !== '', portfolio: !portfolioValid && portfolio !== '' });

        if ((linkedin && !linkedinValid) || (portfolio && !portfolioValid)) {
            return;
        }

        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">{t('careersFullName')}</label>
                    <input type="text" name="fullName" id="fullName" required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">{t('careersEmail')}</label>
                    <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300">{t('careersLinkedIn')}</label>
                    <input
                        type="url"
                        name="linkedin"
                        id="linkedin"
                        onChange={(e) => handleUrlChange(e, 'linkedin')}
                        className={`mt-1 block w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${urlErrors.linkedin ? 'border-red-500' : 'border-gray-600'}`}
                    />
                    {urlErrors.linkedin && <p className="mt-1 text-sm text-red-400">{t('careersValidUrlError')}</p>}
                </div>
                <div>
                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-300">{t('careersPortfolio')}</label>
                    <input
                        type="url"
                        name="portfolio"
                        id="portfolio"
                        onChange={(e) => handleUrlChange(e, 'portfolio')}
                        className={`mt-1 block w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${urlErrors.portfolio ? 'border-red-500' : 'border-gray-600'}`}
                    />
                    {urlErrors.portfolio && <p className="mt-1 text-sm text-red-400">{t('careersValidUrlError')}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-300">{t('careersSkills')}</label>
                <textarea id="skills" name="skills" rows={3} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" placeholder={t('careersSkillsPlaceholder')}></textarea>
            </div>
            <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-300">{t('careersResume')}</label>
                <input type="file" name="resume" id="resume" required className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/30 file:text-cyan-400 hover:file:bg-cyan-800/40"/>
            </div>
            <div className="pt-4">
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-transform hover:scale-[1.02]">
                    {t('careersSubmit')}
                </button>
            </div>
        </form>
    );
};

const ToastNotification = ({ notification, onClose }: { notification: { show: boolean; title: string; message: string; } | null, onClose: () => void }) => {
    if (!notification?.show) return null;
    return (
        <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
            <div className="bg-gray-800 border border-cyan-500/30 rounded-xl shadow-2xl p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0"><CheckCircle className="h-6 w-6 text-green-400" /></div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-bold text-white">{notification.title}</p>
                        <p className="mt-1 text-sm text-gray-300">{notification.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={onClose} className="rounded-md inline-flex text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                            <X className="h-5 w-5" />
                        </button> 
                    </div>
                </div>
            </div>
        </div>
    );
};