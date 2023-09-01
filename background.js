chrome.action.onClicked.addListener(async (tab) => {
  const [tabInfo] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabInfo.id;

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: detectAndDisplayFiles
  });
});

function detectAndDisplayFiles() {
  const anchors = Array.from(document.getElementsByTagName('a'));
  const sitemapKeywords = ['sitemap.xml', 'plan-du-site.xml'];
  const robotsTxtKeywords = ['robots.txt'];

  let sitemapUrl = findFileUrl(anchors, sitemapKeywords);
  let robotsTxtUrl = findFileUrl(anchors, robotsTxtKeywords);

  if (sitemapUrl) {
    fetchAndDisplay(sitemapUrl);
  } else {
    displayContent('Aucune référence à sitemap.xml trouvée sur cette page');
  }

  if (robotsTxtUrl) {
    fetchAndDisplay(robotsTxtUrl);
  } else {
    displayContent('Aucune référence à robots.txt trouvée sur cette page');
  }
}

function findFileUrl(elements, keywords) {
  for (const element of elements) {
    const href = element.getAttribute('href');
    if (href) {
      for (const keyword of keywords) {
        if (href.includes(keyword)) {
          return new URL(href, window.location.href).href;
        }
      }
    }
  }
  return null;
}

function fetchAndDisplay(url) {
  // Logique pour récupérer et afficher le contenu du fichier
}