document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const imageUploadInput = document.getElementById('image-upload');
    
    // IMPORTANT: Replace with your actual Gemini API key
    // For a real application, you should handle this on a server-side backend for security.
    const GEMINI_API_KEY = 'AIzaSyBsbvLMhfjuzfvRHb4bRJfTmfzdCsd6EZI';

    // Function to add a message to the chat window
    function addMessage(message, sender, type = 'text') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        if (type === 'image') {
            const img = document.createElement('img');
            img.src = message;
            img.classList.add('image-message');
            messageDiv.appendChild(img);
        } else {
            messageDiv.textContent = message;
        }

        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Function to call the Gemini API
    async function getGeminiResponse(message, imageData = null) {
        addMessage('...', 'bot'); // Show a typing indicator
        const typingIndicator = chatWindow.lastChild;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`;
        const headers = { 'Content-Type': 'application/json' };
        
        let contents;

        if (imageData) {
            // Send both image and text
            contents = [
                {
                    parts: [
                        { text: message },
                        {
                            inlineData: {
                                mimeType: 'image/jpeg', // Adjust based on your image type
                                data: imageData.split(',')[1] // Base64 data without the prefix
                            }
                        }
                    ]
                }
            ];
        } else {
            // Send only text
            contents = [
                {
                    parts: [
                        { text: message }
                    ]
                }
            ];
        }
        
        const body = JSON.stringify({ contents });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: body
            });

            const data = await response.json();
            
            // Remove typing indicator
            chatWindow.removeChild(typingIndicator);

            if (data.candidates && data.candidates.length > 0) {
                const botResponse = data.candidates[0].content.parts[0].text;
                addMessage(botResponse, 'bot');
            } else {
                addMessage('Sorry, I could not generate a response.', 'bot');
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            chatWindow.removeChild(typingIndicator);
            addMessage('An error occurred. Please try again later.', 'bot');
        }
    }

    // Event listener for sending a text message
    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            getGeminiResponse(message);
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
                const imageData = event.target.result;
                addMessage(imageData, 'user', 'image');
                // Use a descriptive message along with the image
                const message = "Please describe or analyze this image.";
                getGeminiResponse(message, imageData);
            };
            reader.readAsDataURL(file);
        }
    });
});
