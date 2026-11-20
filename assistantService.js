/**
 * EduTrack AI - Supabase Connected Academic Assistant Service
 */

window.AssistantService = {
    // Session ID for current conversation
    sessionId: localStorage.getItem('edutrack_chat_session') || (() => {
        const id = 'session_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('edutrack_chat_session', id);
        return id;
    })(),

    // Fetch message history from Supabase
    async getHistory() {
        if (window.eduSupabase && window.eduSupabase.isConnected()) {
            try {
                const client = window.eduSupabase.getClient();
                const { data, error } = await client
                    .from('chat_messages')
                    .select('*')
                    .order('created_at', { ascending: true })
                    .limit(50);
                
                if (!error && data && data.length > 0) {
                    return data;
                }
            } catch (err) {
                console.warn('Could not read chat_messages from Supabase, falling back to local:', err);
            }
        }
        
        // Local fallback
        const local = localStorage.getItem('edutrack_chat_history');
        return local ? JSON.parse(local) : [];
    },

    // Save message to Supabase
    async saveMessage(role, content) {
        const msg = {
            role,
            content,
            created_at: new Date().toISOString()
        };

        // Cache locally
        try {
            const history = await this.getHistory();
            history.push(msg);
            localStorage.setItem('edutrack_chat_history', JSON.stringify(history.slice(-50)));
        } catch (e) {}

        // Persist to Supabase
        if (window.eduSupabase && window.eduSupabase.isConnected()) {
            try {
                const client = window.eduSupabase.getClient();
                await client.from('chat_messages').insert([{
                    role,
                    content,
                    session_id: this.sessionId
                }]);
            } catch (err) {
                console.warn('Supabase message persist error:', err);
            }
        }
        return msg;
    },

    // Fetch live academic context from Supabase (Assignments, Announcements)
    async getSupabaseContext() {
        let assignments = [];
        let announcements = [];

        if (window.eduSupabase && window.eduSupabase.isConnected()) {
            const client = window.eduSupabase.getClient();
            try {
                const { data: assignData } = await client.from('assignments').select('*').limit(10);
                if (assignData) assignments = assignData;
            } catch (e) {}

            try {
                const { data: annData } = await client.from('announcements').select('*').limit(5);
                if (annData) announcements = annData;
            } catch (e) {}
        }

        return { assignments, announcements };
    },

    // Generate intelligent contextual response
    async processPrompt(userText) {
        const lower = userText.toLowerCase().trim();
        const { assignments, announcements } = await this.getSupabaseContext();

        // 1. Inquiries about Assignments / Tasks / Deadlines
        if (lower.includes('assignment') || lower.includes('task') || lower.includes('homework') || lower.includes('due') || lower.includes('deadline')) {
            if (assignments && assignments.length > 0) {
                const pending = assignments.filter(a => a.status !== 'completed');
                let reply = `Here are your current assignments from your **Supabase database**:\n\n`;
                if (pending.length > 0) {
                    reply += `📋 **Pending Tasks (${pending.length}):**\n`;
                    pending.forEach(a => {
                        reply += `• **${a.title}** (${a.course}) — Due: ${a.due_date ? new Date(a.due_date).toLocaleDateString() : 'Upcoming'} (+${a.xp_reward || 100} XP)\n`;
                    });
                } else {
                    reply += `🎉 All assignments are currently completed! Great job keeping up your streak!\n`;
                }
                reply += `\n*Tip: Complete assignments early to earn extra XP and maintain your daily streak!*`;
                return reply;
            } else {
                return `I checked your **Supabase database**, but there are no assignments recorded in the \`assignments\` table yet. You can add one anytime from the Tasks page or via Supabase SQL Editor!`;
            }
        }

        // 2. Inquiries about Announcements / Notices / Campus News
        if (lower.includes('announcement') || lower.includes('notice') || lower.includes('news') || lower.includes('feed') || lower.includes('exam')) {
            if (announcements && announcements.length > 0) {
                let reply = `📢 Here are the latest campus updates from your **Supabase database**:\n\n`;
                announcements.forEach(a => {
                    reply += `• **${a.title}** [${a.tag || 'Notice'}]\n  "${a.content || a.message || ''}" — *${a.author || 'Faculty'}*\n\n`;
                });
                return reply;
            } else {
                return `There are currently no active announcements found in your Supabase \`announcements\` table. Check back soon for faculty updates!`;
            }
        }

        // 3. Document Summarization
        if (lower.includes('summarize') || lower.includes('summary') || lower.includes('notes')) {
            return `📚 **Study Summary & Key Concepts:**\n\n` +
                   `• **Core Idea:** Prioritize foundational understanding before solving complex problem sets.\n` +
                   `• **Active Recall:** Testing yourself with flashcards improves retention by over 70% compared to passive reading.\n` +
                   `• **Next Steps:** Would you like me to generate 3 quick quiz questions to test your knowledge on this topic?`;
        }

        // 4. Study Suggestions
        if (lower.includes('study') || lower.includes('suggest') || lower.includes('plan')) {
            return `🎯 **Smart Study Plan for Today:**\n\n` +
                   `1. **Focus Sprint (25 mins):** Tackle your upcoming assignment with high priority.\n` +
                   `2. **Quick Review (10 mins):** Review yesterday's lecture slides.\n` +
                   `3. **Break (5 mins):** Grab some water and stretch!\n\n` +
                   `You're only 1 study session away from extending your streak! Ready to dive in?`;
        }

        // 5. Default Academic AI Help
        return `I'm your **EduTrack AI Assistant** connected directly to your **Supabase database**!\n\n` +
               `Here are a few things you can ask me:\n` +
               `• *"What assignments do I have due?"* (Queries live Supabase tasks)\n` +
               `• *"Show me the latest announcements"* (Queries Supabase announcements)\n` +
               `• *"Explain Binary Search vs Linear Search"*\n` +
               `• *"Summarize my lecture notes"*\n` +
               `• *"Give me study suggestions for midterms"*\n\n` +
               `What would you like help with?`;
    }
};
