import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../styles/adminDashboardCss.css";
import { FaBell, FaUser, FaThLarge, FaUsers, FaFileAlt, FaCheckCircle, FaCog, FaSignOutAlt, FaEye, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaEnvelope } from 'react-icons/fa';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isAdminView, setIsAdminView] = useState(true);
    const [notice, setNotice] = useState('');

    const notify = (message) => {
        setNotice(message || 'Something went wrong');
    };

    const handleViewToggle = () => {
        if (isAdminView) {
            // Switch to user view and set admin mode flag
            sessionStorage.setItem('isAdminMode', 'true');
            navigate('/');
        } else {
            // Already in admin view
            setIsAdminView(true);
        }
    };

    // Sample data for the table
    const sampleItems = [
        { id: '#01', icon: '👞', name: 'Linen White Shoe', date: '2024-04-15', type: 'Lost', area: 'Gampaha', status: 'Active' },
        { id: '#01', icon: '👜', name: 'Pink Side Bag', date: '2024-04-15', type: 'Found', area: 'Gampaha', status: 'Active' },
        { id: '#01', icon: '👞', name: 'Linen White Shoe', date: '2024-04-15', type: 'Lost', area: 'Gampaha', status: 'Active' },
        { id: '#01', icon: '👜', name: 'Pink Side Bag', date: '2024-04-15', type: 'Found', area: 'Gampaha', status: 'Active' },
        { id: '#01', icon: '👜', name: 'Pink Side Bag', date: '2024-04-15', type: 'Found', area: 'Gampaha', status: 'Active' },
        { id: '#01', icon: '👞', name: 'Linen White Shoe', date: '2024-04-15', type: 'Lost', area: 'Gampaha', status: 'Active' },
        { id: '#01', icon: '👞', name: 'Linen White Shoe', date: '2024-04-15', type: 'Lost', area: 'Gampaha', status: 'Active' },
        { id: '#01', icon: '👜', name: 'Pink Side Bag', date: '2024-04-15', type: 'Found', area: 'Gampaha', status: 'Active' },
    ];

    const [contactMessages, setContactMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        verifiedClaims: 0
    });
    const [dashboardActivities, setDashboardActivities] = useState([]);

    // Search state for user management
    const [userSearch, setUserSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Filter users based on search and date
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase());
        const matchesDate = !dateFilter || user.loggedDate === dateFilter;
        return matchesSearch && matchesDate;
    });

    // Handle user status change
    const handleStatusChange = async (userId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/settings/users/${userId}/status`, {
                method: 'PATCH',
                headers: getAdminHeaders(),
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (!response.ok) {
                notify(data.message || 'Failed to update user status');
                return;
            }

            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ));
        } catch (error) {
            console.error('Error updating user status:', error);
            notify('Failed to update user status');
        }
    };

    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);

    const [verifiedItems, setVerifiedItems] = useState([]);
    const [verifiedLoading, setVerifiedLoading] = useState(false);

    // Verified items filter states
    const [verifiedSearch, setVerifiedSearch] = useState('');
    const [selectedVerifiedItem, setSelectedVerifiedItem] = useState(null);
    const [showVerifiedModal, setShowVerifiedModal] = useState(false);

    // Contact message modal states
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);

    // Settings - Contact Info
    const [contactInfo, setContactInfo] = useState({
        email: '',
        phone: '',
        workingHours: ''
    });

    // Settings - Admin Management
    const [admins, setAdmins] = useState([]);
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [editAdminEmail, setEditAdminEmail] = useState('');
    const [editAdminPassword, setEditAdminPassword] = useState('');
    const [editAdminConfirmPassword, setEditAdminConfirmPassword] = useState('');

    const getAdminHeaders = () => {
        const adminToken = sessionStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        };
    };

    const formatTimeAgo = (dateValue) => {
        if (!dateValue) return '';
        const diffMs = Date.now() - new Date(dateValue).getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const loadDashboardData = async () => {
        setDashboardLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/settings/dashboard', {
                headers: getAdminHeaders()
            });
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    notify('Admin session expired. Please login again.');
                    navigate('/login');
                    return;
                }
                notify(data.message || 'Failed to load dashboard data');
                return;
            }

            setDashboardStats({
                totalUsers: data.totalUsers || 0,
                totalPosts: data.totalPosts || 0,
                verifiedClaims: data.verifiedClaims || 0
            });
            setDashboardActivities(Array.isArray(data.recentActivities) ? data.recentActivities : []);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            notify('Failed to load dashboard data');
        } finally {
            setDashboardLoading(false);
        }
    };

    useEffect(() => {
        if (activeMenu === 'dashboard') {
            loadDashboardData();
        }
    }, [activeMenu]);

    const loadSettingsData = async () => {
        setSettingsLoading(true);
        try {
            const [contactRes, adminsRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/settings/contact', { headers: getAdminHeaders() }),
                fetch('http://localhost:5000/api/admin/settings/admins', { headers: getAdminHeaders() })
            ]);

            if (!contactRes.ok || !adminsRes.ok) {
                if (contactRes.status === 401 || adminsRes.status === 401 || contactRes.status === 403 || adminsRes.status === 403) {
                    notify('Admin session expired. Please login again.');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to load settings');
            }

            const contactData = await contactRes.json();
            const adminsData = await adminsRes.json();
            setContactInfo({
                email: contactData.email || '',
                phone: contactData.phone || '',
                workingHours: contactData.workingHours || ''
            });
            setAdmins(Array.isArray(adminsData) ? adminsData : []);
        } catch (error) {
            console.error('Error loading settings:', error);
            notify('Failed to load settings data');
        } finally {
            setSettingsLoading(false);
        }
    };

    useEffect(() => {
        if (activeMenu === 'settings') {
            loadSettingsData();
        }
    }, [activeMenu]);

    const loadContactMessages = async () => {
        setMessagesLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/contact-messages', {
                headers: getAdminHeaders()
            });
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    notify('Admin session expired. Please login again.');
                    navigate('/login');
                    return;
                }
                notify(data.message || 'Failed to load contact messages');
                return;
            }

            setContactMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading contact messages:', error);
            notify('Failed to load contact messages');
        } finally {
            setMessagesLoading(false);
        }
    };

    useEffect(() => {
        if (activeMenu === 'messages') {
            loadContactMessages();
        }
    }, [activeMenu]);

    const loadUsersData = async () => {
        setUsersLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/settings/users', {
                headers: getAdminHeaders()
            });
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    notify('Admin session expired. Please login again.');
                    navigate('/login');
                    return;
                }
                notify(data.message || 'Failed to load users');
                return;
            }

            const mappedUsers = (Array.isArray(data) ? data : []).map(user => ({
                id: user.id,
                fullName: user.name || 'Unknown',
                email: user.email || '',
                loggedDate: user.createdAt ? String(user.createdAt).slice(0, 10) : '',
                status: user.status || 'Active'
            }));
            setUsers(mappedUsers);
        } catch (error) {
            console.error('Error loading users:', error);
            notify('Failed to load users');
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        if (activeMenu === 'users') {
            loadUsersData();
        }
    }, [activeMenu]);

    const handleDeleteMessage = async (messageId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/contact-messages/${messageId}`, {
                method: 'DELETE',
                headers: getAdminHeaders()
            });
            const data = await response.json();
            if (!response.ok) {
                notify(data.message || 'Failed to delete message');
                return;
            }
            setContactMessages(prev => prev.filter(msg => msg.id !== messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
            notify('Failed to delete message');
        }
    };
    // Filter verified items
    const filteredVerifiedItems = verifiedItems.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(verifiedSearch.toLowerCase());
        return matchesSearch;
    });

    // Handle verified item status change
    const handleVerifiedStatusChange = async (item, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/settings/verified/${item.claimType}/${item.originalId}/status`, {
                method: 'PATCH',
                headers: getAdminHeaders(),
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (!response.ok) {
                notify(data.message || 'Failed to update verified claim status');
                return;
            }

            setVerifiedItems(prev => prev.map(vItem =>
                vItem.id === item.id ? { ...vItem, status: newStatus } : vItem
            ));
        } catch (error) {
            console.error('Error updating verified claim status:', error);
            notify('Failed to update verified claim status');
        }
    };

    // Handle view verified item
    const handleViewVerifiedItem = (item) => {
        setSelectedVerifiedItem(item);
        setShowVerifiedModal(true);
    };

    const loadVerifiedData = async () => {
        setVerifiedLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/settings/verified', {
                headers: getAdminHeaders()
            });
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    notify('Admin session expired. Please login again.');
                    navigate('/login');
                    return;
                }
                notify(data.message || 'Failed to load verified items');
                return;
            }

            const mapped = (Array.isArray(data) ? data : []).map(item => ({
                id: `${item.claimType}-${item.id}`,
                originalId: item.id,
                claimType: item.claimType,
                itemName: item.itemName || 'Unknown Item',
                itemPic: item.itemPic ? `http://localhost:5000/${item.itemPic.replace(/\\/g, '/')}` : '',
                type: item.type || 'Unknown',
                foundOrLost: item.foundOrLost || '',
                postedBy: item.postedBy || { name: 'Unknown', email: 'Not available' },
                claimedBy: item.claimedBy || { name: 'Unknown', email: 'Not available' },
                status: item.status || 'Pending'
            }));
            setVerifiedItems(mapped);
        } catch (error) {
            console.error('Error loading verified items:', error);
            notify('Failed to load verified items');
        } finally {
            setVerifiedLoading(false);
        }
    };

    useEffect(() => {
        if (activeMenu === 'verified') {
            loadVerifiedData();
        }
    }, [activeMenu]);


    // Post management filter states
    const [postSearch, setPostSearch] = useState('');
    const [postDateFilter, setPostDateFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [areaFilter, setAreaFilter] = useState('');
    const [statusFilterPost, setStatusFilterPost] = useState('');

    // Modal state
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Filter posts based on all filters
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.itemName.toLowerCase().includes(postSearch.toLowerCase());
        const matchesDate = !postDateFilter || post.date === postDateFilter;
        const matchesCategory = !categoryFilter || post.category === categoryFilter;
        const matchesArea = !areaFilter || post.lostArea === areaFilter;
        const matchesStatus = !statusFilterPost || post.status === statusFilterPost;
        return matchesSearch && matchesDate && matchesCategory && matchesArea && matchesStatus;
    });
    const categoryOptions = [...new Set(posts.map(post => post.category).filter(Boolean))];
    const areaOptions = [...new Set(posts.map(post => post.lostArea).filter(Boolean))];

    // Handle post status change
    const handlePostStatusChange = async (post, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/settings/posts/${post.postType}/${post.originalId}`, {
                method: 'PATCH',
                headers: getAdminHeaders(),
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (!response.ok) {
                notify(data.message || 'Failed to update post status');
                return;
            }

            setPosts(prev => prev.map(item =>
                item.id === post.id ? { ...item, status: newStatus } : item
            ));
        } catch (error) {
            console.error('Error updating post status:', error);
            notify('Failed to update post status');
        }
    };

    // Handle view post
    const handleViewPost = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const loadPostsData = async () => {
        setPostsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/settings/posts', {
                headers: getAdminHeaders()
            });
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    notify('Admin session expired. Please login again.');
                    navigate('/login');
                    return;
                }
                notify(data.message || 'Failed to load posts');
                return;
            }

            const mappedPosts = (Array.isArray(data) ? data : []).map(item => ({
                id: `${item.postType}-${item.id}`,
                originalId: item.id,
                postType: item.postType,
                itemName: item.name || 'Unnamed Item',
                itemPic: item.image ? `http://localhost:5000/${item.image.replace(/\\/g, '/')}` : '',
                category: item.category || '',
                lostArea: item.area || '',
                date: item.date ? String(item.date).slice(0, 10) : '',
                status: item.status || 'Pending',
                description: item.description || '',
                exactLocation: item.exact_location || '',
                contact: item.contact_info || '',
                adminNotes: item.admin_notes || '',
                postedBy: item.postedBy || { name: 'Unknown', email: 'Not available' }
            }));

            setPosts(mappedPosts);
        } catch (error) {
            console.error('Error loading posts:', error);
            notify('Failed to load posts');
        } finally {
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        if (activeMenu === 'posts') {
            loadPostsData();
        }
    }, [activeMenu]);

    // Handle delete post
    const handleDeletePost = async (post) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/settings/posts/${post.postType}/${post.originalId}`, {
                method: 'DELETE',
                headers: getAdminHeaders()
            });
            const data = await response.json();
            if (!response.ok) {
                notify(data.message || 'Failed to delete post');
                return;
            }
            setPosts(prev => prev.filter(item => item.id !== post.id));
        } catch (error) {
            console.error('Error deleting post:', error);
            notify('Failed to delete post');
        }
    };

    // Handle add admin
    const handleAddAdmin = async () => {
        if (!newAdminEmail || !newAdminPassword) {
            notify('Email and password are required');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/admin/settings/admins', {
                method: 'POST',
                headers: getAdminHeaders(),
                body: JSON.stringify({
                    email: newAdminEmail,
                    password: newAdminPassword
                })
            });

            const data = await response.json();
            if (!response.ok) {
                notify(data.message || 'Failed to add admin');
                return;
            }

            setNewAdminEmail('');
            setNewAdminPassword('');
            await loadSettingsData();
            notify('Admin added successfully!');
        } catch (error) {
            console.error('Error adding admin:', error);
            notify('Failed to add admin');
        }
    };

    // Handle edit admin
    const handleEditAdmin = (admin) => {
        setSelectedAdmin(admin);
        setEditAdminEmail(admin.email);
        setEditAdminPassword('');
        setEditAdminConfirmPassword('');
        setShowAdminModal(true);
    };

    // Handle update admin
    const handleUpdateAdmin = async () => {
        if (editAdminPassword !== editAdminConfirmPassword) {
            notify('Passwords do not match!');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/admin/settings/admins/${selectedAdmin.id}`, {
                method: 'PUT',
                headers: getAdminHeaders(),
                body: JSON.stringify({
                    email: editAdminEmail,
                    password: editAdminPassword || undefined
                })
            });
            const data = await response.json();
            if (!response.ok) {
                notify(data.message || 'Failed to update admin');
                return;
            }

            setShowAdminModal(false);
            await loadSettingsData();
            notify('Admin updated successfully!');
        } catch (error) {
            console.error('Error updating admin:', error);
            notify('Failed to update admin');
        }
    };

    // Handle delete admin
    const handleDeleteAdmin = async (adminId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/settings/admins/${adminId}`, {
                method: 'DELETE',
                headers: getAdminHeaders()
            });
            const data = await response.json();
            if (!response.ok) {
                notify(data.message || 'Failed to delete admin');
                return;
            }
            await loadSettingsData();
        } catch (error) {
            console.error('Error deleting admin:', error);
            notify('Failed to delete admin');
        }
    };

    const handleSaveContactInfo = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/settings/contact', {
                method: 'PUT',
                headers: getAdminHeaders(),
                body: JSON.stringify(contactInfo)
            });
            const data = await response.json();
            if (!response.ok) {
                notify(data.message || 'Failed to update contact information');
                return;
            }
            notify('Contact information updated!');
        } catch (error) {
            console.error('Error saving contact information:', error);
            notify('Failed to update contact information');
        }
    };
    return (
        <div className="admin-dash-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">
                    <span>🔍 FindItBack</span>
                </div>

                <nav className="admin-sidebar-menu">
                    <div
                        className={`admin-menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('dashboard')}
                    >
                        <FaThLarge className="admin-menu-icon" />
                        <span>Dashboard</span>
                    </div>

                    <div
                        className={`admin-menu-item ${activeMenu === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('users')}
                    >
                        <FaUsers className="admin-menu-icon" />
                        <span>Manage Users</span>
                    </div>

                    <div
                        className={`admin-menu-item ${activeMenu === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('posts')}
                    >
                        <FaFileAlt className="admin-menu-icon" />
                        <span>Manage Posts</span>
                    </div>

                    <div
                        className={`admin-menu-item ${activeMenu === 'verified' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('verified')}
                    >
                        <FaCheckCircle className="admin-menu-icon" />
                        <span>Verified Items</span>
                    </div>

                    <div
                        className={`admin-menu-item ${activeMenu === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('messages')}
                    >
                        <FaEnvelope className="admin-menu-icon" />
                        <span>Contact Messages</span>
                    </div>

                    <div
                        className={`admin-menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('settings')}
                    >
                        <FaCog className="admin-menu-icon" />
                        <span>Setting</span>
                    </div>
                </nav>

                <div className="admin-logout-btn" onClick={() => {
                    sessionStorage.removeItem('isAdminLoggedIn');
                    sessionStorage.removeItem('adminToken');
                    sessionStorage.removeItem('isAdminMode');
                    navigate('/');
                }}>
                    <FaSignOutAlt className="admin-menu-icon" />
                    <span>Logout</span>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main-content">
                {/* Top Header */}
                <header className="admin-top-header">
                    <div className="admin-view-toggle">
                        <span className={!isAdminView ? 'active' : ''}>User View</span>
                        <div className="toggle-switch" onClick={handleViewToggle}>
                            <div className={`toggle-slider ${isAdminView ? 'admin' : 'user'}`}>
                                {isAdminView ? <FaToggleOn /> : <FaToggleOff />}
                            </div>
                        </div>
                        <span className={isAdminView ? 'active' : ''}>Admin View</span>
                    </div>
                    {/* <div className="admin-header-icons">
                        <div className="admin-header-icon">
                            <FaBell />
                        </div>
                        <div className="admin-header-icon">
                            <FaUser />
                        </div>
                    </div> */}
                </header>

                {notice && (
                    <div style={{ margin: '12px 0', padding: '10px 14px', borderRadius: '8px', background: '#fff3cd', color: '#7a5b00', border: '1px solid #ffe69c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{notice}</span>
                        <button onClick={() => setNotice('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#7a5b00', fontSize: '16px' }}>x</button>
                    </div>
                )}

                {/* Dashboard Content */}
                {activeMenu === 'dashboard' && (
                    <div className="admin-dashboard-content">
                        <h1 className="admin-page-title">Dashboard Overview</h1>
                        {dashboardLoading && <p>Loading dashboard...</p>}

                        {/* Stats Cards */}
                        <div className="admin-stats-grid">
                            <div className="admin-stat-card">
                                <div className="admin-stat-icon">Users</div>
                                <div className="admin-stat-number">{dashboardStats.totalUsers}</div>
                                <div className="admin-stat-label">Total Users</div>
                            </div>

                            <div className="admin-stat-card">
                                <div className="admin-stat-icon">Posts</div>
                                <div className="admin-stat-number">{dashboardStats.totalPosts}</div>
                                <div className="admin-stat-label">Total Posts</div>
                            </div>

                            <div className="admin-stat-card">
                                <div className="admin-stat-icon">Verified</div>
                                <div className="admin-stat-number">{dashboardStats.verifiedClaims}</div>
                                <div className="admin-stat-label">Verified Claims</div>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="admin-data-table-container">
                            <h2 style={{ marginTop: '12px', marginBottom: '20px', paddingLeft: '12px', fontSize: '20px', fontWeight: '600' }}>Recent Activities</h2>
                            <div style={{ background: 'white', borderRadius: '8px', padding: '20px' }}>
                                {dashboardActivities.map((activity, index) => (
                                    <div key={activity.id} style={{
                                        padding: '15px 0',
                                        borderBottom: index < dashboardActivities.length - 1 ? '1px solid #e0e0e0' : 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        gap: '12px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#4CAF50',
                                                marginTop: '6px',
                                                flexShrink: 0
                                            }}></div>
                                            <span style={{ fontSize: '14px', color: '#333', lineHeight: '1.4', wordBreak: 'break-word' }}>{activity.action}</span>
                                        </div>
                                        <span style={{ fontSize: '12px', color: '#999', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right', paddingTop: '2px' }}>{formatTimeAgo(activity.createdAt)}</span>
                                    </div>
                                ))}
                                {!dashboardLoading && dashboardActivities.length === 0 && (
                                    <p style={{ margin: 0, color: '#666' }}>No recent activity found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* Messages Content */}
                {activeMenu === 'messages' && (
                    <div className="admin-dashboard-content">
                        <h1 className="admin-page-title">Contact Messages</h1>
                        {messagesLoading && <p>Loading contact messages...</p>}
                        <div className="admin-data-table-container">
                            <table className="admin-data-table">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th>No.</th>
                                        <th>Sender</th>
                                        <th>Email</th>
                                        <th>Subject</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-table-body">
                                    {contactMessages.map((msg, index) => (
                                        <tr key={msg.id}>
                                            <td>{index + 1}</td>
                                            <td>{msg.name}</td>
                                            <td>{msg.email}</td>
                                            <td>{msg.subject || 'Contact Inquiry'}</td>
                                            <td>{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : '-'}</td>
                                            <td>
                                                <div className="admin-action-buttons">
                                                    <button className="admin-action-btn admin-btn-view" title="View Message" onClick={() => { setSelectedMessage(msg); setShowMessageModal(true); }}>
                                                        <FaEye />
                                                    </button>
                                                    <button className="admin-action-btn admin-btn-delete" title="Delete Message" onClick={() => handleDeleteMessage(msg.id)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {!messagesLoading && contactMessages.length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center' }}>No contact messages found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Manage Users Content */}
                {activeMenu === 'users' && (
                    <div className="admin-dashboard-content">
                        <h1 className="admin-page-title">Manage Users</h1>
                        {usersLoading && <p>Loading users...</p>}

                        {/* Search Bar and Date Filter */}
                        <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                style={{
                                    flex: '1',
                                    padding: '8px 15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    height: '38px'
                                }}
                            />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                style={{
                                    width: '200px',
                                    padding: '8px 15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    height: '38px'
                                }}
                            />
                        </div>

                        {/* Users Table */}
                        <div className="admin-data-table-container">
                            <table className="admin-data-table">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th>No.</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Logged Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-table-body">
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td>{user.fullName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.loggedDate}</td>
                                            <td>
                                                <select
                                                    value={user.status}
                                                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                                    style={{
                                                        padding: '10px 35px 10px 20px',
                                                        borderRadius: '25px',
                                                        border: 'none',
                                                        backgroundColor: user.status === 'Active' ? '#d4edda' : '#f8d7da',
                                                        color: user.status === 'Active' ? '#155724' : '#721c24',
                                                        fontWeight: '600',
                                                        fontSize: '14px',
                                                        cursor: 'pointer',
                                                        outline: 'none',
                                                        appearance: 'none',
                                                        WebkitAppearance: 'none',
                                                        MozAppearance: 'none',
                                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${user.status === 'Active' ? '%23155724' : '%23721c24'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'right 12px center',
                                                        backgroundSize: '16px',
                                                        minWidth: '120px'
                                                    }}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Block">Block</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {!usersLoading && filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center' }}>No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Manage Posts Content */}
                {activeMenu === 'posts' && (
                    <div className="admin-dashboard-content">
                        <h1 className="admin-page-title">Manage Posts</h1>
                        {postsLoading && <p>Loading posts...</p>}

                        {/* Search Bar - Row 1 */}
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Search by item name..."
                                value={postSearch}
                                onChange={(e) => setPostSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    height: '38px',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Filters - Row 2 */}
                        <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{
                                    flex: '1',
                                    padding: '8px 15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    height: '38px',
                                    outline: 'none',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="">All Categories</option>
                                {categoryOptions.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={areaFilter}
                                onChange={(e) => setAreaFilter(e.target.value)}
                                style={{
                                    flex: '1',
                                    padding: '8px 15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    height: '38px',
                                    outline: 'none',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="">All Areas</option>
                                {areaOptions.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>

                            <select
                                value={statusFilterPost}
                                onChange={(e) => setStatusFilterPost(e.target.value)}
                                style={{
                                    flex: '1',
                                    padding: '8px 15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    height: '38px',
                                    outline: 'none',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Requested">Requested</option>
                                <option value="Successful">Successful</option>
                            </select>
                        </div>

                        {/* Posts Table */}
                        <div className="admin-data-table-container">
                            <table className="admin-data-table">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th>No.</th>
                                        <th>Item Pic</th>
                                        <th>Item Name</th>
                                        <th>Category</th>
                                        <th>Lost Area</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-table-body">
                                    {filteredPosts.map((post, index) => (
                                        <tr key={post.id}>
                                            <td>{index + 1}</td>
                                            <td><img src={post.itemPic} alt={post.itemName} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }} /></td>
                                            <td>{post.itemName}</td>
                                            <td>{post.category}</td>
                                            <td>{post.lostArea}</td>
                                            <td>{post.date}</td>
                                            <td>
                                                <select
                                                    value={post.status}
                                                    onChange={(e) => handlePostStatusChange(post, e.target.value)}
                                                    style={{
                                                        padding: '10px 35px 10px 20px',
                                                        borderRadius: '25px',
                                                        border: 'none',
                                                        backgroundColor: post.status === 'Successful' ? '#d4edda' : post.status === 'Requested' ? '#fff3cd' : '#f8d7da',
                                                        color: post.status === 'Successful' ? '#155724' : post.status === 'Requested' ? '#856404' : '#721c24',
                                                        fontWeight: '600',
                                                        fontSize: '14px',
                                                        cursor: 'pointer',
                                                        outline: 'none',
                                                        appearance: 'none',
                                                        WebkitAppearance: 'none',
                                                        MozAppearance: 'none',
                                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${post.status === 'Successful' ? '%23155724' : post.status === 'Requested' ? '%23856404' : '%23721c24'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'right 12px center',
                                                        backgroundSize: '16px',
                                                        minWidth: '140px'
                                                    }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Requested">Requested</option>
                                                    <option value="Successful">Successful</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div className="admin-action-buttons">
                                                    <button className="admin-action-btn admin-btn-view" title="View Details" onClick={() => handleViewPost(post)}>
                                                        <FaEye />
                                                    </button>
                                                    <button className="admin-action-btn admin-btn-delete" title="Delete Post" onClick={() => handleDeletePost(post)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {!postsLoading && filteredPosts.length === 0 && (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center' }}>No posts found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal for Post Details */}
                {showModal && selectedPost && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }} onClick={() => setShowModal(false)}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            position: 'relative'
                        }} onClick={(e) => e.stopPropagation()}>
                            {/* Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >×</button>

                            {/* Modal Content */}
                            <h2 style={{ marginBottom: '20px', color: '#333' }}>Item Details</h2>

                            {/* Public Details */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#2c5aa0', borderBottom: '2px solid #2c5aa0', paddingBottom: '8px' }}>Public Details</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                                    <img src={selectedPost.itemPic} alt={selectedPost.itemName} style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '8px' }} />
                                    <div>
                                        <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Item Name:</strong> {selectedPost.itemName}</p>
                                        <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Category:</strong> {selectedPost.category}</p>
                                    </div>
                                </div>
                                <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Lost Area:</strong> {selectedPost.lostArea}</p>
                                <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Posted Date:</strong> {selectedPost.date}</p>
                                <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Description:</strong> {selectedPost.description}</p>
                            </div>

                            {/* Private Details */}
                            <div>
                                <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#d9534f', borderBottom: '2px solid #d9534f', paddingBottom: '8px' }}>Private Details (Admin Only)</h3>
                                <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Exact Location:</strong> {selectedPost.exactLocation}</p>
                                <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Contact Details:</strong> {selectedPost.contact}</p>
                                <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Notes for Admin:</strong> {selectedPost.adminNotes}</p>
                            </div>

                            <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
                                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#2c5aa0' }}>Posted By</h3>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Name:</strong> {selectedPost.postedBy?.name || 'Unknown'}</p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Email:</strong> {selectedPost.postedBy?.email || 'Not available'}</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* Verified Items View */}
                {activeMenu === 'verified' && (
                    <div className="admin-dashboard-content">
                        <h1 className="admin-page-title">Verified Items</h1>
                        {verifiedLoading && <p>Loading verified items...</p>}

                        {/* Search Bar */}
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Search by item name..."
                                value={verifiedSearch}
                                onChange={(e) => setVerifiedSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    height: '38px',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Verified Items Table */}
                        <div className="admin-data-table-container">
                            <table className="admin-data-table">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th>No.</th>
                                        <th>Item Pic</th>
                                        <th>Item Name</th>
                                        <th>Type</th>
                                        <th>Found or Lost</th>
                                        <th>Posted By</th>
                                        <th>Claimed By</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-table-body">
                                    {filteredVerifiedItems.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td><img src={item.itemPic} alt={item.itemName} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }} /></td>
                                            <td>{item.itemName}</td>
                                            <td>{item.type}</td>
                                            <td>{item.foundOrLost}</td>
                                            <td>{item.postedBy.name}</td>
                                            <td>{item.claimedBy.name}</td>
                                            <td>
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleVerifiedStatusChange(item, e.target.value)}
                                                    style={{
                                                        padding: '10px 35px 10px 20px',
                                                        borderRadius: '25px',
                                                        border: 'none',
                                                        backgroundColor: item.status === 'Accepted' ? '#d4edda' : '#f8d7da',
                                                        color: item.status === 'Accepted' ? '#155724' : '#721c24',
                                                        fontWeight: '600',
                                                        fontSize: '14px',
                                                        cursor: 'pointer',
                                                        outline: 'none',
                                                        appearance: 'none',
                                                        WebkitAppearance: 'none',
                                                        MozAppearance: 'none',
                                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${item.status === 'Accepted' ? '%23155724' : '%23721c24'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'right 12px center',
                                                        backgroundSize: '16px',
                                                        minWidth: '120px'
                                                    }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Accepted">Accepted</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div className="admin-action-buttons">
                                                    <button
                                                        onClick={() => handleViewVerifiedItem(item)}
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '6px',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#e3f2fd',
                                                            color: '#1976d2',
                                                            fontSize: '14px',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#1976d2';
                                                            e.currentTarget.style.color = 'white';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#e3f2fd';
                                                            e.currentTarget.style.color = '#1976d2';
                                                        }}
                                                    >
                                                        <FaEye />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {!verifiedLoading && filteredVerifiedItems.length === 0 && (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center' }}>No verified items found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Contact Message Modal */}
                {showMessageModal && selectedMessage && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }} onClick={() => setShowMessageModal(false)}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '500px',
                            width: '90%',
                            position: 'relative'
                        }} onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setShowMessageModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >×</button>

                            <h2 style={{ marginBottom: '20px', color: '#333' }}>Contact Message</h2>

                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}><strong>Name</strong></p>
                                <p style={{ fontSize: '16px', color: '#333' }}>{selectedMessage.name}</p>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}><strong>Email</strong></p>
                                <p style={{ fontSize: '16px', color: '#333' }}>{selectedMessage.email}</p>
                            </div>

                            <div>
                                <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}><strong>Message</strong></p>
                                <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>{selectedMessage.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Verified Item Detail Modal */}
                {showVerifiedModal && selectedVerifiedItem && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}
                        onClick={() => setShowVerifiedModal(false)}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '30px',
                                maxWidth: '600px',
                                width: '90%',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                position: 'relative'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowVerifiedModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>

                            <h2 style={{ fontSize: '24px', marginBottom: '25px', color: '#1e3a5f' }}>Item Details</h2>

                            {/* Item Information */}
                            <div style={{ marginBottom: '25px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                    <img src={selectedVerifiedItem.itemPic} alt={selectedVerifiedItem.itemName} style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '8px' }} />
                                    <div>
                                        <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '600' }}>{selectedVerifiedItem.itemName}</p>
                                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}><strong>Type:</strong> {selectedVerifiedItem.type}</p>
                                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}><strong>Status:</strong> {selectedVerifiedItem.foundOrLost}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Posted By Details */}
                            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#1976d2' }}>Posted By</h3>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Name:</strong> {selectedVerifiedItem.postedBy.name}</p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Email:</strong> {selectedVerifiedItem.postedBy.email}</p>
                            </div>

                            {/* Claimed By Details */}
                            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#f57c00' }}>Claimed By</h3>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Name:</strong> {selectedVerifiedItem.claimedBy.name}</p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Email:</strong> {selectedVerifiedItem.claimedBy.email}</p>
                            </div>

                            {/* Status */}
                            <div style={{ padding: '15px', backgroundColor: selectedVerifiedItem.status === 'Accepted' ? '#d4edda' : '#f8d7da', borderRadius: '8px' }}>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: selectedVerifiedItem.status === 'Accepted' ? '#155724' : '#721c24' }}>
                                    <strong>Verification Status:</strong> {selectedVerifiedItem.status}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Content */}
                {activeMenu === 'settings' && (
                    <div className="admin-dashboard-content">
                        <h1 className="admin-page-title">Settings</h1>
                        {settingsLoading && <p>Loading settings...</p>}

                        {/* Contact Information */}
                        <div style={{ marginBottom: '40px', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1e3a5f' }}>Manage Contact Information</h2>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>📧 Email</label>
                                <input
                                    type="email"
                                    value={contactInfo.email}
                                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>📞 Phone</label>
                                <input
                                    type="text"
                                    value={contactInfo.phone}
                                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>🕒 Working Hours</label>
                                <input
                                    type="text"
                                    value={contactInfo.workingHours}
                                    onChange={(e) => setContactInfo({ ...contactInfo, workingHours: e.target.value })}
                                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>

                            <button
                                onClick={handleSaveContactInfo}
                                style={{ padding: '10px 25px', background: '#2c5282', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                            >
                                Save Changes
                            </button>
                        </div>

                        {/* Admin Management */}
                        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1e3a5f' }}>Admin Management</h2>
                            
                            {/* Add Admin Form */}
                            <div style={{ marginBottom: '25px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>Add New Admin</h3>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                    <input
                                        type="email"
                                        placeholder="Admin Email"
                                        value={newAdminEmail}
                                        onChange={(e) => setNewAdminEmail(e.target.value)}
                                        style={{ flex: 1, padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={newAdminPassword}
                                        onChange={(e) => setNewAdminPassword(e.target.value)}
                                        style={{ flex: 1, padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                                    />
                                </div>
                                <button
                                    onClick={handleAddAdmin}
                                    style={{ padding: '10px 25px', background: '#2c5282', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                                >
                                    Add Admin
                                </button>
                            </div>

                            {/* Admin List Table */}
                            <div className="admin-data-table-container">
                                <table className="admin-data-table">
                                    <thead className="admin-table-header">
                                        <tr>
                                            <th>No.</th>
                                            <th>Admin Email</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="admin-table-body">
                                        {admins.map((admin, index) => (
                                            <tr key={admin.id}>
                                                <td>{index + 1}</td>
                                                <td>{admin.email}</td>
                                                <td>
                                                    <div className="admin-action-buttons">
                                                        <button className="admin-action-btn admin-btn-edit" title="Edit Admin" onClick={() => handleEditAdmin(admin)}>
                                                            <FaEdit />
                                                        </button>
                                                        <button className="admin-action-btn admin-btn-delete" title="Delete Admin" onClick={() => handleDeleteAdmin(admin.id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Admin Modal */}
                {showAdminModal && selectedAdmin && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }} onClick={() => setShowAdminModal(false)}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '450px',
                            width: '90%',
                            position: 'relative'
                        }} onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setShowAdminModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >×</button>

                            <h2 style={{ marginBottom: '20px', color: '#333' }}>Edit Admin</h2>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Email</label>
                                <input
                                    type="email"
                                    value={editAdminEmail}
                                    onChange={(e) => setEditAdminEmail(e.target.value)}
                                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>New Password</label>
                                <input
                                    type="password"
                                    value={editAdminPassword}
                                    onChange={(e) => setEditAdminPassword(e.target.value)}
                                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    value={editAdminConfirmPassword}
                                    onChange={(e) => setEditAdminConfirmPassword(e.target.value)}
                                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>

                            <button
                                onClick={handleUpdateAdmin}
                                style={{ width: '100%', padding: '12px', background: '#2c5282', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                )}

                {/* Other views placeholders */}
                {activeMenu !== 'dashboard' && activeMenu !== 'messages' && activeMenu !== 'users' && activeMenu !== 'posts' && activeMenu !== 'verified' && activeMenu !== 'settings' && (
                    <div className="admin-dashboard-content">
                        <h1 className="admin-page-title">{activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}</h1>
                        <p>This section is under development.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;






