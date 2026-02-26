import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const exportTripToPDF = async (trip: any) => {
  try {
    let activitiesHtml = '';
    
    trip.tripDetails.forEach((day: any) => {
      activitiesHtml += `
        <div class="day-container">
          <h2>Day ${day.day}: ${day.theme}</h2>
          ${day.activities.map((act: any) => `
            <div class="activity">
              <div class="time">${act.time}</div>
              <div class="details">
                <h3>${act.activity}</h3>
                <p>📍 ${typeof act.location === 'string' ? act.location : act.location?.formattedAddress || 'Unknown'}</p>
                <p>${act.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    });

    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #22c55e; text-align: center; }
            .header { text-align: center; margin-bottom: 30px; }
            .day-container { margin-bottom: 30px; page-break-inside: avoid; }
            h2 { color: #111; border-bottom: 2px solid #22c55e; padding-bottom: 5px; }
            .activity { display: flex; margin-bottom: 15px; background: #f9f9f9; padding: 15px; border-radius: 8px; }
            .time { font-weight: bold; width: 120px; color: #22c55e; }
            .details h3 { margin: 0 0 5px 0; font-size: 16px; }
            .details p { margin: 0; font-size: 14px; color: #555; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${trip.tripTitle}</h1>
            <p>📍 ${trip.destination} | ⏱ ${trip.duration} Days | 👥 ${trip.travelers} Travelers</p>
          </div>
          ${activitiesHtml}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ 
        html,
        base64: false 
    });

    await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: 'Download Trip Itinerary'
    });

  } catch (error) {
    console.error("PDF Generation failed:", error);
  }
};