document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const imageUploadInput = document.getElementById('image-upload');

    // Function to add a message to the chat window
    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = message;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the bottom
    }

    // Function to add an image to the chat window
    function addImage(imageData) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');
        const img = document.createElement('img');
        img.src = imageData;
        img.classList.add('image-message');
        messageDiv.appendChild(img);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Event listener for sending a text message
    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            // This is where you would handle the chatbot response
            // For example, a simulated bot response:
            setTimeout(() => {
                addMessage("Hello! How can I help you?", 'bot');
            }, 500);
            userInput.value = '';
        }
    });

    // Event listener for "Enter" key in the text area
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    // Event listener for the image upload button
    uploadBtn.addEventListener('click', () => {
        imageUploadInput.click();
    });

    // Event listener for when an image is selected
    imageUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                addImage(event.target.result);
                // You can send the image data to your backend for processing here
                // For example: sendMessageToBot(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Initial bot message
    addMessage("Hello! I'm a simple chatbot. You can type a message or upload an image.", 'bot');
});
