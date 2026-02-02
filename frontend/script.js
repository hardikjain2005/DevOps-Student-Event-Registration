document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const formMessage = document.getElementById('formMessage');
    const participantsTableBody = document.querySelector('#participantsTable tbody');
    const refreshBtn = document.getElementById('refreshBtn');
    const btnText = document.getElementById('btnText');

    // API URL - change if hosted elsewhere
    // Production: https://devops-student-event-registration.onrender.com/api
    const API_URL = 'http://localhost:3000/api';

    // Handle Form Submission
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = registrationForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        btnText.innerHTML = '<span class="spinner"></span> Registering...';

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            contact: document.getElementById('contact').value.trim(),
            event: document.getElementById('event').value
        };

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('success', '✅ Registration successful!');
                registrationForm.reset();
                fetchParticipants();
            } else {
                showMessage('error', `❌ ${data.error || 'Registration failed. Please try again.'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', '❌ Network error. Please make sure the backend is running.');
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = 'Register Now';
        }
    });

    // Fetch Participants
    async function fetchParticipants() {
        try {
            const response = await fetch(`${API_URL}/registrations`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const participants = await response.json();
            renderTable(participants);

        } catch (error) {
            console.error('Error fetching participants:', error);
            participantsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state" style="color: var(--error)">
                        ⚠️ Error connecting to server. Is the backend running?
                    </td>
                </tr>
            `;
        }
    }

    // Render Table
    function renderTable(participants) {
        participantsTableBody.innerHTML = '';

        if (!participants || participants.length === 0) {
            participantsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">📭 No registrations yet.</td>
                </tr>
            `;
            return;
        }

        participants.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="participant-id">#${p.id}</td>
                <td class="participant-name">${escapeHtml(p.name)}</td>
                <td>${escapeHtml(p.email)}</td>
                <td><span class="event-badge">${escapeHtml(p.event)}</span></td>
                <td>${escapeHtml(p.contact)}</td>
            `;
            participantsTableBody.appendChild(row);
        });
    }

    // Prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show Message
    function showMessage(type, text) {
        formMessage.textContent = text;
        formMessage.className = `message ${type}`;

        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Event Listeners
    refreshBtn.addEventListener('click', () => {
        refreshBtn.textContent = '⏳ Loading...';
        fetchParticipants();
        setTimeout(() => {
            refreshBtn.textContent = '🔄 Refresh';
        }, 500);
    });

    // Initial Load
    fetchParticipants();
});
