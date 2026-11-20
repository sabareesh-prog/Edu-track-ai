/**
 * Supabase Client Integration for EduTrack AI
 * Project: https://kwnpeveeeyqjzrnrhrth.supabase.co
 */

(function () {
    const SUPABASE_URL = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || 'https://kwnpeveeeyqjzrnrhrth.supabase.co';
    let SUPABASE_ANON_KEY = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || localStorage.getItem('supabase_anon_key') || '';

    let supabaseClient = null;

    // Load Supabase JS SDK if not present
    function loadSupabaseSDK(callback) {
        if (window.supabase) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => callback();
        script.onerror = () => console.error('Failed to load Supabase SDK from CDN.');
        document.head.appendChild(script);
    }

    function initClient() {
        if (!SUPABASE_ANON_KEY) {
            renderKeyPromptModal();
            return;
        }

        try {
            if (window.supabase && window.supabase.createClient) {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                window.supabaseClient = supabaseClient;
                console.log('✅ Supabase connected to:', SUPABASE_URL);
                renderConnectionStatus(true);
            }
        } catch (e) {
            console.error('Supabase initialization failed:', e);
            renderConnectionStatus(false, e.message);
        }
    }

    // Modal to prompt user for anon key if not yet set
    function renderKeyPromptModal() {
        if (document.getElementById('supabase-key-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'supabase-key-modal';
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-[28px] duo-card max-w-md w-full p-6 text-center shadow-2xl border-4 border-[#1CB0F6]">
                <div class="w-14 h-14 rounded-2xl bg-[#1CB0F6]/10 text-[#1CB0F6] flex items-center justify-center mx-auto mb-4">
                    <iconify-icon icon="lucide:database" class="text-3xl"></iconify-icon>
                </div>
                <h3 class="text-xl font-black text-[#4B4B4B] mb-1">Connect Supabase Backend</h3>
                <p class="text-xs font-bold text-gray-500 mb-4 leading-relaxed">
                    Project URL: <span class="font-mono text-[#1CB0F6] break-all">${SUPABASE_URL}</span><br>
                    Please enter your <strong class="text-[#4B4B4B]">anon (public) API key</strong> from Supabase Dashboard (<span class="italic">Project Settings &rarr; API &rarr; anon public</span>):
                </p>
                <div class="space-y-3 mb-5">
                    <input type="text" id="supabase-key-input" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..." 
                           class="w-full px-4 py-3 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl font-mono text-xs focus:outline-none focus:border-[#1CB0F6]">
                </div>
                <div class="flex gap-2">
                    <button id="btn-save-supabase-key" class="flex-1 py-3 bg-[#58CC02] hover:bg-[#46A302] text-white font-black text-xs uppercase tracking-wider rounded-xl btn-3d border-b-[#46A302]">
                        Save & Connect
                    </button>
                    <button id="btn-skip-supabase-key" class="px-4 py-3 bg-gray-100 text-gray-500 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-gray-200">
                        Later
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('btn-save-supabase-key').addEventListener('click', () => {
            const key = document.getElementById('supabase-key-input').value.trim();
            if (key) {
                localStorage.setItem('supabase_anon_key', key);
                SUPABASE_ANON_KEY = key;
                modal.remove();
                initClient();
            } else {
                alert('Please enter a valid Supabase anon key.');
            }
        });

        document.getElementById('btn-skip-supabase-key').addEventListener('click', () => {
            modal.remove();
        });
    }

    // Top subtle badge showing Supabase status
    function renderConnectionStatus(connected, err) {
        let badge = document.getElementById('supabase-status-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'supabase-status-badge';
            badge.className = 'fixed bottom-4 left-4 z-50 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md cursor-pointer transition-all';
            document.body.appendChild(badge);
            badge.addEventListener('click', () => renderKeyPromptModal());
        }

        if (connected) {
            badge.className = 'fixed bottom-4 left-4 z-50 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md bg-white border border-[#58CC02] text-[#58CC02]';
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#58CC02] animate-pulse"></span> Supabase Connected`;
            badge.title = 'Connected to ' + SUPABASE_URL + ' (Click to change key)';
        } else {
            badge.className = 'fixed bottom-4 left-4 z-50 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md bg-white border border-[#FF9600] text-[#FF9600]';
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#FF9600]"></span> Set Supabase Key`;
            badge.title = err ? 'Error: ' + err : 'Click to configure Supabase API key';
        }
    }

    // Global EduTrack Supabase Helper Methods
    window.eduSupabase = {
        getUrl: () => SUPABASE_URL,
        getClient: () => supabaseClient,
        isConnected: () => !!supabaseClient,

        // Auth
        signIn: async (email, password) => {
            if (!supabaseClient) return { error: { message: 'Supabase client not initialized' } };
            return await supabaseClient.auth.signInWithPassword({ email, password });
        },
        signUp: async (email, password, metadata = {}) => {
            if (!supabaseClient) return { error: { message: 'Supabase client not initialized' } };
            return await supabaseClient.auth.signUp({
                email,
                password,
                options: { data: metadata }
            });
        },
        signOut: async () => {
            if (!supabaseClient) return;
            return await supabaseClient.auth.signOut();
        },
        getCurrentUser: async () => {
            if (!supabaseClient) return null;
            const { data } = await supabaseClient.auth.getUser();
            return data && data.user;
        },

        // Assignments
        getAssignments: async () => {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient.from('assignments').select('*').order('due_date', { ascending: true });
            if (error) console.warn('Supabase fetch assignments:', error.message);
            return data;
        },
        addAssignment: async (task) => {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient.from('assignments').insert([task]).select();
            if (error) console.error('Supabase add assignment:', error.message);
            return data;
        },
        toggleAssignment: async (id, isCompleted) => {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient.from('assignments').update({ status: isCompleted ? 'completed' : 'pending' }).eq('id', id);
            return data;
        },

        // Announcements
        getAnnouncements: async () => {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient.from('announcements').select('*').order('created_at', { ascending: false });
            if (error) console.warn('Supabase fetch announcements:', error.message);
            return data;
        },
        addAnnouncement: async (announcement) => {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient.from('announcements').insert([announcement]).select();
            if (error) console.error('Supabase add announcement:', error.message);
            return data;
        }
    };

    // Run on script load
    loadSupabaseSDK(() => {
        initClient();
    });
})();
