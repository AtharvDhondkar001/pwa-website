// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// PWA Install Prompt
let deferredPrompt;
const installPrompt = document.getElementById('install-prompt');
const installBtn = document.getElementById('install-btn');
const dismissBtn = document.getElementById('dismiss-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67+ from showing mini-infobar
    e.preventDefault();
    
    // Save the prompt for manual triggering
    deferredPrompt = e;
    
    // Show install banner
    installPrompt.style.display = 'flex';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        
        // Clear the deferredPrompt so it can't be used again
        deferredPrompt = null;
        
        // Hide banner
        installPrompt.style.display = 'none';
    }
});

dismissBtn.addEventListener('click', () => {
    installPrompt.style.display = 'none';
});

// Online/Offline Status
const offlineStatus = document.getElementById('offlineStatus');
window.addEventListener('online', () => {
    offlineStatus.textContent = 'Online';
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    offlineStatus.textContent = 'Offline';
    document.body.classList.add('offline');
});

// Visit Counter
let visitCount = localStorage.getItem('visitCount') || 0;
visitCount = parseInt(visitCount) + 1;
localStorage.setItem('visitCount', visitCount);
document.getElementById('visitCount').textContent = visitCount;

// Notes Feature (Offline Storage)
const notesTextarea = document.getElementById('notes');
const saveNotesBtn = document.getElementById('saveNotes');

const savedNotes = localStorage.getItem('notes') || '';
notesTextarea.value = savedNotes;

saveNotesBtn.addEventListener('click', () => {
    localStorage.setItem('notes', notesTextarea.value);
    saveNotesBtn.textContent = 'Saved! ✅';
    setTimeout(() => {
        saveNotesBtn.textContent = 'Save Notes';
    }, 2000);
});

// Load notes on input change
notesTextarea.addEventListener('input', () => {
    localStorage.setItem('notes', notesTextarea.value);
});