// Function to detect bots
function isBot() {
    const botPatterns = [
        'bot', 'spider', 'crawl', 'headless',
        'selenium', 'puppeteer', 'chrome-lighthouse'
    ];
    
    const userAgent = navigator.userAgent.toLowerCase();
    return botPatterns.some(pattern => userAgent.includes(pattern));
}

// Function to get device type
function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'Mobile';
    }
    return 'Desktop';
}

// Function to get browser information
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = '';

    if (ua.includes('Firefox/')) {
        browserName = 'Firefox';
        browserVersion = ua.split('Firefox/')[1];
    } else if (ua.includes('Chrome/')) {
        browserName = 'Chrome';
        browserVersion = ua.split('Chrome/')[1].split(' ')[0];
    } else if (ua.includes('Safari/')) {
        browserName = 'Safari';
        browserVersion = ua.split('Version/')[1].split(' ')[0];
    } else if (ua.includes('Edge/')) {
        browserName = 'Edge';
        browserVersion = ua.split('Edge/')[1];
    }

    return `${browserName} ${browserVersion}`;
}

// Function to send email through Netlify Function
async function sendNotificationEmail(deviceType, browserInfo) {
    try {
        const response = await fetch('.netlify/functions/send-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                deviceType,
                browserInfo,
                pageUrl: window.location.href,
                referrer: document.referrer || 'Direct visit',
                timestamp: new Date().toLocaleString()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// Main function to handle visitor notification
async function handleVisitorNotification() {
    // Check if it's a bot
    if (isBot()) {
        console.log('Bot visit detected - no notification sent');
        return;
    }

    // Get last visit timestamp from localStorage
    const lastVisit = localStorage.getItem('lastVisitTimestamp');
    const currentTime = Date.now();
    
    // Only send notification if it's been more than 24 hours since last visit
    if (!lastVisit || (currentTime - parseInt(lastVisit)) > 24 * 60 * 60 * 1000) {
        try {
            const deviceType = getDeviceType();
            const browserInfo = getBrowserInfo();
            
            const emailSent = await sendNotificationEmail(deviceType, browserInfo);
            
            if (emailSent) {
                localStorage.setItem('lastVisitTimestamp', currentTime.toString());
                console.log('Visitor notification sent successfully');
            }
        } catch (error) {
            console.error('Error sending visitor notification:', error);
        }
    } else {
        console.log('Recent visit detected - no notification sent');
    }
}

// Initialize when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleVisitorNotification);
} else {
    handleVisitorNotification();
}