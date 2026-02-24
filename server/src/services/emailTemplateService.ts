//import type { IInsight } from '../types';
//import  Trend  from '../models/Trend';
//import { formatFullDate } from '../utils/formatDate';

/**
 * Email template service
 * Generates HTML and text versions of newsletters
 */

interface NewsletterContent {
  insights: any[];
  trends: any[];
  topHeadlines: any[];
  stats: {
    totalArticles: number;
    topSources: Array<{ source: string; count: number }>;
  };
}

/**
 * Generate HTML email template
 */
export function generateNewsletterHTML(content: NewsletterContent): string {
  const { insights, trends, topHeadlines, stats } = content;
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feed Frenzy Weekly</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #0D0D0D;
      color: #F0F0F0;
      line-height: 1.6;
      padding: 0;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #141414;
    }
    .header {
      background: linear-gradient(135deg, #FFE500 0%, #FF9500 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 4px;
      color: #0D0D0D;
      margin: 0;
    }
    .header p {
      font-size: 12px;
      color: #0D0D0D;
      margin-top: 8px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .content {
      padding: 30px 20px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #FFE500;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #2A2A2A;
    }
    .insight-card {
      background-color: #1C1C1C;
      border-left: 3px solid #FFE500;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .insight-card.featured {
      background-color: rgba(255, 229, 0, 0.05);
      border-left-color: #FFE500;
    }
    .insight-type {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 4px 8px;
      border-radius: 3px;
      margin-bottom: 12px;
      background-color: rgba(255, 229, 0, 0.15);
      color: #FFE500;
    }
    .insight-title {
      font-size: 18px;
      font-weight: 700;
      color: #F0F0F0;
      margin-bottom: 10px;
      line-height: 1.3;
    }
    .insight-body {
      font-size: 14px;
      color: #A0A0A0;
      line-height: 1.6;
    }
    .trend-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin-bottom: 10px;
      background-color: #1C1C1C;
      border-radius: 4px;
      border-left: 3px solid #00FF94;
    }
    .trend-keyword {
      font-size: 16px;
      font-weight: 700;
      color: #F0F0F0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .trend-stats {
      font-size: 11px;
      color: #555555;
      margin-top: 4px;
    }
    .trend-badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 8px;
      border-radius: 3px;
      background-color: rgba(0, 255, 148, 0.15);
      color: #00FF94;
    }
    .headline-item {
      padding: 15px 0;
      border-bottom: 1px solid #2A2A2A;
    }
    .headline-item:last-child {
      border-bottom: none;
    }
    .headline-source {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #FFE500;
      margin-bottom: 8px;
    }
    .headline-title {
      font-size: 14px;
      font-weight: 600;
      color: #F0F0F0;
      margin-bottom: 6px;
      line-height: 1.4;
    }
    .headline-title a {
      color: #F0F0F0;
      text-decoration: none;
    }
    .headline-title a:hover {
      color: #FFE500;
    }
    .stats-grid {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-box {
      flex: 1;
      background-color: #1C1C1C;
      padding: 20px;
      border-radius: 4px;
      text-align: center;
    }
    .stat-number {
      font-size: 32px;
      font-weight: 900;
      color: #FFE500;
      margin-bottom: 8px;
    }
    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #555555;
    }
    .footer {
      background-color: #0D0D0D;
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid #2A2A2A;
    }
    .footer p {
      font-size: 11px;
      color: #555555;
      margin-bottom: 10px;
    }
    .footer a {
      color: #FFE500;
      text-decoration: none;
    }
    .unsubscribe {
      font-size: 10px;
      color: #555555;
      margin-top: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #FFE500;
      color: #0D0D0D;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
    }
    @media only screen and (max-width: 600px) {
      .stats-grid { flex-direction: column; }
      .header h1 { font-size: 28px; }
      .insight-title { font-size: 16px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>FEED FRENZY</h1>
      <p>${date} • Weekly Digest</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-number">${stats.totalArticles}</div>
          <div class="stat-label">Articles Scraped</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${trends.length}</div>
          <div class="stat-label">Trends Detected</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${insights.length}</div>
          <div class="stat-label">Insights Generated</div>
        </div>
      </div>

      <!-- Top Insights -->
      ${insights.length > 0 ? `
      <div class="section">
        <h2 class="section-title">🔥 Top Insights This Week</h2>
        ${insights.slice(0, 5).map(insight => `
          <div class="insight-card ${insight.featured ? 'featured' : ''}">
            <div class="insight-type">${insight.type}</div>
            <div class="insight-title">${insight.title}</div>
            <div class="insight-body">${insight.body}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Trending Keywords -->
      ${trends.length > 0 ? `
      <div class="section">
        <h2 class="section-title">📈 What's Trending</h2>
        ${trends.slice(0, 8).map(trend => `
          <div class="trend-item">
            <div>
              <div class="trend-keyword">${trend.keyword}</div>
              <div class="trend-stats">${trend.count} mentions • ${trend.velocity.toFixed(1)}/day</div>
            </div>
            <div class="trend-badge">${trend.status}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Top Headlines -->
      ${topHeadlines.length > 0 ? `
      <div class="section">
        <h2 class="section-title">📰 Must-Read Headlines</h2>
        ${topHeadlines.slice(0, 10).map(headline => `
          <div class="headline-item">
            <div class="headline-source">${headline.source}</div>
            <div class="headline-title">
              <a href="${headline.url}" target="_blank">${headline.title}</a>
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- CTA -->
      <div style="text-align: center; padding: 40px 0;">
        <p style="color: #A0A0A0; margin-bottom: 10px;">Want to dive deeper?</p>
        <a href="https://feedfrenzy.com" class="button">Visit Feed Frenzy</a>
      </div>

      <!-- Top Sources -->
      ${stats.topSources.length > 0 ? `
      <div class="section">
        <h2 class="section-title">📊 Top Sources This Week</h2>
        <div style="font-size: 12px; color: #A0A0A0;">
          ${stats.topSources.slice(0, 5).map(s => `${s.source}: ${s.count} articles`).join(' • ')}
        </div>
      </div>
      ` : ''}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>The internet is talking. We're just keeping score.</p>
      <p>
        <a href="https://feedfrenzy.com">Visit Feed Frenzy</a> • 
        <a href="https://feedfrenzy.com/insights">View Insights</a> • 
        <a href="https://feedfrenzy.com/trends">See Trends</a>
      </p>
      <div class="unsubscribe">
        <a href="{{unsubscribeUrl}}" style="color: #555555;">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version
 */
export function generateNewsletterText(content: NewsletterContent): string {
  const { insights, trends, topHeadlines, stats } = content;
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  let text = `
FEED FRENZY - ${date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 THIS WEEK'S STATS
Articles: ${stats.totalArticles} | Trends: ${trends.length} | Insights: ${insights.length}

`;

  if (insights.length > 0) {
    text += `
🔥 TOP INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${insights.slice(0, 5).map((insight, i) => `
${i + 1}. ${insight.title}
   ${insight.body}
`).join('\n')}
`;
  }

  if (trends.length > 0) {
    text += `
📈 WHAT'S TRENDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${trends.slice(0, 8).map((trend, i) => `
${i + 1}. ${trend.keyword.toUpperCase()}
   ${trend.count} mentions • ${trend.velocity.toFixed(1)}/day • ${trend.status}
`).join('\n')}
`;
  }

  if (topHeadlines.length > 0) {
    text += `
📰 MUST-READ HEADLINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${topHeadlines.slice(0, 10).map((headline, i) => `
${i + 1}. ${headline.title}
   ${headline.source} • ${headline.url}
`).join('\n')}
`;
  }

  text += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Visit Feed Frenzy: https://feedfrenzy.com
Unsubscribe: {{unsubscribeUrl}}

The internet is talking. We're just keeping score.
`;

  return text.trim();
}