// GLOBAL SIMULATION STATE CONTROLLER
let state = {
    users: [],
    currentUser: null,
    currentIp: "127.0.0.1"
};

// Global variables to store temporary Base64 image attachments strings
let activeUserAttachmentBase64 = null;
let activeAdminAttachmentBase64 = null;

// UNIVERSAL DYNAMIC GLOBAL CURRENCY MAPPING ENGINE
// Provides comprehensive coverage for standard global currency formatting protocols fallback
const baseCurrencySymbolMap = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'NGN': '₦', 'INR': '₹', 'ZAR': 'R',
    'CAD': 'C$', 'AUD': 'A$', 'JPY': '¥', 'CNY': '¥', 'RUB': '₽', 'KRW': '₩',
    'GHS': 'GH₵', 'KES': 'Ksh', 'ZMW': 'ZK', 'EGP': 'E£', 'AED': 'د.إ', 'SAR': 'ر.س',
    'CHF': 'CHF', 'NZD': 'NZ$', 'SGD': 'S$', 'HKD': 'HK$', 'MXN': 'Mex$', 'BRL': 'R$'
};

// Function that maps standard ISO country codes dynamically to their localized currency representation 
function getCurrencyDetailsByCountry(countryCode) {
    if (!countryCode) return { icon: '$', code: 'USD' };
    const code = countryCode.toUpperCase();
    
    // Auto-resolve currency code via JavaScript Native Localization engine dictionary
    let determinedCurrencyCode = 'USD';
    try {
        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currencyDisplay: 'code', currency: 'USD' });
        // Use default regional identifiers matching to target currency codes loops
        const options = new Intl.NumberFormat(`en-${code}`).resolvedOptions();
        if (options && options.currency) {
            determinedCurrencyCode = options.currency;
        }
    } catch (e) {
        // Safe fallbacks configuration for standard manual configurations if native lookup triggers errors
        const explicitOverrides = {
            'US': 'USD', 'GB': 'GBP', 'NG': 'NGN', 'IN': 'INR', 'ZA': 'ZAR', 'CA': 'CAD',
            'AU': 'AUD', 'JP': 'JPY', 'CN': 'CNY', 'GH': 'GHS', 'KE': 'KES', 'ZM': 'ZMW',
            'EG': 'EGP', 'AE': 'AED', 'SA': 'SAR', 'CH': 'CHF', 'NZ': 'NZD', 'SG': 'SGD',
            'HK': 'HKD', 'MX': 'MXN', 'BR': 'BRL', 'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'ES': 'EUR'
        };
        if (explicitOverrides[code]) determinedCurrencyCode = explicitOverrides[code];
    }

    // Resolve or find the structural icon glyph graphic symbols formatting parameters
    let symbol = baseCurrencySymbolMap[determinedCurrencyCode] || determinedCurrencyCode;
    
    // Render custom font styling structures based on the target currency design values matches
    let iconHtml = `<span class="text-purple-900 font-black font-mono text-2xl">${symbol}</span>`;
    
    return {
        icon: iconHtml,
        code: determinedCurrencyCode
    };
}

window.addEventListener('DOMContentLoaded', () => {
    initializeMockDatabase();
    fetchClientGeolocationIP();
    checkActiveSession();
});

function initializeMockDatabase() {
    const savedData = localStorage.getItem('wildpay_db');
    if (savedData) {
        state = JSON.parse(savedData);
    } else {
        state.users = [
            {
                email: 'admin@wildpay.internal',
                password: 'admin123',
                name: 'System Root Admin',
                phone: '+1 (000) 000-0000',
                country: 'US',
                isAdmin: true,
                balance: 0.00,
                transactions: [],
                notifications: [],
                messages: []
            },
            {
                email: 'demo@wildpay.io',
                password: 'password123',
                name: 'Jane Doe',
                phone: '+234 812 345 6789',
                country: 'NG', 
                isAdmin: false,
                balance: 0.00, 
                transactions: [], 
                notifications: ['Welcome to WildPay Sandbox! Your global account configuration routing nodes are active.'],
                messages: [{ sender: 'support', text: 'Hello, welcome to WildPay support channels! How can we help you today?', image: null }]
            }
        ];
        saveDatabaseState();
    }
}

function saveDatabaseState() {
    localStorage.setItem('wildpay_db', JSON.stringify(state));
}

async function fetchClientGeolocationIP() {
    try {
        const response = await fetch('https://ipapi.co');
        const data = await response.json();
        if (data.ip) {
            state.currentIp = data.ip;
            document.getElementById('dash-ip').innerText = data.ip;
            // Auto inject real time location mapping directly on form selectors to simplify creation
            if (data.country_code) {
                const regCountrySelect = document.getElementById('reg-country');
                if (regCountrySelect) {
                    // Generate new custom option entry dynamically if it isn't listed inside the core markup template
                    if (!Array.from(regCountrySelect.options).some(opt => opt.value === data.country_code)) {
                        const opt = document.createElement('option');
                        opt.value = data.country_code;
                        opt.innerText = `${data.country_name || data.country_code} (Auto IP Checked)`;
                        regCountrySelect.appendChild(opt);
                    }
                    regCountrySelect.value = data.country_code;
                }
            }
        }
    } catch (err) {
        state.currentIp = "192.168.1.100";
        document.getElementById('dash-ip').innerText = state.currentIp;
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const matchedUser = state.users.find(u => u.email === email && u.password === password);
    
    if (matchedUser) {
        state.currentUser = matchedUser.email;
        saveDatabaseState();
        routeInterfaceView();
    } else {
        alert("Authentication Rejected: Invalid Credentials.");
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const country = document.getElementById('reg-country').value; 
    const password = document.getElementById('reg-password').value;

    if (state.users.some(u => u.email === email)) {
        alert("Account Creation Fault: Email already exists.");
        return;
    }

    const newClient = {
        email, password, name, phone, country,
        isAdmin: false,
        balance: 0.00, 
        transactions: [], 
        notifications: [`Account registered successfully. Currency icon assigned permanently matching country mapping node: ${country}. Pending administrator funding operations.`],
        messages: [{ sender: 'support', text: `Greetings ${name}, welcome to your WildPay support secure helpdesk channel.`, image: null }]
    };

    state.users.push(newClient);
    state.currentUser = newClient.email;
    saveDatabaseState();
    routeInterfaceView();
    document.getElementById('register-form').reset();
}

function checkActiveSession() {
    if (state.currentUser) {
        routeInterfaceView();
    }
}

function logout() {
    state.currentUser = null;
    saveDatabaseState();
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('nav-actions').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
}

function routeInterfaceView() {
    const user = state.users.find(u => u.email === state.currentUser);
    if (!user) return;

    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('nav-actions').classList.remove('hidden');
    document.getElementById('user-badge').innerText = user.name + (user.isAdmin ? " (Admin Panel)" : "");

    if (user.isAdmin) {
        document.getElementById('user-dashboard').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        renderAdminDashboardConsole();
    } else {
        document.getElementById('admin-dashboard').classList.add('hidden');
        document.getElementById('user-dashboard').classList.remove('hidden');
        renderUserDashboardConsole(user);
    }
}

// --- CLIENT DASHBOARD SYSTEM CONTROLLERS ---
function renderUserDashboardConsole(user) {
    // RESOLVES DYNAMIC ONE-COUNTRY SPECIFIC FORMAT LOGIC ARRAYS 
    const currencyData = getCurrencyDetailsByCountry(user.country);
    
    document.getElementById('dash-currency-symbol').innerHTML = currencyData.icon;
    document.getElementById('dash-balance').innerText = user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('dash-name').innerText = user.name;
    document.getElementById('dash-phone').innerText = user.phone;
    document.getElementById('dash-country').innerText = `${user.country} (${currencyData.code})`;

    const notifBox = document.getElementById('notifications-box');
    notifBox.innerHTML = '';
    if (user.notifications.length === 0) {
        notifBox.innerHTML = `<p class="text-slate-400 italic">No alerts current.</p>`;
    } else {
        [...user.notifications].reverse().forEach(note => {
            const el = document.createElement('div');
            el.className = "bg-purple-50 p-2 border-l-2 border-purple-700 rounded text-slate-700 font-mono text-[11px]";
            el.innerText = note;
            notifBox.appendChild(el);
        });
    }

    const ledgerBody = document.getElementById('user-ledger-body');
    ledgerBody.innerHTML = '';
    
    if (user.transactions.length === 0) {
