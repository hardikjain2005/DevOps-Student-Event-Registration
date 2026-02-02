document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const formMessage = document.getElementById('formMessage');
    const participantsTableBody = document.querySelector('#participantsTable tbody');
    const refreshBtn = document.getElementById('refreshBtn');

    // API URL - change if hosted elsewhere
    const API_URL = 'http://localhost:3000/api';

    // Handle Form Submission
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable button to prevent double submit
        const submitBtn = registrationForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = 'Registering...';

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            contact: document.getElementById('contact').value,
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
                showMessage('success', 'Registration successful!');
                registrationForm.reset();
                fetchParticipants(); // Update admin view automatically
            } else {
                showMessage('error', data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', 'Network error. Please make sure the backend is running.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });

    // Fetch Participants for Admin View
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
                    <td colspan="5" class="empty-state" style="color: var(--error-color)">
                        Error connecting to server. Is the backend running?
                    </td>
                </tr>
            `;
        }
    }

    // Render Table
    function renderTable(participants) {
        participantsTableBody.innerHTML = '';

        if (participants.length === 0) {
            participantsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">No registrations yet.</td>
                </tr>
            `;
            return;
        }

        participants.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${p.id}</td>
                <td>${escapeHtml(p.name)}</td>
                <td>${escapeHtml(p.email)}</td>
                <td>${escapeHtml(p.event)}</td>
                <td>${escapeHtml(p.contact)}</td>
            `;
            participantsTableBody.appendChild(row);
        });
    }

    // Helper to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Show Message Helper
    function showMessage(type, text) {
        formMessage.textContent = text;
        formMessage.className = `message ${type}`;

        // Hide success message after a few seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Event Listeners
    refreshBtn.addEventListener('click', fetchParticipants);

    // Initial Load
    fetchParticipants();
});
