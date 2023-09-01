document.addEventListener('DOMContentLoaded', function() {
  var tabs = document.getElementsByClassName('tabButton');
  var contentContainer = document.getElementById('contentContainer');
  var fileNameContainer = document.getElementById('fileName');
  var copyButton = document.getElementById('copyButton');
  var refreshButton = document.getElementById('refreshButton');
  var loader = document.getElementById('loader');
  var statusMessage = document.getElementById('statusMessage');
  var tabHeader = document.getElementById('tabHeader'); // Add tab header element
  var infoMessage = document.getElementById('infoMessage'); // Add info message element
  
  function showLoader() {
    loader.style.display = 'block';
  }
  
  function hideLoader() {
    loader.style.display = 'none';
  }
  
  function showStatusMessage(message) {
    statusMessage.innerText = message;
    setTimeout(function() {
      statusMessage.innerText = '';
    }, 2000);
  }
  
  function setActiveTab(tabIndex) {
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active');
      tabs[i].classList.add('inactive');
    }
  
    tabs[tabIndex].classList.remove('inactive');
    tabs[tabIndex].classList.add('active');
  }
  
  
  function displayContent(content, fileName) {
    contentContainer.innerText = content;
    fileNameContainer.innerText = fileName;
  }
  
  function copyContent() {
    var content = contentContainer.innerText;
  
    var textarea = document.createElement('textarea');
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  
    copyButton.innerText = 'Copié !';
    setTimeout(function() {
      copyButton.innerText = 'Copier';
    }, 2000);
  }
  
  function refreshContent(tabIndex) {
    showLoader();
    showStatusMessage('Actualisation en cours...');
    
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tab = tabs[0];
      var url = tab.url;
  
      if (url) {
        var targetUrl = tabIndex === 0 ? url + '/robots.txt' : url + '/sitemap.xml';
        var targetFileName = tabIndex === 0 ? 'robots.txt' : 'sitemap.xml';
  
        fetch(targetUrl)
          .then(response => response.text())
          .then(data => {
            hideLoader();
            displayContent(data, targetFileName);
            showStatusMessage('Contenu actualisé');
          })
          .catch(error => {
            hideLoader();
            showStatusMessage('Erreur lors de l\'actualisation');
            displayContent('Impossible de récupérer le fichier ' + targetFileName);
          });
      }
    });
  }
  
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function() {
      var tabIndex = Array.from(tabs).indexOf(this);
      setActiveTab(tabIndex);
      refreshContent(tabIndex);
    });
  }
  
  copyButton.addEventListener('click', copyContent);
  
  refreshButton.addEventListener('click', function() {
    var activeTabIndex = Array.from(tabs).findIndex(tab => tab.classList.contains('active'));
    refreshContent(activeTabIndex);
  });
  
  // Default behavior
  setActiveTab(0);
  refreshContent(0);
  
  // Add listener for info message
  infoMessage.addEventListener('click', function() {
    infoMessage.style.display = 'none';
  });
});

function fetchAndDisplay(url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      displayContent(data);
    })
    .catch(error => {
      displayContent('Impossible de récupérer le fichier');
    });
}