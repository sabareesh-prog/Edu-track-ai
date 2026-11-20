/**
 * EduTrack AI - Shared Core System (Vanilla JavaScript & localStorage)
 * Duolingo-style Education Management System (Team 4)
 */

// ==========================================
// 1. LocalStorage Helpers
// ==========================================
function getData(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Error reading localStorage for key:', key, e);
        return defaultValue;
    }
}

function setData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage for key:', key, e);
    }
}

// ==========================================
// 2. Demo Data Seeding
// ==========================================
function initDemoData() {
    if (!getData('edutrack_initialized_v2')) {
        // Student Profile (Priya, Level 12, streak 7, 1200 points, goal 3/4)
        setData('edutrack_student', {
            name: 'Priya Sharma',
            email: 'student@edutrack.ai',
            role: 'student',
            level: 12,
            streak: 7,
            points: 1200,
            dailyGoalTarget: 4
        });

        // Demo User Accounts
        setData('edutrack_accounts', [
            { id: 'acc_1', email: 'student@edutrack.ai', password: 'password123', name: 'Priya Sharma', role: 'student', status: 'Active' },
            { id: 'acc_2', email: 'faculty@edutrack.ai', password: 'password123', name: 'Prof. Arun Kumar', role: 'faculty', status: 'Active' },
            { id: 'acc_3', email: 'admin@edutrack.ai', password: 'password123', name: 'Ms. Kavitha', role: 'admin', status: 'Active' }
        ]);

        // Default Active Session
        setData('edutrack_session', {
            isLoggedIn: true,
            user: { name: 'Priya Sharma', email: 'student@edutrack.ai', role: 'student' }
        });

        // Date helper for realistic deadlines
        const today = new Date();
        const formatDate = (offsetDays) => {
            const d = new Date(today);
            d.setDate(d.getDate() + offsetDays);
            return d.toISOString().split('T')[0];
        };

        // Tasks List: 3 Completed and 3 Pending (so 3/4 of daily goal target is done = 75%)
        setData('edutrack_tasks', [
            {
                id: 'task_1',
                title: 'Physics Lab Report',
                subject: 'Physics 101',
                deadline: formatDate(0), // Due Today
                status: 'In Progress',
                xp: 150
            },
            {
                id: 'task_2',
                title: 'Data Structures HW',
                subject: 'Computer Science',
                deadline: formatDate(1), // Due Tomorrow
                status: 'Not Started',
                xp: 120
            },
            {
                id: 'task_3',
                title: 'Math Integration Quiz',
                subject: 'Math 150',
                deadline: formatDate(3), // Due in 3 days
                status: 'Not Started',
                xp: 100
            },
            {
                id: 'task_4',
                title: 'Algebra Quiz 4',
                subject: 'Math 150',
                deadline: formatDate(-1),
                status: 'Completed',
                xp: 100
            },
            {
                id: 'task_5',
                title: 'History Essay: Renaissance Era',
                subject: 'History',
                deadline: formatDate(-2),
                status: 'Completed',
                xp: 150
            },
            {
                id: 'task_6',
                title: 'Literature Reading Critique',
                subject: 'Literature',
                deadline: formatDate(-3),
                status: 'Completed',
                xp: 100
            }
        ]);

        // Initial Announcements List
        setData('edutrack_announcements', [
            {
                id: 'ann_1',
                title: 'Midterm Schedule Released',
                author: 'Prof. Arun',
                time: '10m ago',
                category: 'academic',
                urgent: true,
                content: 'The finalized midterm exam schedule for the Winter semester has been uploaded. Please check your assigned department halls.',
                isNew: true,
                read: false
            },
            {
                id: 'ann_2',
                title: 'Library Hours Extended',
                author: 'Admin',
                time: '2h ago',
                category: 'campus',
                urgent: false,
                content: 'The central library will remain open 24/7 starting next Monday to support your study marathons.',
                isNew: false,
                read: true
            },
            {
                id: 'ann_3',
                title: 'New AI Assistant Feature!',
                author: 'AI Team',
                time: '5h ago',
                category: 'academic',
                urgent: false,
                content: 'Your Academic Assistant can now summarize PDFs directly! Just upload notes and ask "Summarize this".',
                isNew: true,
                read: false
            },
            {
                id: 'ann_4',
                title: 'Guest Lecture: Quantum Computing',
                author: 'Dr. Smith',
                time: 'Yesterday',
                category: 'campus',
                urgent: false,
                content: 'Join us for an insightful talk on Quantum Computing this Friday in Auditorium B. Refreshments provided.',
                isNew: false,
                read: true
            }
        ]);

        setData('edutrack_initialized_v2', true);
    }
}

// Initialize on parse
initDemoData();

// ==========================================
// 3. Student Profile & Points
// ==========================================
function getStudentProfile() {
    return getData('edutrack_student', {
        name: 'Priya Sharma',
        email: 'student@edutrack.ai',
        role: 'student',
        level: 12,
        streak: 7,
        points: 1200,
        dailyGoalTarget: 4
    });
}

function saveStudentProfile(profile) {
    setData('edutrack_student', profile);
}

function addPoints(amount) {
    const student = getStudentProfile();
    student.points = (student.points || 0) + amount;
    const newLevel = Math.floor(student.points / 500) + 10;
    let leveledUp = false;
    if (newLevel > student.level) {
        student.level = newLevel;
        leveledUp = true;
    }
    saveStudentProfile(student);
    if (leveledUp) {
        showToast('Level Up! 🏆', `Awesome! You reached Level ${student.level}!`, 'lucide:trophy', '#FFC800');
    }
    return student;
}

// ==========================================
// 4. Session & Authentication
// ==========================================
function getSession() {
    return getData('edutrack_session', { isLoggedIn: false, user: null });
}

function setSession(user) {
    if (user) {
        setData('edutrack_session', { isLoggedIn: true, user });
    } else {
        setData('edutrack_session', { isLoggedIn: false, user: null });
    }
}

function logoutUser() {
    setData('edutrack_session', { isLoggedIn: false, user: null });
    showToast('Signed Out', 'You have been safely signed out.', 'lucide:log-out', '#1CB0F6');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 600);
}

function getAccounts() {
    return getData('edutrack_accounts', []);
}

function saveAccounts(accounts) {
    setData('edutrack_accounts', accounts);
}

// ==========================================
// 5. Tasks Management
// ==========================================
function getTasks() {
    return getData('edutrack_tasks', []);
}

function saveTasks(tasks) {
    setData('edutrack_tasks', tasks);
}

function addTask(task) {
    const tasks = getTasks();
    tasks.unshift(task);
    saveTasks(tasks);
    return tasks;
}

function deleteTask(taskId) {
    const tasks = getTasks().filter(t => t.id !== taskId);
    saveTasks(tasks);
    return tasks;
}

function updateTaskStatus(taskId, newStatus) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const oldStatus = task.status;
        task.status = newStatus;
        saveTasks(tasks);
        if (newStatus === 'Completed' && oldStatus !== 'Completed') {
            addPoints(100);
            showToast('+100 XP Earned! ⚡', `Completed "${task.title}"`, 'lucide:zap', '#58CC02');
        }
    }
    return tasks;
}

function getDailyGoalProgress() {
    const tasks = getTasks();
    const student = getStudentProfile();
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    const target = student.dailyGoalTarget || 4;
    const percent = Math.min(100, Math.round((completedCount / target) * 100));
    return { completed: completedCount, target, percent };
}

// Deadline calculation
function getDeadlineStatus(deadlineStr) {
    if (!deadlineStr) {
        return { label: 'Upcoming', class: 'text-gray-400 bg-gray-100', isOverdue: false, isDueSoon: false };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);

    const diffMs = deadline - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {
            label: 'Overdue',
            class: 'text-[#FF4B4B] bg-[#FF4B4B]/10 border border-[#FF4B4B]/30',
            borderClass: 'border-l-[#FF4B4B]',
            color: '#FF4B4B',
            isOverdue: true,
            isDueSoon: false
        };
    } else if (diffDays === 0) {
        return {
            label: 'Due Today',
            class: 'text-[#FF4B4B] bg-[#FF4B4B]/10 border border-[#FF4B4B]/30',
            borderClass: 'border-l-[#FF4B4B]',
            color: '#FF4B4B',
            isOverdue: false,
            isDueSoon: true
        };
    } else if (diffDays === 1) {
        return {
            label: 'Due Tomorrow',
            class: 'text-[#FF9600] bg-[#FF9600]/10 border border-[#FF9600]/30',
            borderClass: 'border-l-[#FF9600]',
            color: '#FF9600',
            isOverdue: false,
            isDueSoon: true
        };
    } else {
        return {
            label: `Due in ${diffDays}d`,
            class: 'text-[#58CC02] bg-[#58CC02]/10 border border-[#58CC02]/20',
            borderClass: 'border-l-[#58CC02]',
            color: '#58CC02',
            isOverdue: false,
            isDueSoon: false
        };
    }
}

// ==========================================
// 6. Announcements Management
// ==========================================
function getAnnouncements() {
    return getData('edutrack_announcements', []);
}

function saveAnnouncements(announcements) {
    setData('edutrack_announcements', announcements);
}

function addAnnouncement(ann) {
    const list = getAnnouncements();
    list.unshift(ann);
    saveAnnouncements(list);
    return list;
}

// ==========================================
// 7. Universal Toast Notifications
// ==========================================
function showToast(title, msg, icon = 'lucide:check-circle', color = '#58CC02') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white border-2 border-[#E5E5E5] border-b-4 rounded-2xl p-4 flex items-center gap-4 shadow-2xl z-[9999] transform -translate-y-40 transition-all duration-300 pointer-events-none';
        toast.innerHTML = `
            <div id="toast-icon-box" class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <iconify-icon id="toast-icon-el" class="text-2xl"></iconify-icon>
            </div>
            <div class="flex-1 pr-2">
                <h5 id="toast-title-el" class="font-black text-sm uppercase leading-none mb-1 text-[#4B4B4B]"></h5>
                <p id="toast-msg-el" class="font-bold text-xs text-gray-500 leading-snug"></p>
            </div>
        `;
        document.body.appendChild(toast);
    }

    const titleEl = toast.querySelector('#toast-title-el') || document.getElementById('toast-title-el');
    const msgEl = toast.querySelector('#toast-msg-el') || document.getElementById('toast-msg-el');
    const box = toast.querySelector('#toast-icon-box') || document.getElementById('toast-icon-box');
    const iconEl = toast.querySelector('#toast-icon-el') || document.getElementById('toast-icon-el');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = msg;
    if (box) {
        box.style.backgroundColor = color + '20';
        box.style.color = color;
    }
    if (iconEl) iconEl.setAttribute('icon', icon);

    toast.classList.remove('-translate-y-40', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (window._toastTimeout) clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-40', 'opacity-0');
    }, 3200);
}

// ==========================================
// 8. Universal Navigation & Active Tab Highlighter
// ==========================================
function setupNavigation() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    const navMap = {
        'student.html': 'nav-home',
        'assignments.html': 'nav-assignments',
        'assistant.html': 'nav-ai',
        'announcements.html': 'nav-announcements',
        'login.html': 'nav-profile'
    };

    const activeTabId = navMap[filename];

    const navItems = [
        { id: 'nav-home', href: 'student.html' },
        { id: 'nav-assignments', href: 'assignments.html' },
        { id: 'nav-ai', href: 'assistant.html' },
        { id: 'nav-announcements', href: 'announcements.html' },
        { id: 'nav-profile', href: 'login.html' }
    ];

    navItems.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) {
            el.setAttribute('href', item.href);
            const isActive = item.id === activeTabId;
            const icon = el.querySelector('iconify-icon');
            const label = el.querySelector('span');
            const iconWrapper = el.querySelector('div');

            if (item.id === 'nav-ai') {
                // Central floating sparkle button
                return;
            }

            if (isActive) {
                if (icon) icon.className = 'text-2xl text-[#58CC02]';
                if (label) label.className = 'text-[10px] font-black text-[#58CC02] uppercase tracking-widest';
                if (iconWrapper) iconWrapper.className = 'w-12 h-8 rounded-xl bg-[#58CC02]/10 flex items-center justify-center';
            } else {
                if (icon) icon.className = 'text-2xl text-gray-300 group-hover:text-[#58CC02] transition-colors';
                if (label) label.className = 'text-[10px] font-black text-gray-400 uppercase tracking-widest';
                if (iconWrapper) iconWrapper.className = 'w-12 h-8 rounded-xl flex items-center justify-center';
            }
        }
    });

    // Special handling for Profile tab: Click shows profile popup with Logout option if logged in
    const profileBtn = document.getElementById('nav-profile');
    if (profileBtn && filename !== 'login.html') {
        const session = getSession();
        if (session.isLoggedIn && session.user) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showProfileModal(session.user);
            });
        }
    }
}

// User Profile & Logout Modal
function showProfileModal(user) {
    let modal = document.getElementById('user-profile-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'user-profile-modal';
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4';
        document.body.appendChild(modal);
    }

    const student = getStudentProfile();

    modal.innerHTML = `
        <div class="bg-white rounded-[28px] duo-card max-w-sm w-full p-6 text-center shadow-2xl relative">
            <button id="close-profile-modal" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
            </button>
            <div class="w-16 h-16 rounded-2xl bg-[#58CC02] text-white flex items-center justify-center mx-auto mb-3 shadow-md btn-3d border-b-[#46A302]">
                <iconify-icon icon="lucide:graduation-cap" class="text-3xl"></iconify-icon>
            </div>
            <h3 class="text-xl font-black text-[#4B4B4B]">${user.name || 'Priya Sharma'}</h3>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">${user.role ? user.role.toUpperCase() : 'STUDENT'} • Level ${student.level || 12}</p>

            <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="duo-card rounded-xl p-3 bg-gray-50">
                    <p class="text-[10px] font-black uppercase text-gray-400">Total XP</p>
                    <p class="text-lg font-black text-[#FFC800]">${student.points || 1200} ⚡</p>
                </div>
                <div class="duo-card rounded-xl p-3 bg-gray-50">
                    <p class="text-[10px] font-black uppercase text-gray-400">Streak</p>
                    <p class="text-lg font-black text-[#FF9600]">${student.streak || 7} Days 🔥</p>
                </div>
            </div>

            <div class="space-y-2">
                <button onclick="logoutUser()" class="w-full py-3.5 bg-[#FF4B4B] hover:bg-[#EA2B2B] text-white font-black text-xs uppercase tracking-wider rounded-xl btn-3d border-b-[#EA2B2B] flex items-center justify-center gap-2 cursor-pointer">
                    <iconify-icon icon="lucide:log-out" class="text-base"></iconify-icon>
                    Log Out
                </button>
                <button id="dismiss-profile-modal" class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer">
                    Close
                </button>
            </div>
        </div>
    `;

    document.getElementById('close-profile-modal').addEventListener('click', () => modal.remove());
    document.getElementById('dismiss-profile-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Auto-run navigation on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
});
