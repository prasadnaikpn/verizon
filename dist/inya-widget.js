class InyaTranscript extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .widget-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 16px;
          max-width: 100%;
          height: 400px;
          display: flex;
          flex-direction: column;
        }
        
        .widget-title {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
        
        .chat-container {
          flex: 1;
          overflow-y: auto;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 12px;
          background-color: #f8f9fa;
          margin-bottom: 12px;
        }
        
        .message {
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
        }
        
        .message-header {
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .message.user .message-header {
          text-align: right;
        }
         
        .message-bubble {
          padding: 8px 12px;
          border-radius: 12px;
          max-width: 80%;
          word-wrap: break-word;
          line-height: 1.4;
        }
        
        .message.assistant .message-bubble {
          background-color: #007bff;
          color: white;
          align-self: flex-start;
        }
        
        .message.user .message-bubble {
          background-color: #e9ecef;
          color: #333;
          align-self: flex-end;
        }
        
        .info-section {
          margin-top: 8px;
          font-size: 14px;
          color: #666;
        }
        
        .info-item {
          margin-bottom: 4px;
        }
        
        /* Scrollbar styling */
        .chat-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .chat-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .chat-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      </style>
      <div class="widget-container">
        <h3 class="widget-title">Session Transcript</h3>
        <div id="chat-container" class="chat-container">
          <div style="text-align: center; color: #6c757d; padding: 20px;">
            No transcript available yet
          </div>
        </div>
        <div class="info-section">
          <div id="agent" class="info-item"></div>
          <div id="darkmode" class="info-item"></div>
          <div id="callprocessingdetails" class="info-item"></div>
        </div>
      </div>
    `;
  }

  set darkMode(value) {
    this.shadowRoot.host.style.background = value ? "#222" : "#fff";
    this.shadowRoot.host.style.color = value ? "#fff" : "#000";
  }

  // set selectedTaskId(value) {
  //   this.selectedTaskId = value;
  // }

  // set accessToken(value) {
  //   this.accessToken = value;
  // }

  renderTranscript(messages) {
    const chatContainer = this.shadowRoot.getElementById('chat-container');
    
    
    // Clear the container
    chatContainer.innerHTML = '';
    
    // Render each message
    messages.forEach(message => {
      const messageElement = this.createMessageElement(message);
      chatContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  getReadableTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.role}`;
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    headerDiv.textContent = `${this.capitalizeFirstLetter(message.role)} • ${this.getReadableTimestamp(message.timestamp)}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = message.content;
    
    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(bubbleDiv);
    
    return messageDiv;
  }

  fetchTranscript() {
    const [_, conversationId] = window.location.pathname.split('/task/');

    if(!conversationId){
      return
    }
    
    fetch(`https://68c96696ceef5a150f64b6fa.mockapi.io/inya/transcript/1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken || 'yet_to_be_set'}`
      }
    })
    .then(response => response.json())
    .then(data => {
      this.renderTranscript(data.transcript);
    })
    .catch(error => {
      console.error("Failed to fetch transcript", error);
    });
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    this.fetchTranscript()
    const content = this.shadowRoot.getElementById('content');
    if(content){
      content.innerText = "Please wait while we load the transcript...";
    }
  }
}

customElements.define('inya-transcript', InyaTranscript);
