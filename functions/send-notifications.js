// netlify/functions/track-visit.js
const { Resend } = require('resend');

// List of known bot user agent patterns
const botPatterns = [
  /bot/i,
  /spider/i,
  /crawl/i,
  /APIs-Google/i,
  /AdsBot/i,
  /Googlebot/i,
  /mediapartners/i,
  /Google Favicon/i,
  /FeedFetcher/i,
  /Google-Read-Aloud/i,
  /DuplexWeb-Google/i,
  /googleweblight/i,
  /bing/i,
  /yandex/i,
  /baidu/i,
  /duckduck/i,
  /yahoo/i,
  /ecosia/i,
  /ia_archiver/i,
  /semrush/i,
  /similarsitesearch/i,
  /bufferbot/i,
  /discord/i,
  /telegram/i,
  /facebook/i,
  /whatsapp/i,
  /slurp/i,
  /lighthouse/i,
  /pingdom/i,
  /chrome-lighthouse/i
];

// Function to detect device type from user agent
function getDeviceType(userAgent) {
  if (!userAgent) return 'Unknown';
  
  // Check for mobile devices
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(userAgent.substr(0, 4))) {
    return 'Mobile';
  }
  
  // Check for tablets
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(userAgent)) {
    return 'Tablet';
  }
  
  // Default to desktop
  return 'Desktop';
}

// Function to check if request is from a bot
function isBot(userAgent) {
  if (!userAgent) return true;
  return botPatterns.some(pattern => pattern.test(userAgent));
}

exports.handler = async (event) => {
  // Only handle GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const userAgent = event.headers['user-agent'] || '';
  const ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'Unknown IP';
  
  // Check if request is from a bot
  if (isBot(userAgent)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Bot request ignored' })
    };
  }

  const deviceType = getDeviceType(userAgent);
  
  // Initialize Resend
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Send email notification
    await resend.emails.send({
      from: 'your-verified-domain@resend.dev',
      to: process.env.NOTIFICATION_EMAIL, // Your email address
      subject: `New Website Visit from ${deviceType} Device`,
      text: `
        New visit to your website:
        
        Device Type: ${deviceType}
        IP Address: ${ip}
        User Agent: ${userAgent}
        Time: ${new Date().toISOString()}
        
        Path: ${event.path}
        Referrer: ${event.headers.referer || 'Direct visit'}
      `
    });

    // Return a 1x1 transparent GIF
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process visit' })
    };
  }
};